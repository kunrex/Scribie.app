import { ModalController, Platform } from '@ionic/angular';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';

import { ActionEnum } from 'src/app/enums/action-enum';

import { Modal } from 'src/app/widgets/modals/modal';
import { Slider } from 'src/app/widgets/sliders/slider';
import { ModalResult } from 'src/app/widgets/modals/modal-result';
import { ModalHandler } from 'src/app/widgets/modals/modal-handler';

import { RecordingService } from 'src/app/services/recordings/recording-service';

import WaveSurfer from 'wavesurfer.js';
import { Recording } from 'src/app/services/recordings/recording';

@Injectable()
export class PlayerHandler extends ModalHandler {
  async create(fileName: string) : Promise<ModalResult | null> {
    const modal = await this.modalController.create({
      component: Player,
      cssClass: 'player-modal',
      componentProps: {
        'fileName': fileName,
      } 
    });

    return await this.presentModal(modal);
  }
}

@Component ({
  templateUrl: './voice-player-modal.component.html',
  styleUrls: ['./voice-player-modal.component.scss'],
})
export class Player extends Modal implements OnInit, AfterViewInit {
  @Input() fileName!: string;
  private recording: Recording | undefined;

  private isInitialised: boolean = false;

  private waveSurfer!: WaveSurfer;

  private isPlaying: boolean = false;
  IsPlaying() : boolean {
    return this.isPlaying;
  }

  private isFinished: boolean = false;
  private recordingLength: number = 0;

  private volumeSlider!: Slider;
  private timelineSlider!: Slider;

  private readonly platform: Platform;
  private readonly changeDetector: ChangeDetectorRef;
  private readonly recordingService: RecordingService;

  @ViewChild('volume', { static: false }) volumeRange!: ElementRef;
  @ViewChild('timeline', { static: false }) timelineRange!: ElementRef;

  constructor(ctrl: ModalController, platform: Platform, changeDetector: ChangeDetectorRef, recordingService: RecordingService) {
    super(ctrl);

    this.platform = platform;
    this.changeDetector = changeDetector;
    this.recordingService = recordingService;
  }

  async ngOnInit(): Promise<void> {
    const height = this.platform.height();

    this.waveSurfer = WaveSurfer.create({
      container: "#waveform",

      waveColor: 'black',
      progressColor: '#65737e',

      height: height > 1100 ? 280 : 180,
      minPxPerSec: 75,
      scrollParent: true,
      hideScrollbar: true,

      interact: false,

      barHeight: 1,
      cursorWidth: 0,
    });

    this.recording = this.recordingService.getRecording(this.fileName);
    if(this.recording == undefined) {
      this.dismiss(ActionEnum.cancel, ActionEnum.cancel);
      return;
    }

    var raw = window.atob(this.recording.Base64());
    var length = raw.length;

    var arr = new Uint8Array(new ArrayBuffer(length));
    for(var i: number = 0; i < length; i++) {
      arr[i] = raw.charCodeAt(i);
    }

    var blob = new Blob([arr], {
      type: 'audio/ogg'
    });

    this.waveSurfer.loadBlob(blob);
  }

  ngAfterViewInit(): void {
    this.timelineSlider = new Slider(this.timelineRange.nativeElement as HTMLInputElement);
    this.timelineSlider.withChange(async (value) => {
      await this.seek(value);
    });

    this.waveSurfer.on('audioprocess', () => {
      const duration = this.waveSurfer.getDuration();
      this.timelineSlider.updateValue(this.waveSurfer.getCurrentTime() / duration).toString();
    });

    this.waveSurfer.on('finish', () => {
      this.isFinished = true;
      this.isPlaying = false;

      this.changeDetector.detectChanges();
    });

    this.volumeSlider = new Slider(this.volumeRange.nativeElement as HTMLInputElement);
    this.volumeSlider.withInput(async (value) => {
      await this.volumeControl(value);
    });
      
    this.volumeSlider.updateValue(this.waveSurfer.getVolume());

    this.isInitialised = true;
  }

  GetPosition() : string {
    return "0";
  }

  GetDuration() : string {
    const duartion = Math.trunc(this.waveSurfer.getDuration());

    const minutes = Math.floor(duartion / 60);
    const seconds = (duartion % 60).toString().padStart(2, '0');

    return minutes + ":" + seconds;
  }

  async playPause() : Promise<void> {
    if(!this.isInitialised) {
      return;
    }

    if(this.isPlaying) {
      this.pause();
      this.isPlaying = false;
    }
    else {
      this.play();
      this.isPlaying = true;
    }
  }

  private async play() : Promise<void> {
    if(this.isFinished) {
      this.isFinished = false;
    }

    this.waveSurfer.play();
  }

  private async pause() : Promise<void> {
    this.waveSurfer.pause();
  }

  async forward(seconds: number) {
    if(!this.isInitialised) {
      return;
    }

    if(this.isPlaying) {
      if(seconds > 0) {
        await this.waveSurfer.skipForward(seconds);
      }
      else {
        await this.waveSurfer.skipBackward(seconds);
      }
    }
  }

  async seek(value: string) : Promise<void> {
    if(!this.isInitialised) {
      return;
    }

    this.waveSurfer.seekAndCenter(parseInt(value)/ this.timelineSlider.Max());
  }

  async volumeControl(value: string) : Promise<void> {
    if(!this.isInitialised) {
      return;
    }
    
    this.waveSurfer.setVolume(parseInt(value) / this.volumeSlider.Max());
  }

  async cancel(): Promise<boolean> {
    return this.dismiss(ActionEnum.confirm, ActionEnum.confirm);
  }

  async confirm(): Promise<boolean> {
    return this.dismiss(ActionEnum.confirm, ActionEnum.confirm);
  }

  async transcribe() : Promise<boolean> {
    return this.dismiss(ActionEnum.transcibe, ActionEnum.transcibe);
  }

  clearData() : void {
    this.fileName = '';
    this.isInitialised = false;
  }
}