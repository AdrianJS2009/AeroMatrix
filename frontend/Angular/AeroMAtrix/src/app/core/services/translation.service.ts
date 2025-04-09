import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export interface Language {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly languageKey = 'aeromatrix-language';

  availableLanguages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  // BehaviorSubject for current language to allow reactive updates
  private readonly currentLanguageSubject = new BehaviorSubject<Language>({
    code: 'en',
    name: 'English',
  });
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private readonly translate: TranslateService) {
    // Determine the initial language based on stored value or browser language
    const initialLang = this.getInitialLanguage();

    this.translate.addLangs(this.availableLanguages.map((lang) => lang.code));
    this.translate.setDefaultLang('en');

    this.setLanguage(initialLang);
  }

  // Set the application language and persist it in localStorage
  setLanguage(language: Language): void {
    this.translate.use(language.code);
    localStorage.setItem(this.languageKey, JSON.stringify(language));
    this.currentLanguageSubject.next(language);
  }

  // Retrieve the initial language from localStorage or browser preference
  private getInitialLanguage(): Language {
    const savedLanguage = localStorage.getItem(this.languageKey);
    if (savedLanguage) {
      try {
        return JSON.parse(savedLanguage);
      } catch (error) {
        console.error('Failed to parse saved language', error);
      }
    }

    const browserLang = this.translate.getBrowserLang();
    const matchedLang = this.availableLanguages.find(
      (lang) => lang.code === browserLang
    );
    return matchedLang || this.availableLanguages[0];
  }
}
