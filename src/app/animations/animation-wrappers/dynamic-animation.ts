import { AnimationDirection, AnimationKeyFrames } from "@ionic/angular";

import { AnimationWrapper } from "./animation-wrapper";
import { AnimationType } from "../enums/animation-type-enum";

export class DynamicAnimation extends AnimationWrapper {
  AnimationType(): AnimationType {
    return AnimationType.Dynamic;
  }

  private readonly duration: number;
  Duration() : number  {
    return this.duration;
  }
  private readonly iterations: number;
  Iterations() : number  {
    return this.iterations;
  }

  private readonly keyframes: AnimationKeyFrames;
  Keyframes() : AnimationKeyFrames {
    return this.keyframes;
  }

  private direction: AnimationDirection = 'normal';
  Direction() : AnimationDirection {
    return this.direction;
  }

  constructor(duration: number, iterations: number, keyframes: AnimationKeyFrames) {
    super();
    
    this.duration = duration;
    this.iterations = iterations;

    this.keyframes = keyframes;
  }

  switchDirection(direction: AnimationDirection) : void {
    this.direction = direction;
  }
}