import * as admin from "firebase-admin";

const serviceAccount = require("../service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://letsjam-294614.firebaseio.com",
});

exports.admin = admin;
