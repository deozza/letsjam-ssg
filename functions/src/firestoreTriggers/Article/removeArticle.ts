import {functions, db} from "../initializeTriggers";

exports.addTags = functions
    .region("us-central1")
    .firestore
    .document("articles/{articlesUid}")
    .onDelete((snap: any) => {
      const deletedValue = snap.data();

      const versions = deletedValue.versions;

      const author = db.doc("/users/"+deletedValue.authorUid).get();

      const uniqueArticlePerUser = encodeURI(deletedValue.title)+encodeURI(author.data().displayName);

      try {
        versions.forEach((version: string) => {
          db.doc("articleVersion/"+version).delete();
        });

        db.doc("uniqueArticlePerUser/"+uniqueArticlePerUser).delete();
      } catch (e) {
        console.log(e);
      }
    });
