import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeKey = 'aeromatrix-theme';
  private readonly currentThemeSubject = new BehaviorSubject<Theme>(
    this.getInitialTheme()
  );

  currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.applyTheme(this.currentThemeSubject.value);
  }

  toggleTheme(): void {
    const newTheme =
      this.currentThemeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    localStorage.setItem(this.themeKey, theme);
    this.currentThemeSubject.next(theme);
    this.applyTheme(theme);
  }

  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem(this.themeKey) as Theme;
    if (savedTheme) {
      return savedTheme;
    }

    // Check for system preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    return 'light';
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);

    // Apply theme class to body
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }
}
