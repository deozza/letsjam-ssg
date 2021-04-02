exports.graphql = require("./graphql/graphql");
exports.updateArticleVersion = require("./firestoreTriggers/ArticleVersion/updateVersion");
exports.newUserArticleLike = require("./firestoreTriggers/UserArticleLike/newLike");
exports.removeUserArticleLike = require("./firestoreTriggers/UserArticleLike/removeLike");
exports.newArticle = require("./firestoreTriggers/Article/newArticle");
exports.updateArticle = require("./firestoreTriggers/Article/updateArticle");
exports.removeArticle = require("./firestoreTriggers/Article/removeArticle");
exports.nuxtssr = require("./ssr/index");
