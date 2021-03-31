exports.graphql = require("./graphql/graphql");
exports.articleVersion = require("./firestoreTriggers/ArticleVersion/changeState");
exports.newUserArticleLike = require("./firestoreTriggers/UserArticleLike/newLike");
exports.removeUserArticleLike = require("./firestoreTriggers/UserArticleLike/removeLike");
exports.newArticle = require("./firestoreTriggers/Article/newArticle");
exports.removeArticle = require("./firestoreTriggers/Article/removeArticle");
exports.nuxtssr = require("./ssr/index");
