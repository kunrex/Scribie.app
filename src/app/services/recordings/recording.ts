import { CustomRecordingData } from "./custom-recording-data";

export class Recording {
  private name: string;
  private nameUpper: string;
  private readonly recordingData: CustomRecordingData;

  Size() : string {
    return this.recordingData.size;
  }

  Date() : string {
    return this.recordingData.date;
  }

  Duration() : string {
    return this.recordingData.duration;
  }

  Extension() : string {
    return this.recordingData.extension;
  }

  Base64() : string {
    return this.recordingData.audioBase64;
  }

  constructor(name: string, data: CustomRecordingData) {
    this.name = name;
    this.nameUpper = name.toUpperCase();
    
    this.recordingData = data;
  }

  Name() : string {
    return this.name;
  }

  ToUpper() : string {
    return this.nameUpper;
  }
  
  FullName() : string {
    return this.name + this.recordingData.extension;
  }

  Rename(name: string) : void {
    if(this.name == name) {
      return;
    }
  
    this.name = name;
  }
}