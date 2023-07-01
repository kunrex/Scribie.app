import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { ColorScheme } from './enums/color-enum';

@Injectable()
export class ColorSchemeService {

  constructor(@Inject(DOCUMENT) private document: Document) {}
  
  getColorScheme(): string {
    return localStorage.getItem('colorScheme') ?? 'auto';
  }

  setColorScheme(newColorScheme: ColorScheme): void {
    localStorage.setItem('colorScheme', newColorScheme);
    this.loadStoredTheme();
  }

  loadStoredTheme(): void {
    const colorScheme = localStorage.getItem('colorScheme');
    if (!colorScheme) {
        return;
    }
    this.document.body.classList.remove(ColorScheme.dark);
    this.document.body.classList.remove(ColorScheme.auto);
    this.document.body.classList.remove(ColorScheme.light);
    this.document.body.classList.add(colorScheme);
  }
}