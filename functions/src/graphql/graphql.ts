import * as functions from "firebase-functions";
import {
  ApolloServer,
  ApolloError,
  ValidationError,
  gql,
} from "apollo-server-express";
import express from "express";
// eslint-disable-next-line no-unused-vars
import {Article} from "./utils/interfaces/Article";
// eslint-disable-next-line no-unused-vars
import {User} from "./utils/interfaces/User";
// eslint-disable-next-line no-unused-vars
import {ArticleVersion} from "./utils/interfaces/ArticleVersion";
// eslint-disable-next-line no-unused-vars
import {UserArticleLike} from "./utils/interfaces/UserArticleLike";
// eslint-disable-next-line no-unused-vars
import {Tag} from "./utils/interfaces/Tag";
const fbApp = require("../initializeApp");

const typeDefs = gql`
  type Tag {
    name: String!
  }

  type User {
    displayName: String!
    email: String!
    articles: [Articles]
    likedArticles: [UserArticleLike]
    tags: [String]
  }

  type Articles {
    uid: String!
    title: String!
    dateOfCreation: String!
    dateOfLastUpdate: String!
    totalLikes: Int!
    versions: [ArticleVersions]!
    currentVersion: ArticleVersions
    tags: [String]!
    user: User!
    likedBy: [UserArticleLike]!
    isLikedByReader(readerUid: String): Boolean
  }

  type ArticleVersions {
    uid: String!
    content: String
    dateOfCreation: String
    dateOfLastUpdate: String
    likes: Int
    state: String
    versionNumber: Int
    article: Articles
  }

  type UserArticleLike {
    article: Articles!
    articleVersion: ArticleVersions!
    user: User!
  }

  type Query {
    tags: [Tag]
    articles(tags: [String]): [Articles]
    articlesOfUser(displayName: String!): [Articles]
    article(displayName: String!, title: String!, readerUid: String): Articles
    profile(displayName: String!): User
  }
`;

