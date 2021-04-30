export default class BaseTagModele {
  title:string
  canAdd: boolean
  canRemove: boolean

  constructor(title: string, canAdd: boolean = false, canRemove: boolean) {
    this.title = title.toLowerCase().replace(' ', '-')
    this.canAdd = canAdd
    this.canRemove = canRemove
  }
}
