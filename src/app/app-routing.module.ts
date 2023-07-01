import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export enum PageEnum {
  Recorder = 'recorder',
  Recordings = 'recordings',
  
  Splashscreen = 'splashscreen',
}

const routes: Routes = [
  {
    path: '',
    redirectTo: PageEnum.Splashscreen,
    pathMatch: 'full'
  },
  {
    path: PageEnum.Recorder,
    loadChildren: () => import('./pages/recorder/recorder.module').then( m => m.RecorderPageModule)
  },
  {
    path: PageEnum.Recordings,
    loadChildren: () => import('./pages/recordings/recordings.module').then( m => m.RecordingsPageModule)
  },
  {
    path: PageEnum.Splashscreen,
    loadChildren: () => import('./pages/splashscreen/splashscreen.module').then( m => m.SplashscreenPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
