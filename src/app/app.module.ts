import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import { pageAnimation } from './animations/nav-animation';

import { AppFlowService } from './services/app-flow-service';
import { ColorSchemeService } from './services/color-scheme';
import { SoundService } from './services/sound/sound-affect-service';
import { RecordingService } from './services/recordings/recording-service';

import { Player } from './pages/recordings/modals/voice-player/voice-player';
import { Transcribe } from './pages/recordings/modals/transcribe/transcribe';

@NgModule({
  declarations: [AppComponent, Player, Transcribe],
  
  imports: [BrowserModule, IonicModule.forRoot({
    navAnimation: pageAnimation
    }), AppRoutingModule, FontAwesomeModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, RecordingService, AppFlowService, SoundService, ColorSchemeService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }
}
