import { Initilaisiable } from "../initilizable";

export abstract class UtilityComponent<type extends UtilityComponent<type>> extends Initilaisiable {
  protected readonly element!: HTMLInputElement;

  constructor(element: Element) {
    super();
    
    const el = element as HTMLInputElement;
    if(!el) {
      return;
    }

    this.element = el;
    this.initialise();
  }

  withInput(func : (value: string) => Promise<void>) : UtilityComponent<type> {
    this.element.addEventListener('input', async () => {
      await func(this.element.value);
    })
      
    return this;
    }
  
  withChange(func : (value: string) => Promise<void>) : UtilityComponent<type> {
    this.element.addEventListener('change', async () => {
      await func(this.element.value);
    })
      
    return this;
  }
}