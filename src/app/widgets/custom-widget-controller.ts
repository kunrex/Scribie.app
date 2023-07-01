import { Injectable } from "@angular/core";
import { ActionSheetController, AlertController, ToastController } from "@ionic/angular";

import { Initilaisiable } from "../initilizable";

import { ActionEnum } from "../enums/action-enum";

import { UIButton } from "./uibutton";
import { BaseInteractionComponent } from "./interaction-component";
import { IInitializableController } from "../interfaces/I-Iniililizable-controller";

import { AppAlert } from "./app_alerts/app-alert";
import { ToastAlert } from "./toasts/toast-alert";
import { ConfirmActionSheet } from "./confirm_sheets/confirm-sheet";
import { AlertComponentOptions } from "./app_alerts/alert-component-options";

@Injectable()
export abstract class CustomWidgetController extends Initilaisiable implements IInitializableController {
  private readonly error: string = 'error';
  private readonly uiComponents: {[Name: string]: BaseInteractionComponent };

  private readonly alertController: AlertController;
  protected AlertController() : AlertController {
    return this.alertController;
  }

  private readonly toastController: ToastController;
  protected ToastController() : ToastController {
    return this.toastController;
  }

  private readonly actionSheetController: ActionSheetController;
  protected ActionSheetController() : ActionSheetController {
    return this.actionSheetController;
  }

  private isDisplaying: boolean;

  constructor(alertController: AlertController, actionSheetController: ActionSheetController, toastController: ToastController) {
    super();

    this.uiComponents = {};

    this.alertController = alertController;
    this.toastController = toastController;
    this.actionSheetController = actionSheetController;

    this.isDisplaying = false;
  }
  
  public initialiseController() : void {
    if(this.IsInitialised()) {
      return;
    }

    this.initialiseWidgets();

    this.pushUIComponent(this.error, new AppAlert()
      .init([
        new UIButton('Close', ActionEnum.confirm, ActionEnum.confirm)
      ])
      .withOptions(new AlertComponentOptions(
        'Something went wrong.', 
        'We came across an error while performing a task.', 
        'Please report this error so we can rectify it at the earliest.\n We\'re extremely sorry for the inconvineance')));
        
    this.initialise();
    this.isDisplaying = false;
  }
  protected abstract initialiseWidgets() : void;

  protected getUIComponent(name: string) : BaseInteractionComponent | undefined {
    if(!this.IsInitialised()) {
      return undefined;
    }

    var button = this.uiComponents[name];
    return button;
  }

  protected pushUIComponent(name: string, component: BaseInteractionComponent) : void {
    if(this.IsInitialised()) {
      return;
    }

    if(this.getUIComponent(name) == undefined) {
      this.uiComponents[name] = component;
    }
  }

  async presentErrorAlert() : Promise<string | undefined> {
    var component = this.getUIComponent(this.error);
    console.log(this.getUIComponent(this.error));
    if(component != undefined) {
      return (await this.presentAlert(component));
    }

    return undefined;
  }

  protected async presentToast(component: BaseInteractionComponent) : Promise<string | undefined> {
    if(this.isDisplaying) {
      return undefined;
    }

    if(component != undefined) {
      const casted = component as ToastAlert;
      if(casted == undefined) {
        return undefined;
      }

      const options = casted.ComponentOptions();
      if(options != undefined) {
        const toast = await this.toastController.create({
          message: options.Header(),
          duration: options.Duration(),

          position: 'bottom'
        });
    
        await toast.present();
        return ActionEnum.confirm;
      }
    }

    return undefined;
  }

  protected async presentAlert(component: BaseInteractionComponent) : Promise<string | undefined> {
    if(this.isDisplaying) {
      return undefined;
    }

    if(component != undefined) {
      const casted = component as AppAlert;
      if(casted == undefined) {
        return;
      }

      const options = casted.ComponentOptions();
      if(options != undefined) {
        const alert = await this.alertController.create({
          header: options.Header(),
          subHeader: options.SubHeader(),
            
          message: options.Message(),
            
          buttons: casted.GetButtons(),
        });
        
        await alert.present();
        
        const { role } = await alert.onDidDismiss();
        return role;
      }
    }

    return undefined;
  }

  protected async presentSheet(component: BaseInteractionComponent) : Promise<string | undefined> {
    if(this.isDisplaying) {
      return undefined;
    }

    if(component != undefined) {
      const casted = component as ConfirmActionSheet;
      if(casted == undefined) {
        return;
      }

      const buttons = casted.GetButtons();
      const options = casted.ComponentOptions();
      if(buttons != undefined && options != undefined) {
        const sheet = await this.actionSheetController.create({
          header: options.Header(),
          subHeader: options.SubHeader(),
  
          buttons: buttons
        });
  
        await sheet.present();
  
        const { role } = await sheet.onWillDismiss();
        return role;
      }
    }

    return undefined;
  }
}