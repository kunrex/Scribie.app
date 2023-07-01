export class ComponentOptions {
  private readonly header: string;
  Header() : string {
    return this.header;
  }

  private readonly subHeader: string;
  SubHeader() : string {
      return this.subHeader;
  }

  constructor(header: string, subHeader: string) {
    this.header = header;
    this.subHeader = subHeader;
  }
}