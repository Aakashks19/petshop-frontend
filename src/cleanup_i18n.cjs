const fs = require('fs');
const path = 'd:\\zAakash\\Pet Shop\\client\\src\\i18n.js';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);
const newLines = lines.filter((line, index) => {
    const lineNum = index + 1;
    return lineNum < 403 || lineNum > 1227;
});
fs.writeFileSync(path, newLines.join('\n'));
console.log('Successfully updated i18n.js');
