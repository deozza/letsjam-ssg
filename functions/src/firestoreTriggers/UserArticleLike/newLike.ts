import {functions, db, FieldValueFromFirestore} from "../initializeTriggers";

exports.newLike = functions
    .region("us-central1")
    .firestore
    .document("userArticleLike/{userArticleLikeUid}")
    .onCreate((snap: any) => {
      const newValue = snap.data();
      db.doc("articles/"+newValue.articleUid).update({totalLikes: FieldValueFromFirestore.increment(1)});
      db.doc("articleVersion/"+newValue.articleVersionUid).update({likes: FieldValueFromFirestore.increment(1)});
    });
