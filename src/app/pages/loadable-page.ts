import { CustomWidgetController } from "../widgets/custom-widget-controller";
import { CustomAnimationController } from "../animations/animation-controller";
import { AppPage } from "./app-page";

export abstract class LoadablePage<animController extends CustomAnimationController, widgets extends CustomWidgetController> extends AppPage<animController, widgets> {
  private isLoading: boolean = true;
  IsLoading() {
    return this.isLoading;
  }

  protected completeLoading() : void {
    if(!this.isLoading) {
      return;
    }

    this.isLoading = false;
    setTimeout(() => { 
      this.onCompleteLoad();
    }, 0);
  }
  protected abstract onCompleteLoad() : void;

  protected viewDidLeave() : void {
    this.isLoading = true;
    this.unloadObjectData();
  }
  protected abstract unloadObjectData() : void;
}