import React, { useState, useRef } from 'react';
import { Upload, FileCode, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface UploadCardProps {
  onUploadSuccess: (file: File) => void;
  onUploadReset?: () => void;
}

export const UploadCard: React.FC<UploadCardProps> = ({ onUploadSuccess, onUploadReset }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const simulateUpload = (file: File) => {
    setFileName(file.name);
    setErrorMessage('');
    
    // Validate file type
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'zip') {
      setUploadStatus('error');
      setErrorMessage('Unsupported file format. Please upload a valid .zip codebase archive.');
      return;
    }

    setUploadStatus('uploading');
    setProgress(0);
    
    let prog = 0;
    const interval = setInterval(async () => {
      prog += 25;
      setProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        try {
          await onUploadSuccess(file);
          setUploadStatus('success');
        } catch (err: any) {
          console.error('[UploadCard handler error]', err);
          setUploadStatus('error');
          setErrorMessage(err.message || 'Failed to extract or parse the uploaded archive.');
        }
      }
    }, 80);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      simulateUpload(file);
    }
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setFileName('');
    setErrorMessage('');
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onUploadReset) onUploadReset();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".zip"
        onChange={handleFileChange}
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative w-full rounded border-2 border-dashed transition-all duration-200 p-8 flex flex-col items-center justify-center min-h-[220px] cursor-pointer ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : uploadStatus === 'success'
            ? 'border-emerald-600/50 bg-emerald-950/5'
            : uploadStatus === 'error'
            ? 'border-red-650/50 bg-red-950/5 hover:border-red-600/80'
            : 'border-border bg-surface hover:border-zinc-700'
        }`}
        onClick={() => uploadStatus === 'idle' && fileInputRef.current?.click()}
      >
        {uploadStatus === 'idle' && (
          <div className="text-center flex flex-col items-center">
            <div className="h-10 w-10 rounded bg-black border border-border flex items-center justify-center mb-3 text-zinc-400">
              <Upload className="h-5 w-5" />
            </div>
            <h3 className="text-white font-semibold mb-1 text-sm">
              Upload repository archive
            </h3>
            <p className="text-zinc-400 text-xs mb-3 max-w-sm">
              Your source code is analyzed locally. We only compile zero-knowledge proofs.
            </p>
            <Button variant="secondary" size="sm">
              Select Archive
            </Button>
          </div>
        )}

        {uploadStatus === 'uploading' && (
          <div className="w-full max-w-sm text-center">
            <FileCode className="h-8 w-8 text-primary mx-auto mb-3 animate-pulse" />
            <h4 className="text-white font-medium text-xs mb-1 truncate">{fileName}</h4>
            <div className="w-full bg-black h-1.5 rounded-sm overflow-hidden border border-border mb-2">
              <div
                className="bg-primary h-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-zinc-400">{progress}%</span>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="text-center flex flex-col items-center">
            <CheckCircle className="h-10 w-10 text-emerald-500 mb-2" />
            <h3 className="text-white font-semibold mb-1 text-sm">
              Repository Encrypted & Loaded
            </h3>
            <p className="text-zinc-400 text-[11px] mb-3 truncate max-w-sm font-mono">
              {fileName}
            </p>
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              resetUpload();
            }}>
              Remove Archive
            </Button>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="text-center flex flex-col items-center p-2 max-w-md">
            <AlertCircle className="h-10 w-10 text-danger mb-2" />
            <h3 className="text-white font-semibold mb-1 text-sm">Parsing Failed</h3>
            <p className="text-zinc-450 text-[11px] mb-4 leading-relaxed font-semibold">
              {errorMessage || 'Failed to extract or parse the uploaded archive.'}
            </p>
            <Button variant="secondary" size="sm" onClick={(e) => {
              e.stopPropagation();
              resetUpload();
            }}>
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
