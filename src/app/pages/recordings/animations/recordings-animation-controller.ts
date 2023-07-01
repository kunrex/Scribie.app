import { Injectable } from "@angular/core";

import { CustomAnimationController } from "src/app/animations/animation-controller";
import { DynamicAnimation } from "src/app/animations/animation-wrappers/dynamic-animation";

@Injectable()
export class RecordingsAnimationController extends CustomAnimationController {
  private readonly highlightRecording: string = 'highlight';

  protected initialisePreloadedAnimations(): void {
    this.pushDynamicAnimation(this.highlightRecording, new DynamicAnimation(2000, 1, 
      [
        { offset: 0, color: 'black' },
				{ offset: .15, color: 'var(--ion-color-primary)' },
				{ offset: .85, color: 'var(--ion-color-primary)' },
				{ offset: 1, color: 'black' }
      ]));
  }

  async playHighlightAnimation(el: Element) : Promise<void> {
    if(el != undefined) {
      await this.tryPlayDynamicAnimation(this.highlightRecording, el, async() => {});
    }
  }
}