import { Injectable, effect, signal } from '@angular/core';
import { APP_CONSTANTS } from '../constants';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<AppTheme>('light');
  readonly theme = this._theme.asReadonly();

  constructor() {
    const stored = localStorage.getItem(APP_CONSTANTS.themeStorageKey) as AppTheme | null;
    if (stored) {
      this._theme.set(stored);
    }
    effect(() => {
      const current = this._theme();
      localStorage.setItem(APP_CONSTANTS.themeStorageKey, current);
      document.body.classList.toggle('dark-theme', current === 'dark');
    });
  }

  toggle(): void {
    this._theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  set(theme: AppTheme): void {
    this._theme.set(theme);
  }
}
