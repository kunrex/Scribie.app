import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";

import { ModalResult } from "./modal-result";

@Injectable()
export abstract class ModalHandler {
  protected readonly modalController: ModalController;

  constructor(mdlCtrl: ModalController) {
    this.modalController = mdlCtrl;
  }
    
  protected async presentModal(modal: HTMLIonModalElement) : Promise<ModalResult | null> {
    modal.present();
    const { data, role } = await modal.onWillDismiss();
        
    if(role == undefined) {
      return null;
    }

    return new ModalResult(data, role);
  }
}