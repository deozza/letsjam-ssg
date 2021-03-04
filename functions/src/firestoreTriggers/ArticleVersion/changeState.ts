const functions = require("firebase-functions");
const FieldValue = require("firebase-admin").FieldValue;
const fbApp = require("../../initializeApp");

const db = fbApp.admin.firestore();

exports.changeState = functions.firestore
    .document("articleVersion/{articleVersionUid}")
    .onUpdate((change: any) => {
      const newValue = change.after.data();
      const oldValue = change.before.data();
      if (newValue.state === "PUBLISHED" && newValue !== oldValue) {
        db.doc("articles/"+newValue.articleUid).update({currentVersion: newValue.uid, dateOfLastUpdate: FieldValue.serverTimestamp()});
        db.doc("articleVersion/"+newValue.uid).update({dateOfLastUpdate: FieldValue.serverTimestamp()});
      }
    });