const resolvers = {
  User: {
    async articles(user: any) {
      try {
        const userArticles = await fbApp.admin
            .firestore()
            .collection("articles")
            .where("authorUid", "==", user.uid)
            .get();

        return userArticles.docs.map((article: any) => article.data()) as Article[];
      } catch (e) {
        throw new ApolloError(e);
      }
    },
    async likedArticles(user: any) {
      try {
        const likedArticles = await fbApp.admin
            .firestore()
            .collection("userArticleLike")
            .where("userUid", "==", user.uid)
            .get();

        return likedArticles.docs.map((article: any) => article.data()) as UserArticleLike[];
      } catch (e) {
        throw new ApolloError(e);
      }
    },
  },
  Articles: {
    async user(article: any) {
      try {
        const articleAuthor = await fbApp.admin
            .firestore()
            .doc(`users/${article.authorUid}`)
            .get();

        return articleAuthor.data() as User;
      } catch (e) {
        throw new ApolloError(e);
      }
    },
    async versions(article: any) {
      try {
        const articleVersion = await fbApp.admin
            .firestore()
            .collection("articles")
            .doc(article.uid)
            .collection("versions")
            .get();

        return articleVersion.docs.map((version: any) => version.data()) as ArticleVersion[];
      } catch (e) {
        throw new ApolloError(e);
      }
    },
    async currentVersion(article: any) {
      if (article.currentVersion !== "") {
        try {
          const currentVersion = await fbApp.admin
              .firestore()
              .doc(`/articles/${article.uid}/versions/${article.currentVersion}`)
              .get();

          return currentVersion.data() as ArticleVersion;
        } catch (e) {
          throw new ApolloError(e);
        }
      }

      return {} as ArticleVersion;
    },
    async likedBy(article: any) {
      if (article.currentVersion !== "") {
        try {
          const userArticleLike = await fbApp.admin
              .firestore()
              .collection("userArticleLike")
              .where("articleUid", "==", article.uid)
              .get();

          return userArticleLike.docs.map((like: any) => like.data()) as UserArticleLike[];
        } catch (e) {
          throw new ApolloError(e);
        }
      }

      return {} as UserArticleLike;
    },
    async isLikedByReader(article:any, args: any) {
      try {
        const userArticleLike = await fbApp.admin
            .firestore()
            .collection("userArticleLike")
            .where("articleUid", "==", article.uid)
            .where("userUid", "==", args.readerUid)
            .get();

        return userArticleLike.docs.length > 0;
      } catch (e) {
        throw new ApolloError(e);
      }
    },
  },
  ArticleVersions: {
    async article(articleVersion: any) {
      try {
        const article = await fbApp.admin
            .firestore()
            .doc(`articles/${articleVersion.articleUid}`)
            .get();

        return article.data() as Article;
      } catch (e) {
        throw new ApolloError(e);
      }
    },
  },
  UserArticleLike: {
    async article(userArticleLike: any) {
      try {
        const article = await fbApp.admin
            .firestore()
            .doc(`articles/${userArticleLike.articleUid}`)
            .get();

        return article.data() as Article;
      } catch (e) {
        throw new ApolloError(e);
      }
    },
    async articleVersion(userArticleLike: any) {
      try {
        const articleVersion = await fbApp.admin
            .firestore()
            .doc(`articles/${userArticleLike.articleUid}/versions/${userArticleLike.articleVersionUid}`)
            .get();

        return articleVersion.data() as ArticleVersion;
      } catch (e) {
        throw new ApolloError(e);
      }
    },
    async user(userArticleLike: any) {
      try {
        const user = await fbApp.admin
            .firestore()
            .doc(`users/${userArticleLike.userUid}`)
            .get();

        return user.data() as User;
      } catch (e) {
        throw new ApolloError(e);
      }
    },
  },
  Query: {
    async tags() {
      try {
        const tags = await fbApp.admin
            .firestore()
            .collection("tags")
            .orderBy("name", "ASC")
            .get();

        return tags.docs.map((tag: any) => tag.data()) as Tag[];
      } catch (e) {
        throw new ApolloError(e);
      }
    },
    async articles(_: null, args:{tags: Array<String>|null}) {
      const articlesRef = fbApp.admin
          .firestore()
          .collection("articles");

      try {
        let articles = null;
        if (args.tags !== undefined && args.tags !== null && args.tags.length > 0) {
          articles = await articlesRef
              .where("tags", "array-contains-any", args.tags)
              .orderBy("dateOfLastUpdate", "DESC")
              .get();
        } else {
          articles = await articlesRef
              .orderBy("dateOfLastUpdate", "DESC")
              .get();
        }

        return articles.docs.map((article: any) => article.data()) as Article[];
      } catch (e) {
        throw new ApolloError(e);
      }
    },
    async articlesOfUser(_: null, args:{displayName: string}) {
      try {
        const userQuery = await fbApp.admin
            .firestore()
            .collection("users")
            .where("displayName", "==", args.displayName)
            .get();

        if (userQuery.docs.length === 0) {
          return new ValidationError("Author not found.");
        }
        try {
          const articleQuery = await fbApp.admin
              .firestore()
              .collection("articles")
              .where("authorUid", "==", userQuery.docs[0].id)
              .get();

          if (articleQuery.docs.length <= 0) {
            return new ValidationError("User not found.");
          }
          return articleQuery.docs.map((article: any) => article.data()) as Article[];
        } catch (e) {
          throw new ApolloError(e);
        }
      } catch (e) {
        throw new ApolloError(e);
      }
    },
    async article(_: null, args:{displayName: string, title: string, readerUid: string}) {
      try {
        const userQuery = await fbApp.admin
            .firestore()
            .collection("users")
            .where("displayName", "==", args.displayName)
            .get();

        if (userQuery.docs.length === 0) {
          return new ValidationError("Author not found.");
        }
        try {
          const articleQuery = await fbApp.admin
              .firestore()
              .collection("articles")
              .where("authorUid", "==", userQuery.docs[0].id)
              .where("title", "==", args.title)
              .get();

          if (articleQuery.docs.length <= 0) {
            return new ValidationError("Article not found.");
          }

          return articleQuery.docs[0].data() as Article;
        } catch (e) {
          throw new ApolloError(e);
        }
      } catch (e) {
        throw new ApolloError(e);
      }
    }, async profile(_: null, args: { displayName: string }) {
      try {
        const userQuery = await fbApp.admin
            .firestore()
            .collection("users")
            .where("displayName", "==", args.displayName)
            .get();

        const user = userQuery.docs[0].data() as User | undefined;

        return user || new ValidationError("User ID not found.");
      } catch (e) {
        throw new ApolloError(e);
      }
    },
  },
};


const app = express();
const server = new ApolloServer({typeDefs, resolvers, introspection: true});

server.applyMiddleware({app, path: "/"});
exports.graphql = functions
    .region("us-central1")
    .https.onRequest(app);
