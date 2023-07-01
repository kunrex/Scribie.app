import { Injectable } from '@angular/core';
import { AlertButton } from '@ionic/angular';

import { UIButton } from '../uibutton';
import { InteractionComponent } from '../interaction-component';

import { AlertComponentOptions } from './alert-component-options';

@Injectable()
export class AppAlert extends InteractionComponent<UIButton, AlertComponentOptions, AlertButton> {
  GetButtons(): AlertButton[] | undefined {
    if(this.buttons == undefined) {
      return undefined;
    }
    
    var alertButtons: AlertButton[] = []
    for(var i: number = 0; i < this.buttons.length; i++) {
      var current = this.buttons[i];

      alertButtons.push({
        text: current.Text(),
        role: current.Role()
      });
    }

    return alertButtons;
  }

  matchData(role: string) : string | undefined {
    if(this.buttons == undefined) {
      return;
    }
    
    for(var i: number = 0; i < this.buttons.length; i++) {
      if(this.buttons[i].Role() == role) {
        return this.buttons[i].Data();
      }
    }

    return undefined;
  }
}