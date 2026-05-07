/**
 * TRANSLATION SYSTEM USAGE EXAMPLES
 * 
 * This file demonstrates how to use the translation system in your components.
 * The system is simple and frontend-only - no external libraries needed.
 */

// ============================================================================
// EXAMPLE 1: Using translations in a React component
// ============================================================================

/*
'use client';

import { useTranslation } from '@/lib/hooks/useTranslation';

export function MyComponent() {
  const { t, lang } = useTranslation();

  return (
    <div>
      <h1>{t('taskName')}</h1>
      <p>{t('description')}</p>
      <button>{t('save')}</button>
      <p>Current language: {lang}</p>
    </div>
  );
}
*/

// ============================================================================
// EXAMPLE 2: Using the language switcher
// ============================================================================

/*
'use client';

import LanguageSwitcher from '@/app/components/layout/LanguageSwitcher';

export function Header() {
  return (
    <header>
      <h1>My App</h1>
      <LanguageSwitcher />
    </header>
  );
}
*/

// ============================================================================
// EXAMPLE 3: How the translation system works
// ============================================================================

/*
1. User selects a language in LanguageSwitcher dropdown
2. setLanguage(newLang) is called in the language context
3. Language is saved to localStorage
4. currentLanguage state updates
5. All components using useTranslation() hook re-render
6. t() function returns translation in the new language
7. UI updates instantly

Example flow:
- User selects "አማርኛ (Amharic)" from dropdown
- setLanguage('am') is called
- localStorage.setItem('language', 'am')
- currentLanguage state changes to 'am'
- Components re-render
- t('taskName') now returns translations['taskName']['am']
- UI shows Amharic text
*/

// ============================================================================
// EXAMPLE 4: Adding new translation keys
// ============================================================================

/*
To add a new translation key:

1. Open src/lib/i18n.ts
2. Add a new key to the translations object:

  myNewKey: { en: 'English text', am: '', or: '' },

3. Use it in your component:

  const { t } = useTranslation();
  <p>{t('myNewKey')}</p>

4. Fill in Amharic and Oromo translations when available
*/

// ============================================================================
// EXAMPLE 5: Translation dictionary structure
// ============================================================================

/*
Each translation key has this structure:

{
  en: 'English translation',
  am: 'Amharic translation (to be filled)',
  or: 'Oromo translation (to be filled)'
}

Example:
  taskName: { 
    en: 'Task Name', 
    am: 'ተግባር ስም', 
    or: 'Maqaa Hojii' 
  }
*/

// ============================================================================
// EXAMPLE 6: Type safety
// ============================================================================

/*
The translation system is fully type-safe:

- TranslationKey type ensures you only use valid keys
- LanguageCode type ensures you only use valid language codes ('en', 'am', 'om')
- TypeScript will warn if you use an invalid key

Example:
  const { t } = useTranslation();
  t('invalidKey'); // TypeScript error: not a valid TranslationKey
  t('taskName');   // OK
*/

export {};
