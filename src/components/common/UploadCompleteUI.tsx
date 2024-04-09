import { url } from 'inspector'
import { FC } from 'react'
import { Input } from '../ui/input'
import { CircleCheckBig } from 'lucide-react'

interface UploadCompleteUIProps {
    url: string | null
}

const UploadCompleteUI: FC<UploadCompleteUIProps> = ({ url }) => {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="flex items-center justify-center flex-col gap-3">
                <div className="max-w-[60%] mx-auto text-center flex items-center justify-center flex-col">
                    <div className="mb-3">
                        <CircleCheckBig className='w-20 h-20 text-blue-700'/>
                    </div>
                    <h4 className='text-xl font-semibold text-gray-200 mb-3'>Done</h4>
                    <p className='text-sm font-500 text-gray-500'>Copy Below Url And Send In Order To Download File</p>
                </div>
                <Input type="text" className='text-ellipsis'  value={url as string} />
            </div>
        </div>
    )
}

export default UploadCompleteUI