"use client";

import React, { FC, useEffect, useState } from "react";
import FileUploader from '@/components/common/FileUploader';
import PageFlexWrapper from '@/components/common/PageFlexWrapper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import UploadedFileList from "@/components/common/UploadedFileList";
import UploadedFileListItem from "@/components/common/UploadedFileListItem";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { usePreFileUploadMutation, useUploadFileMutation } from "@/redux/services/fileTransferApi";
import JSZip from "jszip";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import UploadingInProgressUI from "@/components/common/UploadingInProgressUI";
import { setFileUploadingStatus, setUploadedFileCustomeUrl } from "@/redux/features/fileTransferSlice";
import { v4 as uuidv4 } from 'uuid';
import { getFileExtension, getFileNameWithoutExtension } from "@/lib/client/utils";
import UploadCompleteUI from "@/components/common/UploadCompleteUI";
import { isNull } from "lodash";

export enum UploadStatus {
    NOT_STARTED = "Not Started",
    IN_PROGRESS = "In Progress",
    DONE = "Done",
    FAILED = "Failed"
}

interface PageProps { }

const Page: FC<PageProps> = () => {
    // Suyog: Define state variables
    const [allFiles, setAllFiles] = useState<File[]>([]);
    const [filesMainUploader, setFilesMainUploader] = useState<File[]>([]);
    const [preUploadMutation, { isLoading, isSuccess }] = usePreFileUploadMutation();
    const [preSuccessUrl, setPreSuccessUrl] = useState<string | null>("")
    const [transferName, setTransferName] = useState<string>(""); // Ensuring transferName is a string
    const [uploadFile] = useUploadFileMutation();
    const dispatch = useDispatch();
    const { liveUploadProgressPercent, fileUploadStatus, uploadedFileCustomUrl } = useSelector((state: RootState) => state.fileTransfer);
    console.log(preSuccessUrl)
    // Suyog: Update allFiles state when filesMainUploader changes
    useEffect(() => {
        // Suyog: Combine files from all sources
        const combinedFiles: File[] = [...allFiles, ...filesMainUploader];
        // Suyog: Filter out duplicate files
        const uniqueFiles = Array.from(new Set(combinedFiles.map(file => file.name))).map(name => combinedFiles.find(file => file.name === name));
        setAllFiles(uniqueFiles.filter(file => file) as File[]); // Suyog: Filtering out possible undefined values and casting back to File[]
    }, [filesMainUploader]);

    // Suyog: Set transferName based on uploaded files
    useEffect(() => {
        // Suyog: Set transferName based on the first file name (excluding extension)
        if (allFiles.length !== 0) {
            const fileNameWithoutExtension: string = getFileNameWithoutExtension(allFiles[0]?.name || "");
            setTransferName(fileNameWithoutExtension);
        } else {
            setTransferName("");
        }
    }, [allFiles]);

    // Suyog: Remove a file from allFiles state by its name
    const handleRemoveFile = async (fileName: string): Promise<void> => {
        const filteredFiles: File[] = allFiles.filter((file: File) => file.name !== fileName);
        setAllFiles(filteredFiles);
    };

    // Suyog: Generate transfer link based on the number of files
    const handleGenerateTransferLink = async (): Promise<void> => {
        dispatch(setFileUploadingStatus(UploadStatus.IN_PROGRESS));
        const uniqueId: string = uuidv4();
        const timeStamp: string = new Date().toISOString().replace(/\D/g, '');
        let uniqAwsId: string = `${uniqueId}-${timeStamp}`;
        let transferNameWithUnderscores: string = transferName.replace(/\s+/g, '_'); 
        uniqAwsId = `${uniqueId}-${timeStamp}--${transferNameWithUnderscores}`;

        try {
            if (allFiles.length === 1) {
                // Suyog: If only one file, directly upload it
                const fileExtension: string = getFileExtension(allFiles[0].name);
                const result: any = await preUploadMutation({ fileKey: `${uniqAwsId}.${fileExtension}`, contentType: allFiles[0].type }).unwrap();
                if (result) {
                    uploadFile({ url: result.url, file: allFiles[0], fileSize: allFiles[0].size ,contentType:allFiles[0].type});
                    setPreSuccessUrl(`http://localhost:3000/download/${uniqAwsId}.${fileExtension}`)
                }
            } else if (allFiles.length > 1) {
                // Suyog: If multiple files, zip them and then upload the zip file
                const zip: JSZip = new JSZip();
                allFiles.forEach(file => {
                    zip.file(file.name, file);
                });
                const content: Blob = await zip.generateAsync({ type: 'blob' });
                const zipFile: File = new File([content], `${uniqAwsId}.zip`, { type: 'application/zip' });
                const result: any = await preUploadMutation({ fileKey: zipFile.name, contentType: zipFile.type }).unwrap();
                if (result) {
                    uploadFile({ url: result.url, file: zipFile, fileSize: zipFile.size,contentType:'application/zip'});
                    setPreSuccessUrl(`http://localhost:3000/download/${uniqAwsId}.zip`)
                }
            }
        } catch (error) {
            console.error("Error occurred during file upload:", error);
        }
    };

    // Suyog: Handle file upload progress completion
    useEffect(() => {
        if (fileUploadStatus === UploadStatus.DONE) {
            setTransferName("")
            dispatch(setUploadedFileCustomeUrl(preSuccessUrl))
        } else if (fileUploadStatus === UploadStatus.FAILED) {
            dispatch(setUploadedFileCustomeUrl(null))
            dispatch(setFileUploadingStatus(UploadStatus.NOT_STARTED))
            setPreSuccessUrl(null)
        }
    }, [fileUploadStatus]);

    return (
        <PageFlexWrapper>
            <div className="w-[460px] h-[680px] bg-[#111827] rounded-md">
                <div className="h-[calc(100%-68px)] overflow-auto">
                    {
                        fileUploadStatus === UploadStatus.NOT_STARTED &&
                        (<>
                            {allFiles.length === 0 ? (
                                // Suyog: Render FileUploader component if no files uploaded
                                <FileUploader onFileUpload={setFilesMainUploader} />
                            ) : (
                                <div className="w-full min-h-[200px] px-5 py-4 flex flex-col justify-between">
                                    <UploadedFileList className="flex items-start gap-2 flex-col">
                                        {allFiles?.map((file: File, index: number) => (
                                            // Suyog: Render UploadedFileListItem for each file
                                            <UploadedFileListItem handleRemoveFile={handleRemoveFile} file={file} key={index} />
                                        ))}
                                    </UploadedFileList>
                                    <div className="mt-3">
                                        <input multiple onChange={(e) => setFilesMainUploader(Array.from(e.target.files as FileList))} id="add-more-files" type="file" className="hidden" />
                                        <label htmlFor="add-more-files" className="inline-flex items-center gap-2 cursor-pointer">
                                            <CirclePlus className="text-blue-700" />
                                            <h5 className="text-xs text-blue-700">Add More Files</h5>
                                        </label>
                                    </div>
                                </div>
                            )}
                            <Separator className='' />
                            <div className="">
                                <div className="px-5 py-4">
                                    <RadioGroup defaultValue="link" className='flex items-center gap-4'>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="link" id="link" />
                                            <Label className='text-xs text-gray-200' htmlFor="link">Get Transfer link</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="mail" className='peer' disabled id="main" />
                                            <Label className='text-xs text-gray-200' htmlFor="main">Transfer Via Mail</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <Separator className='' />
                                <div className="px-5 py-4">
                                    <div className="mb-3">
                                        <Label className='text-xs block mb-2 text-gray-200'>Transfer Name</Label>
                                        <Input className='' value={transferName} onChange={(e) => setTransferName(e.target.value)} />
                                    </div>
                                    <div className="">
                                        <Label className='text-xs block mb-2 text-gray-200'>Transfer Message</Label>
                                        <Textarea className='' />
                                    </div>
                                </div>
                                <Separator className='' />
                                <div className="px-5 py-4">
                                    <RadioGroup defaultValue="withoutPassword" className='flex items-center gap-4'>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="withPassword" id="withPassword" />
                                            <Label className='text-xs text-gray-200' htmlFor="withPassword">Transfer with password</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="withoutPassword" id="withoutPassword" />
                                            <Label className='text-xs text-gray-200' htmlFor="withoutPassword">Transfer without password</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <Separator className='' />
                                <div className="px-5 py-4">
                                    <div className="">
                                        <Label className='text-xs block mb-2'>Transfer Password</Label>
                                        {/* @ts-ignore */}
                                        <Input className='' type='password' autoComplete="new-password" />
                                    </div>
                                </div>
                            </div>
                        </>
                        )
                    }
                    {
                        fileUploadStatus === UploadStatus.IN_PROGRESS && <UploadingInProgressUI percentage={liveUploadProgressPercent} />
                    }
                    {
                        (fileUploadStatus === UploadStatus.DONE || !isNull(uploadedFileCustomUrl)) && <UploadCompleteUI url={uploadedFileCustomUrl} />
                    }
                </div>
                <Separator className='' />
                <div className="footer px-5 py-4 flex items-center justify-center">
                    {
                        fileUploadStatus === UploadStatus.NOT_STARTED && <Button size={"sm"} disabled={allFiles.length === 0} onClick={handleGenerateTransferLink} className="w-full">
                            Get Transfer Link
                        </Button>
                    }
                    {
                        fileUploadStatus === UploadStatus.IN_PROGRESS && <Button size={"sm"} disabled={allFiles.length === 0} className="w-full">
                            Cancel
                        </Button>
                    }
                    {
                        fileUploadStatus === UploadStatus.DONE && <Button size={"sm"} disabled={allFiles.length === 0} className="w-full">
                            Copy
                        </Button>
                    }
                </div>
            </div>
        </PageFlexWrapper>
    );
};

export default Page;

