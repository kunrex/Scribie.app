import { Injectable } from "@angular/core";

import { CustomWidgetController } from "src/app/widgets/custom-widget-controller";

@Injectable()
export class SplashScreenWidgetController extends CustomWidgetController {
  protected initialiseWidgets(): void { }
}