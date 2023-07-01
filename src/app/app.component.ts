import { Component } from '@angular/core';

import { ColorScheme } from 'src/app/services/enums/color-enum';
import { ColorSchemeService } from 'src/app/services/color-scheme';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private readonly colorSchemeService: ColorSchemeService) {
    this.colorSchemeService.setColorScheme(ColorScheme.light);
  }
}
