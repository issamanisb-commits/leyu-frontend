'use client';

import { useLanguage } from '@/app/context/language-context';
import { t, TranslationKey, LanguageCode } from '@/lib/i18n';

export function useTranslation() {
  const { currentLanguage } = useLanguage();

  return {
    t: (key: TranslationKey) => t(key, currentLanguage as LanguageCode),
    lang: currentLanguage,
  };
}
