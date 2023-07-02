import { Injectable } from "@angular/core";

import { CustomAnimationController } from "src/app/animations/animation-controller";
import { DynamicAnimation } from "src/app/animations/animation-wrappers/dynamic-animation";
import { AssignableAnimation } from "src/app/animations/animation-wrappers/assignable-animation";

@Injectable()
export class RecorderAnimationController extends CustomAnimationController {
  private readonly fade: string = 'fade';
  private readonly button: string = 'button';
  private readonly progressBars: string = 'progressbars';

  private isRecording: boolean = false;

  protected initialisePreloadedAnimations(): void {
    this.pushDynamicAnimation(this.button, new DynamicAnimation(200, 1,
      [
        { offset: 0, transform: 'scale(1)'},
        { offset: 1, transform: 'scale(0.8)'},
      ]));

    this.isRecording = false;
  }

  assignProgressBars(el: Element[]) : void {
    const anim = this.animationController.create(this.progressBars);

    for(var i: number = 0; i < el.length; i++) {
      const current = this.animationController.create()
        .duration(2000)
        .addElement(el[i])
        .keyframes([
          { offset: 0, transform: 'scale(1, 1)' },
          { offset: 0.5, transform: 'scale(1,' +  (1 - ((i + 4)/4)) + ')' },
          { offset: 1, transform: 'scale(1, 1)' }
        ]);

      anim.addAnimation(current);
    }

    anim.onFinish(() => {
      if(this.isRecording) {
       setTimeout(() => {
        this.playDefaultAnimation(this.progressBars);
       }, 0)
      } 
    });

    this.pushDefaultAnimation(this.progressBars, anim);
  }

  assignFadeElement(el: Element) : void {
    this.pushDefaultAnimation(this.fade, this.animationController.create(this.fade)
    .duration(200)
    .keyframes([
      { offset: 0, opacity: 1 },
      { offset: 1, opacity: 0 }
    ]));

    const anim = this.getAssignableAnimation(this.fade) as AssignableAnimation;
    
    if(anim != undefined) {
      anim.assignElement(el);
    }
  }

  async toggleProgressBars(play: boolean) : Promise<void> {
    if(play) {
      this.isRecording = true;
      await this.playDefaultAnimation(this.progressBars);
    }
    else {
      this.isRecording = false;
    }
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