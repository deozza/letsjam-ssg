import {functions, FieldValue, db} from "../initializeTriggers";

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
