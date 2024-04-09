import { ReactNode } from "react";

export enum UploadStatus {
     NOT_STARTED = "Not Started",
     IN_PROGRESS = "In Progress",
     DONE = "Done"
 }
 
export interface CommonComponentProps {
     children?: ReactNode
     className?: string
}

