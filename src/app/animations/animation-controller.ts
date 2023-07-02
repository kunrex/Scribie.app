import { Injectable } from "@angular/core";
import { AnimationController, Animation } from "@ionic/angular";

import { Initilaisiable } from "../initilizable";
import { IInitializableController } from "../interfaces/I-Iniililizable-controller";

import { DefaultAnimation } from "./animation-wrappers/default-animation";
import { DynamicAnimation } from "./animation-wrappers/dynamic-animation";
import { PreloadedAnimation } from "./animation-wrappers/preloaded-animation";
import { AssignableAnimation } from "./animation-wrappers/assignable-animation";

@Injectable()
export abstract class CustomAnimationController extends Initilaisiable implements IInitializableController {
  protected animationController: AnimationController;

  private dynamicAnimations: {[Name: string]: DynamicAnimation };
  private assignablAnimations: {[Name: string]: AssignableAnimation };

  protected currentDynamicAnimations: {[Name: string]: Animation | undefined };

  constructor(ctrl: AnimationController) {
    super();

    this.animationController = ctrl;
    
    this.dynamicAnimations = {};
    this.assignablAnimations = {};
    this.currentDynamicAnimations = {}
  }

  initialiseController() : void {
    this.initialisePreloadedAnimations();

    this.initialise();
  }
  protected abstract initialisePreloadedAnimations() : void;

  protected getDynamicAnimation(name: string) : DynamicAnimation {
    return this.dynamicAnimations[name];
  }

  protected getAssignableAnimation(name: string) : AssignableAnimation {
    return this.assignablAnimations[name];
  }

  private getAnimation(name: string) : Animation | undefined {
    const wrapper = this.getAssignableAnimation(name);
    if(wrapper == undefined) {
      return undefined;
    }

    return wrapper.Animation();
  }

  protected pushPreloadedAnimation(name: string, animation: Animation) {
    if(this.getAssignableAnimation(name) != undefined) {
      return;
    }

    this.assignablAnimations[name] = new PreloadedAnimation(animation);
  }

  protected pushDynamicAnimation(name: string, animation: DynamicAnimation) {
    if(this.getDynamicAnimation(name) != undefined) {
      return;
    }

    this.dynamicAnimations[name] = animation;
  }

  protected pushDefaultAnimation(name: string, animation: Animation) {
    if(this.getAssignableAnimation(name) != undefined) {
      return;
    }

    this.assignablAnimations[name] = new DefaultAnimation(animation);
  }

  protected playDefaultAnimation(name: string) {
    const anim = this.getAnimation(name)
    
    if(anim != undefined) {
      anim.play();
    };
  }

  protected playPreloadedAnimation(name: string, el: Element, onFinish: () => Promise<void>) {
    const anim = this.getAnimation(name);

    if(anim != undefined) {
      anim.addElement(el)
      .onFinish(async() => {
        await onFinish();
      });

      anim.play();
    } 
  }

  protected async tryPlayDynamicAnimation(name: string, element: Element, onFinish: () => Promise<void>) : Promise<void> {
    const anim: DynamicAnimation = this.getDynamicAnimation(name);
    
    if(anim != undefined) {
      const pre = this.currentDynamicAnimations[name];

      if(pre != undefined) {
        this.currentDynamicAnimations[name] = undefined;
        delete this.currentDynamicAnimations[name];
  
        if(pre.isRunning()) {
          pre.stop();
        }

        setTimeout(() => {
          pre.destroy();
          this.playDynamicAnimation(anim, element, onFinish);
        }, 0);
      }
      else {
        await this.playDynamicAnimation(anim, element, onFinish);
      }
    }
  }

  private async playDynamicAnimation(anim: DynamicAnimation, el: Element, onFinish: () => Promise<void>) : Promise<void> {
    const animation = this.animationController.create();
    animation.duration(anim.Duration())
      .keyframes(anim.Keyframes())
      .direction(anim.Direction())
      .iterations(anim.Iterations())
      .onFinish(async() => {
        await onFinish();
      })
      .addElement(el);
    
    animation.play();
  }

  clearDynamicAnimationData() : void {
    const keys = Object.keys(this.currentDynamicAnimations);

    for(var i: number = 0; i < keys.length; i++) {
      const value = this.currentDynamicAnimations[keys[i]];

      if(value != undefined) {
        if(value.isRunning()) {
          value.stop();
        }

        value.destroy();
      }
    }

    this.currentDynamicAnimations = { };
  }
}