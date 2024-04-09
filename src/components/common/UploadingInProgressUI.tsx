import { FC } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

interface UploadingInProgressUIProps {
  percentage: number | null
}

const UploadingInProgressUI: FC<UploadingInProgressUIProps> = ({ percentage }) => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex items-center justify-center flex-col gap-3">
        <div className="w-20 h-20 mb-3">
          <CircularProgressbar styles={buildStyles({ pathColor: "#7693ef", textColor: "#7693ef" })} value={percentage ?? 0} text={`${percentage ?? 0}%`} />
        </div>
        <div className="max-w-[60%] mx-auto text-center">
          <h4 className='text-xl font-semibold text-gray-200 mb-3'>Transferring...</h4>
          <p className='text-sm font-500 text-gray-500'>Wrapping up...
            Do not close this window until we complete the transfer.</p>
        </div>
      </div>
    </div>
  )
}

export default UploadingInProgressUI