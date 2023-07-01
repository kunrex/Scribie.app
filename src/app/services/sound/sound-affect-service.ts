import { Injectable } from "@angular/core";
import { NativeAudio } from '@capacitor-community/native-audio'

import { SoundEnum } from "./enums/sound-enum";

import { Initilaisiable } from "src/app/initilizable";

@Injectable()
export class SoundService extends Initilaisiable {
  constructor() {
    super();
  }

  async initialiseSoundAffects() : Promise<void> {
    if(this.IsInitialised()) {
      return;
    }

    const keys = Object.keys(SoundEnum);
    const values = Object.values(SoundEnum);
    for(var i: number = 0; i < values.length; i++) {
      await NativeAudio.preload({
        assetId: keys[i],
        assetPath: values[i] + ".mp3",

        isUrl: false,
        audioChannelNum: 1
      });
    }

    this.initialise();
  }

  async playSound(sound: SoundEnum) : Promise<void> {
    await NativeAudio.play({
      assetId: sound,
      time: 0
    });
  }
}