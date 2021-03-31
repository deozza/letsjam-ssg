exports.graphql = require("./graphql/graphql");
exports.articleVersion = require("./firestoreTriggers/ArticleVersion/changeState");
exports.userArticleLike = require("./firestoreTriggers/UserArticleLike/newLike");
exports.nuxtssr = require("./ssr/index");
