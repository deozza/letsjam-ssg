import * as functions from "firebase-functions";
import {
  ApolloServer,
  ApolloError,
  ValidationError,
  gql,
} from "apollo-server-express";
import express from "express";
import {Article} from "./utils/interfaces/Article";
import {User} from "./utils/interfaces/User";
import {ArticleVersion} from "./utils/interfaces/ArticleVersion";
const fbApp = require("../initializeApp");


const typeDefs = gql`
  type User {
    displayName: String!
    email: String!
    articles: [Articles]!
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
    async profile(_: null, args: { displayName: string }) {
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
exports.graphql = functions.https.onRequest(app);
