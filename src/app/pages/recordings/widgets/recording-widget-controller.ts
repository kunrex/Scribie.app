import { Injectable } from "@angular/core";
import { ActionSheetController, AlertController, ToastController } from "@ionic/angular";

import { RoleEnum } from "src/app/enums/role-enum";
import { ActionEnum } from "src/app/enums/action-enum";

import { UIButton } from "src/app/widgets/uibutton";

import { AppAlert } from "src/app/widgets/app_alerts/app-alert";
import { ConfirmActionSheet } from "src/app/widgets/confirm_sheets/confirm-sheet";

import { CustomWidgetController } from "src/app/widgets/custom-widget-controller";
import { AlertComponentOptions } from "src/app/widgets/app_alerts/alert-component-options";
import { ComponentOptions } from "src/app/widgets/component-options";

import { ConfirmSheetButton } from "src/app/widgets/confirm_sheets/confirm-sheet-button";
import { RecorderAction } from "src/app/enums/recording-action";
import { ToastAlert } from "src/app/widgets/toasts/toast-alert";
import { ToastComponentOptions } from "src/app/widgets/toasts/toast-component-options";
@Injectable()
export class RecordingWidgetController extends CustomWidgetController {
  private readonly rename: string = 'rename';
  private readonly delete: string = 'delete';

  private readonly moreOptions: string = 'more';
  
  private readonly addedToast: string = 'addedToast';
  private readonly renameToast: string = 'renameToast';
  private readonly deleteToast: string = 'deleteToast';

  constructor(alertController: AlertController, actionSheetController: ActionSheetController, toastController: ToastController) {
    super(alertController, actionSheetController, toastController);
  }

  protected initialiseWidgets(): void {
    this.pushUIComponent(this.rename, new AppAlert()
      .init([ 
        new UIButton('Cancel', ActionEnum.cancel, RoleEnum.cancel),
        new UIButton('Confirm', ActionEnum.confirm, ActionEnum.confirm)])
      .withOptions(new AlertComponentOptions('Rename Recording', '', '')));

    this.pushUIComponent(this.delete, new AppAlert()
      .init([ 
        new UIButton('Cancel', ActionEnum.cancel, RoleEnum.cancel),
        new UIButton('Confirm', ActionEnum.confirm, RoleEnum.destructive)])
      .withOptions(new AlertComponentOptions('Are you sure?', '', 'You cannot undo this action.')));

    this.pushUIComponent(this.moreOptions, new ConfirmActionSheet()
      .init([
        new ConfirmSheetButton('Play', RecorderAction.Play, RecorderAction.Play, 'play-circle-outline'),
        new ConfirmSheetButton('Rename', RecorderAction.Rename, RecorderAction.Rename, 'create-outline'),
        new ConfirmSheetButton('Transcribe', RecorderAction.Transcirbe, RecorderAction.Transcirbe, 'chatbubble-ellipses-outline'),
  
        new ConfirmSheetButton('Delete', RecorderAction.Delete, RoleEnum.destructive, 'trash')])
      .withOptions(new ComponentOptions('All Actions', 'What would you like to do?')));
    
    this.pushUIComponent(this.addedToast, new ToastAlert()
      .withOptions(new ToastComponentOptions('Recording Added!', 1500)));

    this.pushUIComponent(this.renameToast, new ToastAlert()
      .withOptions(new ToastComponentOptions('Renamed Recording!', 1500)));

    this.pushUIComponent(this.deleteToast, new ToastAlert()
      .withOptions(new ToastComponentOptions('Recording Deleted.', 1500)));
  }

  async presentAddedToast() : Promise<void> {
    await this.present(this.addedToast);
  }

  async presentRenameToast() : Promise<void> {
    await this.present(this.renameToast);
  }

  async presentDeleteToast() : Promise<void> {
    await this.present(this.deleteToast);
  }

  private async present(name: string) : Promise<void> {
    const component = this.getUIComponent(name);

    if(component != undefined) {
      await this.presentToast(component);
    }
  }

  async getDeleteResult() : Promise<string | undefined> {
    var component = this.getUIComponent(this.delete);
    if(component != undefined) {
      var result = await this.presentAlert(component);

      if(result == undefined) {
        return undefined;
      }

      return component.matchData(result);
    }
    return undefined;
  }

  async getMoreOptionsResult() : Promise<string | undefined> {
    var component = this.getUIComponent(this.moreOptions);
    if(component != undefined) {
      var result = await this.presentSheet(component);

      if(result == undefined) {
        return undefined;
      }
      
      return component.matchData(result);
    }
    return undefined;
  }

  async getRenameResult(recordingName: string) : Promise<string | undefined> {
    var component = this.getUIComponent(this.rename);
    if(component != undefined) {
      const casted = component as AppAlert;
      if(casted == undefined) {
        return undefined;
      }

      const options = casted.ComponentOptions();
      if(options != undefined) {
        const alert = await this.AlertController().create({
          header: options.Header(),
          subHeader: options.SubHeader(),
            
          message: options.Message(),
            
          buttons: casted.GetButtons(),

          inputs: [{
            placeholder: recordingName,
          }]
        });
        
        await alert.present();
        
        const { data, role } = await alert.onDidDismiss();
        if(role == ActionEnum.confirm) 
          return data.values[0];
        else
          return undefined;
      }
    }

    return undefined;
  }
}