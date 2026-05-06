const xlsx = require('xlsx');
const path = require('path');

const filePath = path.resolve('P:/LMS/AI&DS STUDENT DETAILS.xlsx');
try {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);
  console.log('Total rows:', data.length);
  if (data.length > 0) {
    console.log('Headers:', Object.keys(data[0]));
    console.log('Sample row:', data[0]);
  }
} catch (e) {
  console.error('Error reading excel:', e.message);
}
