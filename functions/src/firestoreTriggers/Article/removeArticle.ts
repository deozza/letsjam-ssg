import {functions, db} from "../initializeTriggers";

exports.cleanArticleData = functions
    .region("us-central1")
    .firestore
    .document("articles/{articlesUid}")
    .onDelete((snap: any) => {
      const deletedValue = snap.data();

      const versions = deletedValue.versions;


      try {
        versions.forEach((version: string) => {
          db.collection("articleVersion").doc(+version).delete();
        });

        const author = db.collection("users").doc(deletedValue.authorUid).get();

        const uniqueArticlePerUser = encodeURI(deletedValue.title)+encodeURI(author.data().displayName);

        db.collection("uniqueArticlePerUser").doc(uniqueArticlePerUser).delete();
      } catch (e) {
        console.log(e);
      }
    });
