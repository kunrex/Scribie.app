import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordingsPageRoutingModule } from './recordings-routing.module';

import { RecordingsPage } from './recordings.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    RecordingsPageRoutingModule
  ],
  declarations: [RecordingsPage]
})
export class RecordingsPageModule {}
