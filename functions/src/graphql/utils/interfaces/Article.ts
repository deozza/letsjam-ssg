export interface Article {
  uid: string;
  title: string;
  authorUid: string;
  dateOfCreation: number;
  dateOfLastUpdate: number;
  totalLikes: number;
  versions: Array<string>;
  currentVersion: string;
  tags: Array<string>;
}
