import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecorderPage } from './recorder.page';

const routes: Routes = [
  {
    path: '',
    component: RecorderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecorderPageRoutingModule {}
