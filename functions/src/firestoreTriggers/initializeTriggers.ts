const functions = require("firebase-functions");
const fbApp = require("../initializeApp");

const db = fbApp.admin.firestore();
const FieldValue = db.FieldValue;

export {
  functions,
  FieldValue,
  db,
};
