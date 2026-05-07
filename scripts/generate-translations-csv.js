const fs = require('fs');
const path = require('path');

// Read the i18n.ts file
const i18nContent = fs.readFileSync(path.join(__dirname, '../src/lib/i18n.ts'), 'utf8');

// Extract all translation entries using regex
const entryRegex = /^\s{2}(\w+):\s*\{\s*en:\s*'((?:[^'\\]|\\.|'')*)',\s*am:\s*'((?:[^'\\]|\\.|'')*)',\s*or:\s*'((?:[^'\\]|\\.|'')*)'\s*\}/gm;

const rows = [['Key', 'English (en)', 'Amharic (am)', 'Oromo (or)']];

let match;
while ((match = entryRegex.exec(i18nContent)) !== null) {
  const key = match[1];
  const en = match[2].replace(/\\'/g, "'");
  const am = match[3].replace(/\\'/g, "'");
  const or = match[4].replace(/\\'/g, "'");
  rows.push([key, en, am, or]);
}

// Also handle entries with double quotes
const entryRegexDQ = /^\s{2}(\w+):\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)",\s*am:\s*"((?:[^"\\]|\\.)*)",\s*or:\s*"((?:[^"\\]|\\.)*)"\s*\}/gm;
while ((match = entryRegexDQ.exec(i18nContent)) !== null) {
  const key = match[1];
  // Skip if already captured
  if (!rows.find(r => r[0] === key)) {
    const en = match[2];
    const am = match[3];
    const or = match[4];
    rows.push([key, en, am, or]);
  }
}

// Escape CSV field: wrap in quotes if contains comma, quote, or newline
function escapeCSV(field) {
  if (field === undefined || field === null) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// Generate CSV with UTF-8 BOM for Excel compatibility
const csvLines = rows.map(row => row.map(escapeCSV).join(','));
const csvContent = '\uFEFF' + csvLines.join('\n'); // BOM for Excel UTF-8

const outputPath = path.join(__dirname, '../translations.csv');
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`✅ Generated translations.csv with ${rows.length - 1} translation keys`);
console.log(`📁 File saved to: ${outputPath}`);
