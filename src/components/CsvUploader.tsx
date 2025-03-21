
import React, { useState, useRef } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { CsvData } from '@/types';
import { toast } from '@/components/ui/sonner';

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
        const headers = lines[0].split(',').map(header => header.trim());
        
        const requiredHeaders = ['id', 'name', 'price', 'distance', 'waitTime', 'ingredients', 'location', 'restrictions'];
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
        
        if (missingHeaders.length > 0) {
          toast.error(`CSV is missing required headers: ${missingHeaders.join(', ')}`);
          return;
        }
        
        const data: CsvData[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;
          
          const values = lines[i].split(',').map(value => value.trim());
          const row: Record<string, string> = {};
          
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          
          data.push(row as unknown as CsvData);
        }
        
        setFileName(file.name);
        setIsUploaded(true);
        onUpload(data);
        toast.success('CSV file successfully uploaded');
      } catch (error) {
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
          CSV file must include: id, name, price, distance, waitTime, ingredients (comma separated within quotes), 
          location, and restrictions (comma separated within quotes).
        </p>
      </div>
    </div>
  );
};

export default CsvUploader;
