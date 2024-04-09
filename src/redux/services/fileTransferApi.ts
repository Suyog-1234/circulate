// fileTransferApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import { setFileUploadingStatus, updateLiveProgress } from '../features/fileTransferSlice';
export enum UploadStatus {
    NOT_STARTED = "Not Started",
    IN_PROGRESS = "In Progress",
    DONE = "Done",
    FAILED = "Failed"
}
// Define a service using a base URL and expected endpoints
export const fileTransferApi = createApi({
    reducerPath: 'fileTransferApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
    endpoints: (builder) => ({
        preFileUpload: builder.mutation<any, any>({
            query: (obj) => ({
                url: `pre-upload`,
                method: 'POST',
                body: obj,
            }),
        }),
        preFileDownload: builder.mutation<any, any>({
            query: (obj) => ({
                url: `pre-download`,
                method: 'POST',
                body: obj,
            }),
        }),
        uploadFile: builder.mutation<any, { url: string, file: File, fileSize: number,contentType:string}>({
            queryFn: async ({ url, file,contentType}, { dispatch }) => {
                try {
                    const response = await axios.put(url, file, {
                        headers:{
                          "Content-Type":contentType
                        },
                        onUploadProgress: (progressEvent) => {
                            const uploadedPercentage = (progressEvent.loaded / file.size) * 100;
                            dispatch(updateLiveProgress(Math.floor(uploadedPercentage)));
                        }
                    })
                    if (response.status === 200) {
                        dispatch(setFileUploadingStatus(UploadStatus.DONE));
                    }
                    return response.data
                } catch (error: any) {
                    console.log(error, "error")
                    dispatch(setFileUploadingStatus(UploadStatus.FAILED));
                }
            },
        }),
        downloadFile: builder.query<ArrayBuffer, { url: string}>({
            query:({ url})=>({
                 url:url,
                 method:"GET",
                 responseHandler: (response) => response.arrayBuffer(),
            }),
        }),
    }),
});

export const { usePreFileUploadMutation, usePreFileDownloadMutation, useUploadFileMutation,useLazyDownloadFileQuery} = fileTransferApi; // Export useUploadFileMutation here
