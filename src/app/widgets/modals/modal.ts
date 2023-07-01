import { ModalController } from '@ionic/angular';

export abstract class Modal {
  protected readonly modalController: ModalController;

  constructor(mdlCtrl: ModalController) {
    this.modalController = mdlCtrl;
  }

  abstract cancel() : Promise<boolean>;
  abstract confirm() : Promise<boolean>;

  abstract clearData(): void;

  protected dismiss(data: string, role: string) {
    this.clearData();

    return this.modalController.dismiss(data, role);
  }
}