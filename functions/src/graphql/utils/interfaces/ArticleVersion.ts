export interface ArticleVersion {
  uid: string;
  articleUid: string;
  content: string;
  dateOfCreation: number;
  dateOfLastUpdate: number;
  likes: number;
  state: string;
  versionNumber: number;
}
