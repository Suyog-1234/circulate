import { CommonComponentProps } from '@/types/common'
import { FC, Fragment } from 'react'

interface PageFlexWrapperProps extends CommonComponentProps{
  
}

const PageFlexWrapper: FC<PageFlexWrapperProps> = ({children}) => {
  return (
      <section className='p-10 w-full min-h-screen flex items-center justify-center'>
           {children}
      </section>
  )
}

export default PageFlexWrapper