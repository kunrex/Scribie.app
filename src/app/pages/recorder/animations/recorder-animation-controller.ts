import { Injectable } from "@angular/core";
import { Animation } from "@ionic/angular";

import { CustomAnimationController } from "src/app/animations/animation-controller";
import { DynamicAnimation } from "src/app/animations/animation-wrappers/dynamic-animation";
import { AssignableAnimation } from "src/app/animations/animation-wrappers/assignable-animation";

@Injectable()
export class RecorderAnimationController extends CustomAnimationController {
  private readonly fade: string = 'fade';
  private readonly button: string = 'button';
  private readonly progressBars: string = 'progressbars'

  protected initialisePreloadedAnimations(): void {
    this.pushDefaultAnimation(this.fade, this.animationController.create(this.fade)
      .duration(200)
      .keyframes([
        { offset: 0, opacity: 1 },
				{ offset: 1, opacity: 0 }
      ]));

    this.pushDynamicAnimation(this.button, new DynamicAnimation(200, 1,
      [
        { offset: 0, transform: 'scale(1)'},
        { offset: 1, transform: 'scale(0.8)'},
      ]));
  }

  async assignFadeElement(el: Element) {
    const anim = this.getAssignableAnimation(this.fade) as AssignableAnimation;
    
    if(anim != undefined) {
      anim.assignElement(el);
    }
  }

  async toggleProgressBars() : Promise<void> {
    await this.playDefaultAnimation(this.progressBars);
  }

  async toggleFadeAnimation(forward: boolean) : Promise<void> {
    const wrapper = this.getAssignableAnimation(this.fade);
    if(wrapper == undefined) {
      return;
    }

    wrapper.switchDirection(forward? 'normal' : 'reverse');
    await this.playDefaultAnimation(this.fade);
  }

  async toggleButtonAnimation(el: Element, forward: boolean) : Promise<void> {
    const wrapper = this.getDynamicAnimation(this.button);
    if(wrapper == undefined) {
      return;
    }

    wrapper.switchDirection(forward? 'normal' : 'reverse');
    await this.tryPlayDynamicAnimation(this.button, el, async () => { });
  }
}