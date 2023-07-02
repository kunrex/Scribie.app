import { UtilityComponent } from "../utility-component";

export class Slider extends UtilityComponent<Slider> {	
  private readonly max: number = 0;	
  Max() : number {
	return this.max;
  }

  private readonly min: number = 0;
  Min() : number {
	return this.min;
  }

  private readonly diff: number = 0;
  private externalUpdate: boolean = true;

  constructor(htmlElement: Element) { 
	super(htmlElement);

	const el = this.element;
  	if(el == undefined) {
      return
  	}
  
	this.max = parseInt(el.max);
	this.min = parseInt(el.min);

	this.diff = this.max - this.min;

	this.element.onpointerdown = () => {
	  this.externalUpdate = false;
	}
	this.element.addEventListener('change', async () => {
	  this.externalUpdate = true;
	})

	this.initialise();
  }

  async updateValue(value: number) : Promise<void> {
	if(!this.IsInitialised() || !this.externalUpdate) {
	  return;
	}

	await this.update(value);
  }

 //input from 0 to 1
  private async update(value: number) : Promise<void> {
    const equalised = value * this.diff;
		
	this.element.value = equalised.toString();
  }
}