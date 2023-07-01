import { UIButton } from "./uibutton";

import { Initilaisiable } from "../initilizable";

import { IComponentInit } from "./component-init";
import { IButtonConverter } from "./button-converter";
import { ComponentOptions } from "./component-options";

export abstract class BaseInteractionComponent extends Initilaisiable { 
  public abstract matchData(role: string) : string | undefined;
}

export abstract class NonInteractionComponent<options extends ComponentOptions> extends BaseInteractionComponent {
  protected componentOptions: options | undefined;
  ComponentOptions() : options | undefined {
    return this.componentOptions;
  }

  withOptions(options: options) : NonInteractionComponent<options> {
    if(!this.IsInitialised()) {
      this.componentOptions = options;
      this.initialise();
    }

    return this;
  }

  public matchData(role: string) {
    return undefined;
  }
}

export abstract class InteractionComponent<uiButton extends UIButton, options extends ComponentOptions, button> extends BaseInteractionComponent implements IComponentInit, IButtonConverter<button>   {
  protected buttons: ReadonlyArray<uiButton> | undefined;
  
  protected componentOptions: options | undefined;
  ComponentOptions() : options | undefined {
    return this.componentOptions;
  }

  private checkInitialisation() {
    if(this.buttons != null && this.componentOptions != null) {
      this.initialise();
    }
  }

  init(buttons: ReadonlyArray<uiButton>): InteractionComponent<uiButton, options, button> {
    if(!this.IsInitialised()) {
      this.buttons = buttons;
      this.checkInitialisation();
    }

    return this;
  }

  withOptions(options: options) : InteractionComponent<uiButton, options, button> {
    if(!this.IsInitialised()) {
      this.componentOptions = options;
      this.checkInitialisation();
    }

    return this;
  }

  abstract GetButtons(): button[] | undefined;
}