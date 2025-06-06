
import * as XLSX from 'xlsx';

export interface ExcelRowData {
  storeCode: string;
  storeName: string;
  city: string;
  region: string;
  clusterName: string; // Added this field
  totalTarget: number;
  totalAchievement: number;
  qualified: boolean;
  totalPointsEarned: number;
}

export const parseExcelFile = (file: File): Promise<ExcelRowData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let parsedData: ExcelRowData[] = [];

        if (file.name.endsWith('.csv')) {
          // Parse CSV file
          const text = data as string;
          const lines = text.split('\n');
          
          // Skip header row
          const dataLines = lines.slice(1).filter(line => line.trim());
          
          parsedData = dataLines.map(line => {
            const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
            
            return {
              storeCode: columns[0] || '',
              storeName: columns[1] || '',
              city: columns[2] || '',
              region: columns[3] || '',
              clusterName: columns[4] || '', // Added this field
              totalTarget: parseInt(columns[5]) || 0,
              totalAchievement: parseInt(columns[6]) || 0,
              qualified: columns[7]?.toLowerCase() === 'qualified',
              totalPointsEarned: parseInt(columns[8]) || 0,
            };
          }).filter(row => row.storeCode && row.storeName);
        } else {
          // Parse Excel file
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Skip header row and process data
          const dataRows = jsonData.slice(1) as any[][];
          
          parsedData = dataRows
            .filter(row => row && row.length > 0 && row[0] && row[1]) // Filter out empty rows
            .map(row => ({
              storeCode: String(row[0] || ''),
              storeName: String(row[1] || ''),
              city: String(row[2] || ''),
              region: String(row[3] || ''),
              clusterName: String(row[4] || ''), // Added this field
              totalTarget: parseInt(String(row[5])) || 0,
              totalAchievement: parseInt(String(row[6])) || 0,
              qualified: String(row[7] || '').toLowerCase() === 'qualified',
              totalPointsEarned: parseInt(String(row[8])) || 0,
            }))
            .filter(row => row.storeCode && row.storeName);
        }
        
        console.log('Parsed data:', parsedData);
        resolve(parsedData);
      } catch (error) {
        console.error('Parsing error:', error);
        reject(new Error('Failed to parse file. Please ensure it matches the template format.'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    // Read file based on type
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};
