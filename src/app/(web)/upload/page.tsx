"use client"
import { FC } from 'react'

interface pageProps {

}

const page: FC<pageProps> = ({ }) => {
    const handleChange = (e:any) => {
       console.log(e.target.files)
    }
    return (
        <div>
            <input type="file" multiple onChange={handleChange} />
        </div>
    )
}

export default page