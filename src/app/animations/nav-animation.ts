import { AnimationController, Animation } from "@ionic/angular";

const duration = 150;

export const pageAnimation = (elemet: HTMLElement, options?: any) : Animation => {
  const animController: AnimationController = new AnimationController();
  
  const leavingAnim = animController.create()
    .addElement(options.enteringEl)
    .duration(duration)
    .easing('ease-in')
    .keyframes([
      { offset: 0, opacity: 0 },
      { offset: 1, opacity: 1 },
    ]);
  
  const enteringAnim = animController.create()
    .addElement(options.leavingEl)
    .duration(duration)
    .easing('ease-out')
    .keyframes([
      { offset: 0, opacity: 1 },
      { offset: 1, opacity: 0 },
    ]);

  return animController.create().addAnimation([enteringAnim, leavingAnim]);
}