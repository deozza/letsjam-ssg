exports.graphql = require("./graphql/graphql");
exports.articleVersion = require("./firestoreTriggers/ArticleVersion/changeState");
exports.userArticleLike = require("./firestoreTriggers/UserArticleLike/newLike");
exports.article = require("./firestoreTriggers/Article/newArticle");
exports.nuxtssr = require("./ssr/index");
