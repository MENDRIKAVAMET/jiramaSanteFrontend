import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly theme = signal<'light' | 'dark'>('light');

  constructor() {
    const saved = localStorage.getItem('jirama_theme');
    if (saved === 'dark') this.setDark();
  }

  toggle(): void {
    this.theme() === 'light' ? this.setDark() : this.setLight();
  }

  private setDark(): void {
    this.theme.set('dark');
    this.document.body.classList.add('dark-theme');
    localStorage.setItem('jirama_theme', 'dark');
  }

  private setLight(): void {
    this.theme.set('light');
    this.document.body.classList.remove('dark-theme');
    localStorage.setItem('jirama_theme', 'light');
  }
}
