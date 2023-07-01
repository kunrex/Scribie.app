import { Injectable } from '@angular/core';
import { ActionSheetButton } from '@ionic/angular';

import { ConfirmSheetButton } from './confirm-sheet-button';

import { RoleEnum } from 'src/app/enums/role-enum';
import { ActionEnum } from 'src/app/enums/action-enum';

import { ComponentOptions } from '../component-options';
import { InteractionComponent } from '../interaction-component';

@Injectable()
export class ConfirmActionSheet extends InteractionComponent<ConfirmSheetButton, ComponentOptions, ActionSheetButton> {
  GetButtons(): ActionSheetButton[] | undefined {
    if(this.buttons == undefined) {
      return;
    }
    
    var buttons: ActionSheetButton[] = [];
    for(var i: number = 0; i < this.buttons.length; i++) {
      var result: ConfirmSheetButton = this.buttons[i];
            
      buttons.push({
        text: result.Text(),
        role: result.Role(),
        icon: result.Icon()
      });
    }

    buttons.push({
      text: 'Cancel',
      role: RoleEnum.cancel,
    });

    return buttons;
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

    if(role == RoleEnum.cancel) {
      return ActionEnum.confirm;
    }

    return undefined;
  }
}