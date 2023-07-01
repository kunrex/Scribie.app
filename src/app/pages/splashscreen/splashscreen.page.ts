import { Component, ElementRef, ViewChild } from '@angular/core';

import { AppPage } from '../app-page';

import { AppFlowService } from 'src/app/services/app-flow-service';
import { SoundService } from 'src/app/services/sound/sound-affect-service';

import { SplashScreenWidgetController } from './widgets/splashscreen-widget-controller';
import { SplashScreenAnimationController } from './animations/splashscreen.page-animations';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
  providers: [SplashScreenAnimationController, SplashScreenWidgetController]
})
export class SplashscreenPage extends AppPage<SplashScreenAnimationController, SplashScreenWidgetController> {
  protected onCompleteLoad(): void {
    
  }
  private readonly appFlowService: AppFlowService;
  @ViewChild('splashComponents', { read: ElementRef }) splash!: ElementRef;

  constructor(appFlowService: AppFlowService, animCtrl: SplashScreenAnimationController, widgetCtrl: SplashScreenWidgetController, soundService: SoundService) { 
    super(animCtrl, widgetCtrl, soundService);
    
    this.appFlowService = appFlowService;
  }

  onInit(): void { }
  viewWillEnter(): void { }
  async afterViewInit(): Promise<void> { }

  async viewDidEnter(): Promise<void> {
    const element = this.splash.nativeElement;
    if(element != undefined) {
      await this.animationController.toggleLogoAnimation(this.splash.nativeElement, async() => {
        await this.appFlowService.loadApplication();
      });
    }
    else {
      console.log('ERROR: splahsscreen undefined; loading application anyway.');
      await this.appFlowService.loadApplication();
    }
  }
   
  protected viewDidLeave(): void { }
}
