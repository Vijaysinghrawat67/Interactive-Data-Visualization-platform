import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export async function exportChartAsFile(htmlContent, format, fileName) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Wait until your page sets window.chartsRendered = true or timeout after 10 seconds
  await page.waitForFunction('window.chartsRendered === true', { timeout: 10000 });

  const outputDir = path.resolve('exports');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const outputPath = path.join(outputDir, `${fileName}.${format}`);

  if (format === 'pdf') {
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true });
  } else if (format === 'png') {
    await page.screenshot({ path: outputPath, fullPage: true });
  }

  await browser.close();

  return outputPath;
}


export function exportDataFile(data, exportFormat, fileName) {
  const outputDir = path.resolve('exports');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const filePath = path.join(outputDir, `${fileName}.${exportFormat}`);

  if (exportFormat === 'json') {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } else if (exportFormat === 'csv') {
    // Basic CSV conversion (you might want to improve this)
    if (!data.length) {
      fs.writeFileSync(filePath, '', 'utf-8');
    } else {
      const headers = Object.keys(data[0]);
      const csv = [
        headers.join(','),
        ...data.map(row => headers.map(field => JSON.stringify(row[field] || '')).join(','))
      ].join('\n');
      fs.writeFileSync(filePath, csv, 'utf-8');
    }
  }

  return filePath;
}
