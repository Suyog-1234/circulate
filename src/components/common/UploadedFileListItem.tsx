import { cn } from '@/lib/utils'
import { CommonComponentProps } from '@/types/common'
import { File, X } from 'lucide-react'
import { FC } from 'react'

interface UploadedFileListItemProps extends CommonComponentProps{
    file:File,
    handleRemoveFile:(fileName:string)=>void
}

const UploadedFileListItem: FC<UploadedFileListItemProps> = ({className,file,handleRemoveFile}) => {
    const {name,size,type} = file
  return (
     <li className={cn('p-2 bg-dark-700 rounded-sm w-full',className)}>
         <div className="flex items-center gap-2">
              <span className='flex-shrink-0'><File className='text-blue-700 w-8 h-8'/></span>
              <div className="leading-[1] flex-grow">
                 <h5 className='text-xs text-gray-200 mb-0'>{name}</h5>
                 <span className='text-[10px] text-gray-500'>45kb</span>
              </div>
              <button onClick={()=>handleRemoveFile(file.name)} className='w-5 h-5 rounded-full flex-shrink-0 border-gray-500 border flex items-center justify-center'>
                 <X className='w-3 h-3 text-white'/>
              </button>
         </div>
     </li>
  )
}

export default UploadedFileListItem