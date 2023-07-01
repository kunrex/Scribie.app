import { Injectable } from "@angular/core";

import { RoleEnum } from "src/app/enums/role-enum";
import { ActionEnum } from "src/app/enums/action-enum";

import { UIButton } from "src/app/widgets/uibutton";
import { AppAlert } from "src/app/widgets/app_alerts/app-alert";

import { CustomWidgetController } from "src/app/widgets/custom-widget-controller";

import { AlertComponentOptions } from "src/app/widgets/app_alerts/alert-component-options";
import { ToastAlert } from "src/app/widgets/toasts/toast-alert";
import { ToastComponentOptions } from "src/app/widgets/toasts/toast-component-options";

@Injectable()
export class RecorderWidgetController extends CustomWidgetController {
  private readonly delete: string = 'delete';
  private readonly permission: string = 'permission';
  private readonly didntStart: string = 'didntStart';
  
  protected initialiseWidgets(): void {
    this.pushUIComponent(this.delete, new AppAlert()
      .init([ 
        new UIButton('Cancel', ActionEnum.cancel, RoleEnum.cancel),
        new UIButton('Confirm', ActionEnum.confirm, RoleEnum.destructive)])
      .withOptions(new AlertComponentOptions('Are you sure?', '', 'You cannot undo this action.')));

    this.pushUIComponent(this.permission, new AppAlert()
      .init([ 
        new UIButton('Cancel', ActionEnum.cancel, RoleEnum.cancel),
        new UIButton('Grant', ActionEnum.confirm, ActionEnum.confirm)])
      .withOptions(new AlertComponentOptions('Permission Required', '', 'We require yoru permission to recording audio.')));

    this.pushUIComponent(this.didntStart, new ToastAlert()
      .withOptions(new ToastComponentOptions('Recording did not start.', 1500)));
  }

  async presentRecordingToast() : Promise<void> {
    const component = this.getUIComponent(this.didntStart);
    if(component != undefined) {
      await this.presentToast(component);
    }
  }

  async getDeleteResult() : Promise<string | undefined> {
    return (await this.getResult(this.delete));
  }

  async getPermissionResult() : Promise<string | undefined> {
    return (await this.getResult(this.permission));
  }

  private async getResult(name: string) : Promise<string | undefined> {
    const component = this.getUIComponent(name);
    
    if(component != undefined) {
      const result = await this.presentAlert(component);

      if(result == undefined) {
        return undefined;
      }

      return component.matchData(result);
    }

    return undefined;
  }
}