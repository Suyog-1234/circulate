import { CommonComponentProps } from '@/types/common'
import { FC, Fragment } from 'react'

interface layoutProps extends CommonComponentProps {

}

const page: FC<layoutProps> = ({ children }) => {
    return (
        <Fragment>
            <div>
                {children}
            </div>
        </Fragment>
    )
}

export default page