
import React, { useState } from 'react';
import { CsvData } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CsvPasteInputProps {
  onParsed: (data: CsvData[]) => void;
}

const CsvPasteInput: React.FC<CsvPasteInputProps> = ({ onParsed }) => {
  const [csvText, setCsvText] = useState<string>('');
  const [isParsed, setIsParsed] = useState(false);

  const handleCsvPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvText(e.target.value);
    setIsParsed(false);
  };

  const processCsvText = () => {
    try {
      if (!csvText.trim()) {
        toast.error('Please paste some CSV data first');
        return;
      }

      const lines = csvText.trim().split('\n');
      
      // Expected format: ,Name,Location,Sub_Location,Time,Longitude,Latitude,Allergens,Full_Ingredients,Embedding,Price
      const expectedHeaders = ['Name', 'Location', 'Sub_Location', 'Time', 'Longitude', 'Latitude', 'Allergens', 'Full_Ingredients', 'Embedding', 'Price'];
      
      // Verify if the header matches expected format (ignoring first column if it's empty)
      const headerLine = lines[0];
      const headerParts = headerLine.split(',');
      
      // Check if the file has the correct headers, accounting for the potential first empty column
      const startIndex = headerParts[0].trim() === '' ? 1 : 0;
      
      const headerCheck = expectedHeaders.every((header, index) => {
        const fileHeader = headerParts[index + startIndex]?.trim();
        return fileHeader === header;
      });
      
      if (!headerCheck) {
        toast.error('CSV format is incorrect. Please use the required format.');
        return;
      }
      
      const data: CsvData[] = [];
      
      // Start from line 1 (skip header)
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        // Split by comma, but respect quotes
        let values: string[] = [];
        let currentValue = '';
        let inQuotes = false;
        
        for (let j = 0; j < lines[i].length; j++) {
          const char = lines[i][j];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        
        // Add the last value
        values.push(currentValue.trim());
        
        // If the first value is an index or empty, skip it
        const startIndex = values[0].trim() === '' || !isNaN(Number(values[0])) ? 1 : 0;
        
        // Create row object
        const row: Record<string, string> = {};
        
        expectedHeaders.forEach((header, index) => {
          if (index + startIndex < values.length) {
            row[header] = values[index + startIndex];
          } else {
            row[header] = '';
          }
        });
        
        data.push(row as unknown as CsvData);
      }
      
      setIsParsed(true);
      onParsed(data);
      toast.success('CSV data successfully parsed');
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Failed to parse CSV data. Please check the format.');
    }
  };

  return (
    <div className="my-4 space-y-4">
      <div className={`border-2 rounded-lg p-4 transition-all duration-300 ${
        isParsed ? 'bg-green-50 border-green-300' : 'border-gray-300'
      }`}>
        <div className="flex items-center mb-2">
          {isParsed ? (
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
              <Check className="h-5 w-5 text-green-500" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
              <FileText className="h-5 w-5 text-gray-500" />
            </div>
          )}
          <h3 className="text-lg font-medium">
            {isParsed ? 'CSV Data Parsed Successfully' : 'Paste CSV Data'}
          </h3>
        </div>
        
        <Textarea
          value={csvText}
          onChange={handleCsvPaste}
          placeholder="Paste your CSV data here..."
          className="min-h-[200px] font-mono text-sm"
        />
        
        <Button 
          onClick={processCsvText} 
          className="mt-4 w-full"
          variant={isParsed ? "outline" : "default"}
        >
          {isParsed ? "Parse Again" : "Parse CSV Data"}
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 flex items-start space-x-2">
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          CSV format must match: ,Name,Location,Sub_Location,Time,Longitude,Latitude,Allergens,Full_Ingredients,Embedding,Price
        </p>
      </div>
    </div>
  );
};

export default CsvPasteInput;
