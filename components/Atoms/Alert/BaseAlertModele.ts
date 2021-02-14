import BaseAlertInterface from '~/components/Atoms/Alert/BaseAlertInterface'

export default class BaseAlertModele implements BaseAlertInterface {
  visualType: string
  message: string

  constructor(visualType: string = 'success', message: string = '') {
    this.visualType = visualType
    this.message = message
  }
}
