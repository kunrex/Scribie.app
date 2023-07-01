import { UIButton } from "../uibutton";

export class ConfirmSheetButton extends UIButton {
  private readonly icon: string;
  Icon() : string {
    return this.icon;
  }

 	constructor(text: string, data: string, role: string, icon: string) {
  	super(text, data, role);
  	this.icon = icon
  }
}