import { Router } from "@angular/router";
import { Injectable, NgZone } from "@angular/core";

import { PageEnum } from "../app-routing.module";

import { SoundService } from "./sound/sound-affect-service";

import { RecordingService } from "./recordings/recording-service";
import { CustomRecordingData } from "./recordings/custom-recording-data";

@Injectable()
export class AppFlowService {
  private applicationLoaded: boolean;

  private currentPage: PageEnum;
  private readonly router: Router;
  private readonly ngZone: NgZone;

  private new: string | undefined = undefined;

  private readonly soundService: SoundService;
  private readonly recordingService: RecordingService;

  constructor(router: Router, ngZone: NgZone, recordingService: RecordingService, soundService: SoundService) {
    this.router = router;
    this.ngZone = ngZone;
    this.currentPage = PageEnum.Splashscreen;

    this.soundService = soundService;
    this.recordingService = recordingService;
    
    this.applicationLoaded = false;
  }

  async loadApplication() : Promise<void> {
    if(this.applicationLoaded) {
      console.log('ERROR: loadApplication() called twice');
      return;
    }
    
    await this.recordingService.loadAllFiles();
    if(!this.recordingService.IsInitialised()) {
      console.log('ERROR: recordings need to be initialised before the app is loaded');
      return;
    }

    await this.soundService.initialiseSoundAffects();

    const length = this.recordingService.Length();
    if(length > 0) {
      this.openRecordings();
    }
    else {
      this.openRecorder();
    }

    this.new = undefined;
    this.applicationLoaded = true;
  }

  async pushNewRecording(data: CustomRecordingData) : Promise<void> {
    if(this.currentPage != PageEnum.Recorder){
      return;
    }

    var result = await this.recordingService.addNew(data);
    if(result == undefined) {
      console.log('ERROR: failed to ADD RECORDING:');
      console.log('\Data:' + data.date)
      console.log('\Size:' + data.size)
      console.log('\tDURATION:' + data.duration)

      return;
    }

    this.new = result;
    this.openRecordings();
  }

  async openRecorder() : Promise<void> {
    this.navigate(PageEnum.Recorder);
  }

  async openRecordings() : Promise<void> {
    this.navigate(PageEnum.Recordings);
  }

  private async navigate(page: PageEnum) : Promise<void> {
    if(this.currentPage != page) {
      this.ngZone.run(async() => {
        this.currentPage = page;
        await this.router.navigateByUrl('/' + page);
      });
    }
  }

  getRecordingStatus() : string | undefined {
    const rec = this.new;

    this.new = undefined
    return rec;
  }
}