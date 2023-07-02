import { Browser } from '@capacitor/browser';
import { ModalController } from "@ionic/angular";
import { Component, Injectable } from "@angular/core";

import { ActionEnum } from "src/app/enums/action-enum";

import { Modal } from "src/app/widgets/modals/modal";
import { ModalResult } from "src/app/widgets/modals/modal-result";
import { ModalHandler } from "src/app/widgets/modals/modal-handler";

@Injectable()
export class TranscribeHandler extends ModalHandler {
  async create() : Promise<ModalResult | null> {
    const modal = await this.modalController.create({
      component: Transcribe,
      cssClass: 'dialouge-modal'
    });

    return await this.presentModal(modal);
  }
}

@Component ({
  templateUrl: './transcribe-modal.component.html',
  styleUrls: ['./transcribe-modal.component.scss'],
})
export class Transcribe extends Modal {
  constructor(ctrl: ModalController) {
    super(ctrl);
  }

  async scribie() {
    await Browser.open({ url: 'https://scribie.com/' });
  }

  async cancel(): Promise<boolean> {
    return this.dismiss(ActionEnum.confirm, ActionEnum.confirm);
  }

  async confirm(): Promise<boolean> {
    return this.dismiss(ActionEnum.confirm, ActionEnum.confirm);
  }

  clearData(): void { }
}