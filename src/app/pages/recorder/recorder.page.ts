import { VoiceRecorder, RecordingData, GenericResponse } from 'capacitor-voice-recorder';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';

import { LoadablePage } from '../loadable-page';

import { StatusEnum } from './enums/status-enum';
import { ActionEnum } from 'src/app/enums/action-enum';
import { SoundEnum } from 'src/app/services/sound/enums/sound-enum';

import { Stopwatch } from './services/stopwatch';
import { AppFlowService } from 'src/app/services/app-flow-service';
import { SoundService } from 'src/app/services/sound/sound-affect-service';
import { CustomRecordingData } from 'src/app/services/recordings/custom-recording-data';

import { RecorderWidgetController } from './widgets/recorder-widget-controller';
import { RecorderAnimationController } from './animations/recorder-animation-controller';

@Component({
  selector: 'recorder',
  templateUrl: './recorder.page.html',
  styleUrls: ['./recorder.page.scss'],

  providers: [ RecorderAnimationController, RecorderWidgetController, Stopwatch ]
})
export class RecorderPage extends LoadablePage<RecorderAnimationController, RecorderWidgetController> {
  private status: StatusEnum = StatusEnum.NONE;
  Status() : string {
    return this.status;
  }

  private hasPermission: boolean = false;

  private audioBase64: string = '';
  private audioDuration: string = '';

  private readonly stopwatch: Stopwatch;
  private readonly appFlowService: AppFlowService;

  private button: ElementRef | undefined = undefined;
  @ViewChild('record', { static: false }) set setButton(content: ElementRef) {
    if(content) {
      this.button = content;
    }
  }

  private controlBodyContent: ElementRef | undefined = undefined;
  @ViewChild('content', { static: false }) set setControlBody(content: ElementRef) {
    if(content) {
      this.controlBodyContent = content;
      this.animationController.assignFadeElement(this.controlBodyContent.nativeElement);
    }
  }

  @ViewChildren('bar', { read: ElementRef }) set setProgressBars(elements: QueryList<ElementRef>) {
    if(elements) {
      //assign progress bar animation
    }
  }

  Duration() : string {
    return this.stopwatch.Duration();
  }

  constructor(stopwatch: Stopwatch, appFlowService: AppFlowService, animCtrl: RecorderAnimationController, widgetCtrl: RecorderWidgetController, soundService: SoundService) {
    super(animCtrl, widgetCtrl, soundService);
    
    this.stopwatch = stopwatch;
    this.appFlowService = appFlowService;
  }

  protected onInit(): void { }

  protected viewWillEnter(): void {
    this.resetRecordingData();
  }

  protected async viewDidEnter(): Promise<void> { 
    this.checkAudioPermission(await VoiceRecorder.hasAudioRecordingPermission());
    
    this.completeLoading();
  }

  protected onCompleteLoad(): void { }

  async presentPermissionAlert() : Promise<void> {
    const role = await this.widgetController.getPermissionResult();
    if(role == undefined) {
      await this.presentErrorAlert();
      return;
    }

    this.checkAudioPermission(await VoiceRecorder.requestAudioRecordingPermission());
  }

  checkAudioPermission(result: GenericResponse) : void {
    if(!result || !result.value) {
      return;
    }

    this.hasPermission = true;
  }

  async toggleRecorder() : Promise<void> {   
    if(!this.hasPermission) {
      await this.presentPermissionAlert();

      if(!this.hasPermission) {
        return;
      }
    }
        
    switch(this.status) {
      case StatusEnum.NONE: 
        await this.startRecording();
        break;
      case StatusEnum.RECORDING:
        await this.stopRecording();
        break;
    }
  }

  private async startRecording() : Promise<void> {
    if(this.status != StatusEnum.NONE) { 
      console.log('ERROR: recording started when \'STATUS != NONE\'');
      return;
    }

    this.audioBase64 = '';
    this.audioDuration = '';
    
    this.status = StatusEnum.RECORDING;

    this.stopwatch.startStopwatch();
    await this.soundService.playSound(SoundEnum.startRecording);
    if(this.button != undefined) {
      await this.animationController.toggleButtonAnimation(this.button.nativeElement, true);
    }

    this.animationController.toggleProgressBars();
    await VoiceRecorder.startRecording();
  }

  private async stopRecording(): Promise<void> {
    if(this.status != StatusEnum.RECORDING) {
      console.log('ERROR: recorging stopped when \'STATUS != RECORDING\'');
      return;
    }
    
    this.stopwatch.stopStopwatch();
    var recorderStatus = await VoiceRecorder.getCurrentStatus();
    try {
      if(recorderStatus.status == StatusEnum.RECORDING)
      {
        await VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
          if(result && result.value && result.value.recordDataBase64) {
            this.audioBase64 = result.value.recordDataBase64;
          };
        });
  
        this.audioDuration = this.Duration();
        await this.updateStatus();
      }
      else {
        await this.resetState();
      }
    }
    catch {
      await this.resetState();
    }
  }

  private async resetState() {
    this.resetRecordingData();

    this.soundService.playSound(SoundEnum.stopRecording);
    if(this.button != undefined) {
      await this.animationController.toggleButtonAnimation(this.button.nativeElement, false);
    }

    this.widgetController.presentRecordingToast();
  }

  async discard() : Promise<void> {
    const result = await this.widgetController.getDeleteResult();
    if(result == undefined) {
      return;
    }

    if(result == ActionEnum.confirm) {
      this.resetRecordingData();
      await this.updateStatus();
    }
  }

  async confirm() : Promise<void> {
    const date: string = new Date().toLocaleDateString();

    var size: number = new Blob([this.audioBase64]).size * 0.000001;
    size = Math.round((size + Number.EPSILON) * 100) / 100

    this.appFlowService.pushNewRecording(new CustomRecordingData(
      size.toString() + 'MB',
      date,
      this.audioDuration,
      ".wav",
      this.audioBase64
    ));
  }

  private async updateStatus() : Promise<void> {
    this.soundService.playSound(SoundEnum.stopRecording);
    await this.animationController.toggleFadeAnimation(true);
    
    switch (this.status) {
      case StatusEnum.STORED:
        this.status = StatusEnum.NONE;
        break;
      case StatusEnum.RECORDING:
          this.status = StatusEnum.STORED;
          break;
    }

    this.animationController.toggleFadeAnimation(false);
  }

  returnToRecordings() : void {
    this.appFlowService.openRecordings();
  }

  protected unloadObjectData(): void {
    this.resetRecordingData();
  }

  private resetRecordingData() : void {
    this.audioBase64 = '';
    this.audioDuration = '';

    this.stopwatch.clear();
    this.status = StatusEnum.NONE;
  }
}
