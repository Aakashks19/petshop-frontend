const fs = require('fs');
const path = './i18n.js';
try {
    const content = fs.readFileSync(path, 'utf8');
    const lines = content.split('\n');

    // The first 2301 lines contain the correct consolidated resources block
    // We search for where the resources block actually ends to be safe
    let endIdx = 2301;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '};' && i > 100) {
            // Find the SECOND or later }; that looks like the end of resources
            // After running the initial script, the first 2301 lines should be the resources.
            // Let's just stick to 2301 if it looks correct.
            endIdx = i + 1;
            break;
        }
    }

    const resourcesPart = lines.slice(0, endIdx).join('\n');

    const fixedContent = `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

${resourcesPart}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
`;

    fs.writeFileSync(path, fixedContent);
    console.log('Successfully fixed i18n.js structure. resources ended at line ' + endIdx);
} catch (err) {
    console.error('Error fixing i18n.js:', err);
    process.exit(1);
}
