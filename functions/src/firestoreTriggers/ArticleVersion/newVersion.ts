import {functions, db, FieldValue} from "../initializeTriggers";

exports.newVersion = functions.firestore
    .document("articleVersion/{articleVersionUid}")
    .onCreate((change: any) => {
      const newValue = change.data();

      db.doc("articles/"+newValue.articleUid).update({currentVersion: FieldValue.arrayUnion(newValue.uid)});
    });
