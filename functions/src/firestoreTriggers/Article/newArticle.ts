import {functions, db} from "../initializeTriggers";

exports.addTags = functions
    .region("us-central1")
    .firestore
    .document("articles/{articlesUid}")
    .onCreate((snap: any) => {
      const newValue = snap.data();
      newValue.tags.forEach((tag: string) => {
        try {
          db.doc("tags/"+encodeURI(tag)).set({name: tag});
        } catch (e) {
          console.log(e);
        }
      });
    });
