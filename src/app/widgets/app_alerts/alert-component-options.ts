import { ComponentOptions } from "../component-options";

export class AlertComponentOptions extends ComponentOptions {
  private readonly message: string;
  Message() : string {
    return this.message;
  }

  constructor(header: string, subheader: string, mesage: string)
  {
    super(header, subheader);
        
    this.message = mesage;
  }
}