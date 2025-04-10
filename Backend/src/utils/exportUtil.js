import fs from 'fs';
import path from 'path';
import { Parser as Json2csvParser } from 'json2csv';
import puppeteer from 'puppeteer';

// Directory where export files will be stored
const EXPORT_DIR = path.resolve('exports');
if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR);
}

/**
 * Exports chart HTML as a PDF or PNG file.
 * @param {string} htmlContent - HTML content to export.
 * @param {string} format - Export format: "pdf" or "png".
 * @param {string} fileName - Name of the file (without extension).
 * @returns {string} - Full file path of the generated export.
 */
const exportChartAsFile = async (htmlContent, format, fileName) => {
  const filePath = path.join(EXPORT_DIR, `${fileName}.${format}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0', // wait until all resources are loaded
  });

  if (format === 'pdf') {
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm',
      },
    });
  } else if (format === 'png') {
    await page.screenshot({
      path: filePath,
      fullPage: true,
      type: 'png',
    });
  } else {
    await browser.close();
    throw new Error(`Unsupported export format: ${format}`);
  }

  await browser.close();
  return filePath;
};

/**
 * Exports JSON data as CSV or JSON file.
 * @param {object[]} data - The data array to export.
 * @param {string} format - Export format: "csv" or "json".
 * @param {string} fileName - Name of the file (without extension).
 * @returns {string} - Full file path of the generated data file.
 */
const exportDataFile = (data, format, fileName) => {
  const filePath = path.join(EXPORT_DIR, `${fileName}.${format}`);
  let content;

  if (format === 'csv') {
    const parser = new Json2csvParser();
    content = parser.parse(data);
  } else if (format === 'json') {
    content = JSON.stringify(data, null, 2);
  } else {
    throw new Error(`Unsupported data export format: ${format}`);
  }

  fs.writeFileSync(filePath, content);
  return filePath;
};

export {
  EXPORT_DIR,
  exportChartAsFile,
  exportDataFile,
};
