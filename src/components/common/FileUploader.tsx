import React, { FC, useCallback } from 'react';
import { useDropzone, DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import IconCloudUpload from '../svg/IconCloudUpload';

interface FileUploaderProps {
  onFileUpload: (file: File[]) => void;
}

const FileUploader: FC<FileUploaderProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the file
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles);
    }
  }, [onFileUpload]);

  const {getRootProps, getInputProps,isDragActive}: {
    getRootProps: () => DropzoneRootProps;
    getInputProps: () => DropzoneInputProps;
    isDragActive:boolean
  } = useDropzone({ onDrop, });

  return (
    <div className={`w-full h-[200px] cursor-pointer border-dashed flex items-center justify-center group ${isDragActive && "dropping"}`} {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="flex items-center flex-col gap-2">
        <IconCloudUpload className='w-12 h-12 text-white transition-all duration-500 ease-in group-[.dropping]:text-[#00fff5]' />
        <h4 className='text-white text-xs font-500'>Upload File Here</h4>
      </div>
    </div>
  );
};

export default FileUploader;
