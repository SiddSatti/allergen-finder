
import React, { useState, useRef } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { CsvData } from '@/types';
import { toast } from 'sonner';

interface CsvUploaderProps {
  onUpload: (data: CsvData[]) => void;
}

const CsvUploader: React.FC<CsvUploaderProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processCsvFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        
        // Expected format: ,Name,Location,Sub_Location,Time,Longitude,Latitude,Allergens,Full_Ingredients,Embedding,Price
        // The first column might be an index, so we'll ignore it
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
          toast.error('CSV file format is incorrect. Please use the required format.');
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
        
        setFileName(file.name);
        setIsUploaded(true);
        onUpload(data);
        toast.success('CSV file successfully uploaded');
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast.error('Failed to parse CSV file. Please check the format.');
      }
    };
    
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'text/csv') {
        toast.error('Please upload a CSV file');
        return;
      }
      processCsvFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'text/csv') {
        toast.error('Please upload a CSV file');
        return;
      }
      processCsvFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="my-4">
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragging ? 'border-bytewise-blue bg-bytewise-lightgray' : 'border-gray-300'
        } ${isUploaded ? 'bg-green-50 border-green-300' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          {isUploaded ? (
            <>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-sm font-medium text-gray-700">{fileName}</p>
              <p className="text-xs text-gray-500">Click to upload a different file</p>
            </>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-500" />
              </div>
              <p className="text-sm font-medium">Upload CSV file</p>
              <p className="text-xs text-gray-500">Drag and drop or click to browse</p>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 flex items-start space-x-2">
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          CSV format must match: ,Name,Location,Sub_Location,Time,Longitude,Latitude,Allergens,Full_Ingredients,Embedding,Price
        </p>
      </div>
    </div>
  );
};

export default CsvUploader;
