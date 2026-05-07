#!/usr/bin/env python3
import openpyxl

# Read Excel
wb = openpyxl.load_workbook('Leyu open source translations.xlsx')
ws = wb.active

# Parse rows
translations = {}
for row in ws.iter_rows(min_row=2, values_only=True):  # Skip header
    if not row[0]:  # Skip empty rows
        continue
    key = row[0]
    en = row[1] or ''
    am = row[2] or ''
    or_val = row[3] or ''
    translations[key] = {'en': en, 'am': am, 'om': or_val}

# Generate TypeScript content
lines = ["// Translation dictionary - Add Amharic (am) and Oromo (or) translations as needed"]
lines.append("export const translations = {")

# Group by category (detect from comments in original file)
for key, vals in translations.items():
    # Escape single quotes
    en = vals['en'].replace("'", "\\'")
    am = vals['am'].replace("'", "\\'")
    or_val = vals['om'].replace("'", "\\'")
    lines.append(f"  {key}: {{ en: '{en}', am: '{am}', or: '{or_val}' }},")

lines.append("} as const;")
lines.append("")
lines.append("export type TranslationKey = keyof typeof translations;")
lines.append("export type LanguageCode = 'en' | 'am' | 'om';")
lines.append("")
lines.append("export function t(key: TranslationKey, lang: LanguageCode = 'en'): string {")
lines.append("  return translations[key]?.[lang] || translations[key]?.en || key;")
lines.append("}")

# Write to file
with open('src/lib/i18n.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"✅ Updated i18n.ts with {len(translations)} translation keys from Excel")
