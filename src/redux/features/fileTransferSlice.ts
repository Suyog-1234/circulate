import { createSlice } from "@reduxjs/toolkit";

export enum UploadStatus {
    NOT_STARTED = "Not Started",
    IN_PROGRESS = "In Progress",
    DONE = "Done",
    FAILED="Failed"
}

const initialState = {
     liveUploadProgressPercent:null,
     fileUploadStatus:UploadStatus.NOT_STARTED,
     uploadedFileCustomUrl:null
}
const fileTransferSlice = createSlice({
     name:"filetransfer",
     initialState,
     reducers:{
         updateLiveProgress:(state,action)=>{
            state.liveUploadProgressPercent = action.payload
         },
         setFileUploadingStatus:(state,action)=>{
             state.fileUploadStatus = action.payload
         },
         setUploadedFileCustomeUrl:(state,action)=>{
            state.uploadedFileCustomUrl = action.payload
        },
     }
})
export const {updateLiveProgress,setFileUploadingStatus,setUploadedFileCustomeUrl} = fileTransferSlice.actions
export default fileTransferSlice.reducer