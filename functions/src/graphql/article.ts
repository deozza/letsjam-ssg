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
const fbApp = require("../initializeApp");


const typeDefs = gql`
  type User {
    displayName: String!
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

  type Query {
    articles: [Articles]
    article(displayName: String!, title: String!): Articles
  }
`;

const resolvers = {
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
            .collection("articleVersion")
            .where("articleUid", "==", article.uid)
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
              .doc(`articleVersion/${article.currentVersion}`)
              .get();

          return currentVersion.data() as ArticleVersion;
        } catch (e) {
          throw new ApolloError(e);
        }
      }

      return {} as ArticleVersion;
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
  Query: {
    async articles() {
      try {
        const articles = await fbApp.admin
            .firestore()
            .collection("articles")
            .orderBy("dateOfLastUpdate", "DESC")
            .get();

        return articles.docs.map((article: any) => article.data()) as Article[];
      } catch (e) {
        throw new ApolloError(e);
      }
    },
    async article(_: null, args:{displayName: string, title: string}) {
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
    },
  },
};


const app = express();
const server = new ApolloServer({typeDefs, resolvers, introspection: true});

server.applyMiddleware({app, path: "/"});
exports.graphql = functions.https.onRequest(app);
