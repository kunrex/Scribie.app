import { Animation, AnimationDirection } from "@ionic/angular";

import { AnimationWrapper } from "./animation-wrapper";

export abstract class AssignableAnimation extends AnimationWrapper {
  protected assigned: boolean = false;
  Assigned() : boolean {
    return this.assigned
  }

  protected readonly animation: Animation;
  Animation(): Animation{
    return this.animation;
  }

  constructor(animation: Animation) {
    super();
    this.animation = animation;
  }

  assignElement(el: Element) : void {
    if(!this.assigned) {
      var anim = this.animation;
      if(anim == undefined) {
        return;
      }

      anim.addElement(el);
      this.assigned = true;
    }
  }

  switchDirection(direction: AnimationDirection) {
    this.animation.direction(direction);
  }
}