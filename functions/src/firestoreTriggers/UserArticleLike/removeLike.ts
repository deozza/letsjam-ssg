import {functions, db, FieldValueFromFirestore} from "../initializeTriggers";

exports.removeLike = functions
    .region("us-central1")
    .firestore
    .document("userArticleLike/{userArticleLikeUid}")
    .onDelete((snap: any) => {
      const deletedValue = snap.data();
      db.doc("articles/"+deletedValue.articleUid).update({totalLikes: FieldValueFromFirestore.increment(-1)});
      db.doc("articleVersion/"+deletedValue.articleVersionUid).update({likes: FieldValueFromFirestore.increment(-1)});
    });
