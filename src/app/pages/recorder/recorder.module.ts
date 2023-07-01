import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecorderPageRoutingModule } from './recorder-routing.module';

import { RecorderPage } from './recorder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecorderPageRoutingModule
  ],
  declarations: [RecorderPage]
})
export class RecorderPageModule {}
