import { Injectable } from "@angular/core";

import { FileManager } from "../file-management.ts/file-manager";

import { Recording } from "./recording";
import { CustomRecordingData } from "./custom-recording-data";

@Injectable()
export class RecordingService extends FileManager {
  private length: number;
  Length() : number {
    return this.length;
  }

  private allRecordings: { [Name: string]: Recording | undefined } = {};

  constructor() {
    super();

    this.length = 0;
  }

  async loadAllFiles() : Promise<void> {
    if(this.IsInitialised()) {
      return;
    }

    await this.readAllFiles((name: string, value: string) => {
      this.allRecordings[name] = new Recording(name, JSON.parse(value));
      this.length++;
    });
    //await this.deleteAllFiles();

    this.initialise();
  }

  getRecording(name: string) : Recording | undefined {
    return this.allRecordings[name];
  }

  iterateRecordings(iterate: (rec: Recording) => void) : void {
    const keys: string[] = Object.keys(this.allRecordings);

    for(var i: number = 0; i < keys.length; i++) {
      const rec = this.allRecordings[keys[i]];
      if(rec != undefined) {
        iterate(rec);
      }
    }
  }

  async addNew(recordingData: CustomRecordingData) : Promise<string | undefined> {
    const name = this.createName();
    if(this.getRecording(name) != null) {
      console.log('ERROR: duplicate recording from createName()');
      return undefined;
    }

    const recording: Recording = new Recording(name, recordingData);
    
    this.allRecordings[recording.Name()] = recording;
    await this.addFile(recording.Name(), recordingData);

    this.length++;
    return name;
  }

  async renameRecording(name: string, newName: string) : Promise<boolean> {
    const recording = this.getRecording(name);
    if(recording == undefined) {
      return false;
    }

    var base: string = newName;
    const postfix: number = this.getPostFix(base);
    if(postfix > 0) {
      base += '(' + postfix + ')';
    }
    
    this.removeRecording(name);

    recording.Rename(base);
    this.allRecordings[base] = recording;

    await this.renameFile(name, newName);
    return true;
  }

  private createName() : string {
    var base: string = 'New Recording';
    if(this.length > 0) {
      base += ' ' + (this.length + 1);
    }

    const postfix: number = this.getPostFix(base);
    if(postfix > 0) {
      base += ' (' + postfix + ')';
    }

    return base;
  }

  private getPostFix(name: string) : number {
    var postFix: number = 0;

    this.iterateRecordings((rec: Recording) => {
      if(rec.Name() == name) {
        postFix++;
      }
    });

    return postFix;
  }

  async deleteRecording(name: string) : Promise<boolean> {
    var recording = this.getRecording(name);
    if(recording == undefined) {
      return false;
    }

    this.removeRecording(recording.Name());
    return (await this.deleteFile(recording.Name()));
  }

  private removeRecording(name: string) : void {
    var recording = this.getRecording(name);
    if(recording == undefined) {
      return;
    }

    this.allRecordings[name] = undefined;

    this.length--;
    delete this.allRecordings[name];
  }

  private async deleteAllFiles() : Promise<void> {
    var arr: string[] = [];
    await this.readAllFiles((name: string, value: string) => {
      arr.push(name);
    })

    for(var i = 0; i < arr.length; i++) {
      await this.deleteFile(arr[i]);
    }

    this.allRecordings = {};
  }
}