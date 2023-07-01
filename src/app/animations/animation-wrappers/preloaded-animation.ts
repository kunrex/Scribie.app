import { Animation } from "@ionic/angular";

import { AnimationType } from "../enums/animation-type-enum";
import { AssignableAnimation } from "./assignable-animation";

export class PreloadedAnimation extends AssignableAnimation {  
  AnimationType(): AnimationType {
    return AnimationType.Preloaded;
  }  

  constructor(animation: Animation) {
    super(animation);
  }
}