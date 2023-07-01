import { ComponentOptions } from "../component-options";

export class ToastComponentOptions extends ComponentOptions {
  private readonly duration: number;
  Duration() : number {
    return this.duration;
  }

  constructor(header: string, duration: number) {
    super(header, '');

    this.duration = duration;
  }
}