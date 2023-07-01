export class ModalResult {
	private readonly data: string;
  Data() : string {
    return this.data;
  }

  private readonly role: string;
  Role() : string {
    return this.role;
  }

  constructor(data: string, role: string) {
    this.data = data;
    this.role = role;
  }
}