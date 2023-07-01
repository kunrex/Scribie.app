export class UIButton {
  protected readonly text: string;
  Text() : string {
    return this.text;
  }

  protected readonly data: string;
  Data() : string {
    return this.data;
  }

  protected readonly role: string;
  Role() : string {
    return this.role;
  }

  constructor(text: string, data: string, role: string) {
    this.text = text;
    this.data = data;
    this.role = role;
  }
}