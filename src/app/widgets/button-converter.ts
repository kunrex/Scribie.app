export interface IButtonConverter<button> {
  GetButtons() : button[] | undefined;
}