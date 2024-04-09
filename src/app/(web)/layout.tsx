import PageWrapper from '@/components/common/PageFlexWrapper'
import { CommonComponentProps } from '@/types/common'
import { FC, Fragment } from 'react'

interface layoutProps extends CommonComponentProps {

}

const page: FC<layoutProps> = ({ children }) => {
    return (
        <Fragment>
            <main className='min-h-screen bg-[#020617]'>
                <div className='page-wrapper'>
                    {children}
                </div>
            </main>
        </Fragment>
    )
}

export default page