import { AnimationDirection } from "@ionic/core";

import { AnimationType } from "../enums/animation-type-enum";

export abstract class AnimationWrapper {
  abstract AnimationType(): AnimationType;
  abstract switchDirection(direction: AnimationDirection) : void;
}