import { configureStore } from "@reduxjs/toolkit";
import { fileTransferApi } from "./services/fileTransferApi";
import fileTransferReducer from "./features/fileTransferSlice";

const store = configureStore({
     reducer:{
         fileTransfer:fileTransferReducer,
         [fileTransferApi.reducerPath]:fileTransferApi.reducer
     },
     devTools:true,
     middleware: (gDM) =>gDM().concat(fileTransferApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store