export default class BaseInputModele{
  type:string
  id: string
  name: string
  label: string
  value: any
  required: boolean

  constructor(type: string, id: string, name: string, label: string, required: boolean = false, value: any = null) {

    const expectedType: Array<string> = [
      'text',
      'email',
      'number',
      'password'
    ]

    if(!expectedType.includes(type)){
      throw new Error(type + ' is not a valid input type')
    }

    this.type = type
    this.id = id
    this.name = name
    this.label = label
    this.required = required
    this.value = value
  }
}
