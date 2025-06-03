
// Utility to parse Excel files
export interface ExcelRowData {
  storeName: string;
  city: string;
  region: string;
  totalTarget: number;
  totalAchievement: number;
  qualified: boolean;
  totalIncentiveEarned: number;
}

export const parseExcelFile = (file: File): Promise<ExcelRowData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        
        // Skip header row
        const dataLines = lines.slice(1).filter(line => line.trim());
        
        const parsedData: ExcelRowData[] = dataLines.map(line => {
          const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
          
          return {
            storeName: columns[0] || '',
            city: columns[1] || '',
            region: columns[2] || '',
            totalTarget: parseInt(columns[3]) || 0,
            totalAchievement: parseInt(columns[4]) || 0,
            qualified: columns[5]?.toLowerCase() === 'qualified',
            totalIncentiveEarned: parseInt(columns[6]) || 0,
          };
        }).filter(row => row.storeName); // Filter out empty rows
        
        resolve(parsedData);
      } catch (error) {
        reject(new Error('Failed to parse file. Please ensure it matches the template format.'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
