/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useCallback } from 'react';
import UploadCloudIcon from './icons/UploadCloudIcon';
import CarIcon from './icons/CarIcon';
import WashingMachineIcon from './icons/WashingMachineIcon';
import Spinner from './Spinner';
import TrashIcon from './icons/TrashIcon';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (files: File[]) => void;
}

const sampleDocuments = [
    {
        name: 'Hyundai i10 Manual',
        url: 'https://www.hyundai.com/content/dam/hyundai/in/en/data/connect-to-service/owners-manual/2025/i20&i20nlineFromOct2023-Present.pdf',
        icon: <CarIcon />,
        fileName: 'hyundai-i10-manual.pdf'
    },
    {
        name: 'LG Washer Manual',
        url: 'https://www.lg.com/us/support/products/documents/WM2077CW.pdf',
        icon: <WashingMachineIcon />,
        fileName: 'lg-washer-manual.pdf'
    }
];

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [loadingSample, setLoadingSample] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(prev => [...prev, ...Array.from(event.target.files!)]);
        }
    };
    
    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        if (event.dataTransfer.files) {
            setFiles(prev => [...prev, ...Array.from(event.dataTransfer.files)]);
        }
    }, []);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    }, []);
    
    const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleSelectSample = async (name: string, url: string, fileName: string) => {
        if (loadingSample) return;
        setLoadingSample(name);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${name}: ${response.statusText}`);
            }
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: blob.type });
            setFiles(prev => [...prev, file]);
        } catch (error) {
            console.error("Error fetching sample file:", error);
            alert(`Could not fetch the sample document. This might be due to CORS policy. Please try uploading a local file.`);
        } finally {
            setLoadingSample(null);
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleConfirmUpload = () => {
        onUpload(files);
        handleClose();
    };

    const handleClose = () => {
        setFiles([]);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="upload-title" onClick={handleClose}>
            <div className="bg-gem-slate p-8 rounded-lg shadow-xl w-full max-w-2xl text-gem-offwhite" onClick={e => e.stopPropagation()}>
                <h2 id="upload-title" className="text-2xl font-bold mb-4">Upload Documents</h2>
                
                <div 
                    className={`relative border-2 border-dashed rounded-lg p-10 text-center transition-colors mb-6 ${isDragging ? 'border-gem-blue bg-gem-mist/10' : 'border-gem-mist/50'}`}
                    onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                >
                    <div className="flex flex-col items-center justify-center">
                        <UploadCloudIcon />
                        <p className="mt-4 text-lg text-gem-offwhite/80">Drag & drop files here</p>
                        <input id="modal-file-upload" type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.txt,.md"/>
                        <label htmlFor="modal-file-upload" className="mt-4 cursor-pointer px-6 py-2 bg-gem-blue text-white rounded-full font-semibold hover:bg-blue-500 transition-colors">
                            Or Browse Files
                        </label>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="mb-4 text-left">
                        <h4 className="font-semibold mb-2">Selected ({files.length}):</h4>
                        <ul className="max-h-32 overflow-y-auto space-y-1 pr-2">
                           {files.map((file, index) => (
                                <li key={`${file.name}-${index}`} className="text-sm bg-gem-mist/50 p-2 rounded-md flex justify-between items-center group">
                                    <span className="truncate" title={file.name}>{file.name}</span>
                                    <button onClick={() => handleRemoveFile(index)} className="ml-2 p-1 text-red-400 hover:text-red-300 rounded-full opacity-0 group-hover:opacity-100" aria-label={`Remove ${file.name}`}>
                                        <TrashIcon />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gem-mist"></div>
                    <span className="flex-shrink mx-4 text-gem-offwhite/60">OR TRY AN EXAMPLE</span>
                    <div className="flex-grow border-t border-gem-mist"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sampleDocuments.map(doc => (
                        <button
                            key={doc.name}
                            onClick={() => handleSelectSample(doc.name, doc.url, doc.fileName)}
                            disabled={!!loadingSample}
                            className="bg-gem-onyx p-4 rounded-lg border border-gem-mist/30 hover:border-gem-blue/50 flex items-center space-x-4 disabled:opacity-50 text-left"
                        >
                            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-gem-mist/20 rounded-lg">
                                {loadingSample === doc.name ? <Spinner /> : doc.icon}
                            </div>
                            <div>
                                <p className="font-semibold text-gem-offwhite">{doc.name}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={handleClose} className="px-6 py-2 rounded-md bg-gem-mist hover:bg-gem-mist/70 text-gem-offwhite">Cancel</button>
                    <button onClick={handleConfirmUpload} disabled={files.length === 0} className="px-6 py-2 rounded-md bg-gem-blue hover:bg-blue-500 text-white disabled:bg-gem-mist/50">Upload</button>
                </div>
            </div>
        </div>
    );
}

export default UploadModal;