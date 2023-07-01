export class CustomRecordingData {
  size: string;
  duration: string;
  
  date: string;
  extension: string;
    
  audioBase64: string;
  
  constructor(size: string, date: string, duration: string, extension: string, base64: string) {
    this.size = size;
    this.date = date;
    this.duration = duration;
  
    this.audioBase64 = base64;
    this.extension = extension;
  }
}