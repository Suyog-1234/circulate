import { cn } from '@/lib/utils'
import { CommonComponentProps } from '@/types/common'
import { FC } from 'react'

interface UploadedFileListProps extends CommonComponentProps{
  
}

const UploadedFileList: FC<UploadedFileListProps> = ({children,className}) => {
  return (
     <ul className={cn("p-0",className)}>
        {children}
     </ul>
  )
}

export default UploadedFileList