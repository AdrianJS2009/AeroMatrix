import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
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
  private readonly renderer: Renderer2;

  currentTheme$ = this.currentThemeSubject.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.applyTheme(this.currentThemeSubject.value);
    // Listen to system theme changes
    this.listenForSystemThemeChanges();
  }

  // Toggle theme between 'light' and 'dark'
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

  // checking localStorage and system preferences
  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem(this.themeKey) as Theme;
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference if no value is saved
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    return 'light';
  }

  private applyTheme(theme: Theme): void {
    this.renderer.setAttribute(document.documentElement, 'data-theme', theme);

    if (theme === 'dark') {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.removeClass(document.body, 'light-theme');
      this.updatePrimeNGTheme('lara-dark-blue');
    } else {
      this.renderer.addClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
      this.updatePrimeNGTheme('lara-light-blue');
    }
  }

  // update the PrimeNG theme CSS file
  private updatePrimeNGTheme(themeName: string): void {
    let themeLink = document.getElementById('app-theme') as HTMLLinkElement;

    if (!themeLink) {
      themeLink = document.createElement('link');
      themeLink.id = 'app-theme';
      themeLink.rel = 'stylesheet';
      document.head.appendChild(themeLink);
    }

    themeLink.href = `assets/themes/${themeName}/theme.css`;
  }

  // Listen for changes in system theme preferences and apply them
  private listenForSystemThemeChanges(): void {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // Only update if there's no stored preference in localStorage
        if (!localStorage.getItem(this.themeKey)) {
          const newTheme: Theme = e.matches ? 'dark' : 'light';
          this.currentThemeSubject.next(newTheme);
          this.applyTheme(newTheme);
        }
      });
    }
  }
}
