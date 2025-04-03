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

    // Listen for system theme changes
    this.listenForSystemThemeChanges();
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

  private updatePrimeNGTheme(themeName: string): void {
    let themeLink = document.getElementById('app-theme') as HTMLLinkElement;

    if (!themeLink) {
      themeLink = document.createElement('link');
      themeLink.id = 'app-theme';
      themeLink.rel = 'stylesheet';
      document.head.appendChild(themeLink);
    }

    themeLink.href = `${themeName}/theme.css`;
  }

  private listenForSystemThemeChanges(): void {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // Add listener for theme changes
      mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem(this.themeKey)) {
          const newTheme: Theme = e.matches ? 'dark' : 'light';
          this.currentThemeSubject.next(newTheme);
          this.applyTheme(newTheme);
        }
      });
    }
  }
}
