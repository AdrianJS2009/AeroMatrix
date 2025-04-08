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

  private readonly currentLanguageSubject = new BehaviorSubject<Language>({
    code: 'en',
    name: 'English',
  });
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private readonly translate: TranslateService) {
    const initialLang = this.getInitialLanguage();

    this.translate.addLangs(this.availableLanguages.map((lang) => lang.code));
    this.translate.setDefaultLang('en');

    this.setLanguage(initialLang);
  }

  setLanguage(language: Language): void {
    this.translate.use(language.code);
    localStorage.setItem(this.languageKey, JSON.stringify(language));
    this.currentLanguageSubject.next(language);
  }

  private getInitialLanguage(): Language {
    const savedLanguage = localStorage.getItem(this.languageKey);
    if (savedLanguage) {
      return JSON.parse(savedLanguage);
    }

    const browserLang = this.translate.getBrowserLang();
    const matchedLang = this.availableLanguages.find(
      (lang) => lang.code === browserLang
    );

    return matchedLang || this.availableLanguages[0];
  }
}
