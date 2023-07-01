import { Injectable, OnInit } from "@angular/core";

import { SoundEnum } from "../services/sound/enums/sound-enum";
import { SoundService } from "../services/sound/sound-affect-service";

import { CustomWidgetController } from "../widgets/custom-widget-controller";
import { CustomAnimationController } from "../animations/animation-controller";

@Injectable()
export abstract class AppPage<animController extends CustomAnimationController, widgets extends CustomWidgetController> implements OnInit {
  protected readonly soundService: SoundService;

  protected readonly widgetController: widgets;
  protected readonly animationController: animController;

  constructor(animationController: CustomAnimationController, widgetController: CustomWidgetController, soundService: SoundService) {
    this.widgetController = widgetController as widgets;
    this.animationController = animationController as animController;

    this.soundService = soundService;
  }

  ngOnInit(): void {
    this.onInit();
  }
  protected abstract onInit() : void;

  ionViewWillEnter() : void {
    this.widgetController.initialiseController();
    this.animationController.initialiseController();

    this.viewWillEnter();
  }
  protected abstract viewWillEnter() : void;

  async ionViewDidEnter() : Promise<void> {
    await this.viewDidEnter();
  }
  protected abstract viewDidEnter(): Promise<void>;

  ionViewDidLeave() : void {
    this.animationController.clearDynamicAnimationData();

    this.viewDidLeave();
  }
  protected abstract viewDidLeave() : void;

  protected async presentErrorAlert() : Promise<void> {
    this.soundService.playSound(SoundEnum.error);
    await this.widgetController.presentErrorAlert();
  }
}