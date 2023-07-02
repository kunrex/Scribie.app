import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';

import { LoadablePage } from '../loadable-page';

import { ActionEnum } from 'src/app/enums/action-enum';
import { RecorderAction } from 'src/app/enums/recording-action';
import { SoundEnum } from 'src/app/services/sound/enums/sound-enum';

import { Recording } from 'src/app/services/recordings/recording';
import { SearchBar } from 'src/app/widgets/search_bars/search-bar';

import { PlayerHandler } from './modals/voice-player/voice-player';
import { TranscribeHandler } from './modals/transcribe/transcribe';

import { AppFlowService } from 'src/app/services/app-flow-service';
import { SoundService } from 'src/app/services/sound/sound-affect-service';
import { RecordingService } from 'src/app/services/recordings/recording-service';

import { RecordingWidgetController } from './widgets/recording-widget-controller';
import { RecordingsAnimationController } from './animations/recordings-animation-controller';

@Component({
  selector: 'recordings',
  templateUrl: './recordings.page.html',
  styleUrls: ['./recordings.page.scss'],

  providers: [RecordingsAnimationController, RecordingWidgetController, PlayerHandler, TranscribeHandler]
})
export class RecordingsPage extends LoadablePage<RecordingsAnimationController, RecordingWidgetController> {
  displayFiles: Recording[] = [];
  private allFiles: Recording[] = [];

  private readonly playerHandler: PlayerHandler;
  private readonly transcribeHandler: TranscribeHandler;

  private readonly appFlowService: AppFlowService;
  private readonly recordingService: RecordingService;

  @ViewChildren('title', { read: ElementRef }) recordingItems!: QueryList<ElementRef>;

  private search: SearchBar | undefined = undefined;
  private searchBarElement: ElementRef | undefined = undefined;
  @ViewChild('search', { static: false }) set setSearchBar(content: ElementRef) {
    if(content) {
      this.searchBarElement = content;
      const casted = this.searchBarElement.nativeElement as HTMLInputElement;
      
      if(casted != undefined) {
        this.search = new SearchBar(casted);

        this.search.withInputReset(
          async (name: string) => {
            this.filterDisplayedFiles(name);
          }, 
          async () => {
            this.displayAllFiles();
          });
      }
    }
  }

  constructor(appFlowService: AppFlowService, recordingService: RecordingService, playHandler: PlayerHandler, transcribeHandler: TranscribeHandler, animationController: RecordingsAnimationController, widgetController: RecordingWidgetController, soundService: SoundService,) {
    super(animationController, widgetController, soundService);
    
    this.playerHandler = playHandler;
    this.transcribeHandler = transcribeHandler;

    this.appFlowService = appFlowService;
    this.recordingService = recordingService;
  }

  protected onInit(): void { }

  protected viewWillEnter(): void { }

  protected async viewDidEnter(): Promise<void> {
    this.allFiles = [];
    this.displayFiles = [];

    this.recordingService.iterateRecordings((rec: Recording) => {
      this.allFiles.push(rec);
      this.pushDisplayFile(rec);
    });

    this.completeLoading();
  }

  protected onCompleteLoad(): void {
    const result: string | undefined = this.appFlowService.getRecordingStatus();
    
    if(result != undefined) {
      const element = this.getRecordingHTML(result);
      if(element != undefined) {
        this.animationController.playHighlightAnimation(element);
      }
      
      this.widgetController.presentAddedToast();
      this.soundService.playSound(SoundEnum.save);
    }
  }

  private displayAllFiles() {
    this.displayFiles = [];
    
    for(var i: number = 0; i < this.allFiles.length; i++) {
      this.pushDisplayFile(this.allFiles[i]);
    }
  }

  private filterDisplayedFiles(name: string) {
    this.displayFiles = [];
    const value = name.toUpperCase();

    this.recordingService.iterateRecordings((rec: Recording) => {
      if(rec.ToUpper().indexOf(value) != -1) {
        this.pushDisplayFile(rec);
      }
    });
  }

  private pushDisplayFile(rec: Recording) {
    this.displayFiles.push(rec);
  }

  async more(recording: string) : Promise<void> {
    var result = await this.widgetController.getMoreOptionsResult();
    if(result == undefined) {
      await this.presentErrorAlert();
      return;
    }

    switch(result)
    {
      case RecorderAction.Play:
        this.openPlayer(recording);
        break;
      case RecorderAction.Rename:
        var renameResult = await this.widgetController.getRenameResult(recording);
        if(renameResult == undefined) {
          return;
        }

        const element = this.getRecordingHTML(recording);
        await this.recordingService.renameRecording(recording, renameResult);

        this.widgetController.presentRenameToast();
        this.soundService.playSound(SoundEnum.save);

        if(element != undefined) {
          this.animationController.playHighlightAnimation(element);
        }
        break;
      case RecorderAction.Delete:
        var deleteResult = await this.widgetController.getDeleteResult();
        if(deleteResult == undefined) {
          return;
        }
        else if(deleteResult == ActionEnum.confirm) {
          await this.deleteFile(recording);
          this.widgetController.presentDeleteToast();
        }
        break;
      case RecorderAction.Transcirbe:
        this.openTranscribe();
        break;
    }
  }

  private getRecordingHTML(recording: string) : HTMLElement | undefined {
    if(this.recordingItems == undefined) {
      return undefined;
    }

    for(var i : number = 0; i < this.recordingItems.length; i++) {
      var current = this.recordingItems.get(i);
      if(current != undefined) {
        var casted = current.nativeElement;

        if(casted.id == recording) {
          return casted;
        }
      }
    }

    return undefined;
  }

  private async deleteFile(recording: string) : Promise<void> {
    for(var i: number = 0; i < this.displayFiles.length; i++) {
      if(this.displayFiles[i].Name() == recording) {
        this.displayFiles.splice(i, 1);
        await this.recordingService.deleteRecording(recording);
        
        this.soundService.playSound(SoundEnum.discard);
        break;
      }
    }
  }

  async recordNew() : Promise<void> {
    await this.appFlowService.openRecorder();
  }

  async openPlayer(recording: string) : Promise<void> {
    this.soundService.playSound(SoundEnum.click);
    var result = await this.playerHandler.create(recording);

    if(result != undefined) {
      switch (result.Data()) {
        case ActionEnum.cancel:
          this.presentErrorAlert();
          break;
        case ActionEnum.transcibe:
          setTimeout(() => { 
            this.openTranscribe();
          }, 500);
          break;
      }
    }
  }

  async openTranscribe() : Promise<void> {
    this.soundService.playSound(SoundEnum.click);
    await this.transcribeHandler.create();
  }

  async unloadObjectData(): Promise<void> { 
    if(this.searchBarElement != undefined) {
      const el = this.searchBarElement.nativeElement as HTMLInputElement;

      if(el != undefined) {
        el.value = '';
      }
    }

    this.allFiles = [];
    this.displayFiles = [];
  }
}