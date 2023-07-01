import { UIButton } from "./uibutton";

export interface IComponentInit {
  init(results: ReadonlyArray<UIButton>) : void;
}