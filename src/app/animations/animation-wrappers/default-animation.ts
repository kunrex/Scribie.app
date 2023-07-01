import { Animation } from "@ionic/angular";

import { AnimationType } from "../enums/animation-type-enum";
import { AssignableAnimation } from "./assignable-animation";

export class DefaultAnimation extends AssignableAnimation {
  AnimationType(): AnimationType {
    return AnimationType.Default;
  }

  constructor(animation: Animation) {
    super(animation);
  }
}