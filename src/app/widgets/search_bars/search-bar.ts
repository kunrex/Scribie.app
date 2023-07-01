import { UtilityComponent } from "../utility-component";

export class SearchBar extends UtilityComponent<SearchBar> {
  private isWaiting: boolean = false;
  private readonly throttleTimeout: number = 1000;
  private safeCall: string | undefined = undefined;

  constructor(htmlElement: Element) {
    super(htmlElement);
    
    if(!this.IsInitialised()) {
      return;
    }
  }

  withInputReset(func: (value: string) => Promise<void>, reset: () => Promise<void>) : UtilityComponent<SearchBar> {
    return this.withInput(async() => {
      const val = this.element.value;

      if(!val || val == '') {
        await reset();
        this.isWaiting = false;
        this.safeCall = undefined;
      }
      else {
        this.throttle(val, func);
      }
    });
  }

  private throttle(name: string, func: (value: string) => Promise<void>) : void {
    if(this.isWaiting) {
      this.safeCall = name;
    }
    else {
      this.isWaiting = true;
      this.timeoutFunc(name, func);
    }
  }
  
  private async timeoutFunc(name: string | undefined, func: (value: string) => Promise<void>) : Promise<void> {
    if(name != undefined) {
      if(this.isWaiting) {
        await func(name);
      }

      setTimeout(async() => {
        if(this.safeCall != undefined) {
          this.timeoutFunc(this.safeCall, func);
          this.safeCall = undefined;
        }
        else {
          this.isWaiting = false;
        }
      }, this.throttleTimeout);
    }
  }
}