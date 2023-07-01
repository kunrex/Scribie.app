import { Injectable } from "@angular/core";

import { CustomAnimationController } from "src/app/animations/animation-controller";

@Injectable()
export class SplashScreenAnimationController extends CustomAnimationController {
  private readonly logo: string = 'logo';

  protected initialisePreloadedAnimations(): void {
	  this.pushPreloadedAnimation(this.logo, this.animationController.create(this.logo)
      .duration(1500)
      .keyframes([
        { offset: 0, opacity: 0 },
				{ offset: .35, opacity: 1 },
				{ offset: .7, opacity: 1 },
				{ offset: 1, opacity: 0 }
      ]));
  }

  async toggleLogoAnimation(el: Element, onFinish: () => Promise<void>) : Promise<void> {
		if(el != undefined) {
      await this.playPreloadedAnimation(this.logo, el, onFinish);
    }
	} 
}