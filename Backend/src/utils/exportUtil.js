
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exportFolder = path.resolve(__dirname, '../../exports');

if (!fs.existsSync(exportFolder)) {
  fs.mkdirSync(exportFolder, { recursive: true });
}

export async function exportChartAsFile(htmlContent, format, fileName) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const outputPath = path.join(exportFolder, `${fileName}.${format}`);

  if (format === 'pdf') {
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true });
  } else {
    await page.screenshot({ path: outputPath, fullPage: true });
  }

  await browser.close();
  return outputPath;
}

export function exportDataFile(data, format, fileName) {
  const filePath = path.join(exportFolder, `${fileName}.${format}`);
  const content = format === 'csv' ? convertToCSV(data) : JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, content);
  return filePath;
}

function convertToCSV(data) {
  if (!Array.isArray(data) || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => headers.map(header => JSON.stringify(obj[header] || '')).join(','));
  return [headers.join(','), ...rows].join('\n');
}
