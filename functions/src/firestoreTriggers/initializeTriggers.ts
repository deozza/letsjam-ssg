const functions = require("firebase-functions");
const fbApp = require("../initializeApp");

const db = fbApp.admin.firestore();
const FieldValue = db.FieldValue;
const FieldValueFromFirestore = fbApp.admin.firestore.FieldValue;
export {
  functions,
  FieldValue,
  db,
  FieldValueFromFirestore,
};
