import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordingsPage } from './recordings.page';

const routes: Routes = [
  {
    path: '',
    component: RecordingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordingsPageRoutingModule {}
