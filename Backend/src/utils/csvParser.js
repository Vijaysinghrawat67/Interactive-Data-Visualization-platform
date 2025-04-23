import fs from 'fs';
import csv from 'csv-parser';
import xlsx from 'xlsx';



const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv({
                mapHeaders: ({ header }) => header.trim().replace(/^\uFEFF/, ''), // 🧼 Clean headers
                skipLines: 0,
                strict: false,
              }))
            .on('data', (row) => {
                const cleanedRow = {};
                Object.entries(row).forEach(([key, value]) => {
                    if (key?.trim()) {
                      cleanedRow[key.trim()] = value?.trim?.(); // Clean values too
                    }
                  });
                // for (let key in row){
                //     const cleanKey = key.trim().replace(/^\uFEFF/, ''); // remove BOM and trim
                //     cleanedRow[cleanKey] = row[key];
                // }
                if (Object.keys(cleanedRow).length > 0) {
                    results.push(cleanedRow);
                  }
                //results.push(cleanedRow);
            })
            .on('end', () => {
                //console.log("Example parsed row:", results[0]); // 🔍 Debug: See cleaned output
                resolve(results);
            })
            .on('error', (err) => reject(err));
    });
};


const parseExcel = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
};


export {
    parseCSV,
    parseExcel
}