"use client";

import PageFlexWrapper from '@/components/common/PageFlexWrapper'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useLazyDownloadFileQuery, usePreFileDownloadMutation } from '@/redux/services/fileTransferApi';
import { CircleCheckBig, CloudDownload } from 'lucide-react'
import { FC, useEffect, useState } from 'react'

interface pageProps {
  params: {
    slug: string
  }
}

const Page: FC<pageProps> = ({ params }) => {
  const { slug } = params
  const [preDownloadMutation] = usePreFileDownloadMutation()
  const [getDownloadedFile, downloadedFile,] = useLazyDownloadFileQuery();
  const [fileUrl, setFileUrl] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDownloadFile = async () => {
    setIsLoading(true)
    try {
      const result: any = await preDownloadMutation({ fileKey: slug });
      if (result) {
       getDownloadedFile({ url: result.data.url }).then((data)=>{
        setIsLoading(!data.isSuccess)
       })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleDownloadFile()
  }, [slug])

  useEffect(() => {
    if (downloadedFile.data) {
      const blob = new Blob([downloadedFile.data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      setFileUrl(url);
    }
  }, [downloadedFile.data]);

  const handleDownloadButtonClick = () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `downloaded_file.${slug}`; 
      link.click();
    }
  }

  return (
    <PageFlexWrapper>
      <div className="w-[460px] h-[680px] bg-[#111827] rounded-md">
        <div className="h-[calc(100%-68px)] overflow-auto">
          <div className="h-full flex items-center justify-center">
            <div className="flex items-center justify-center flex-col gap-3">
              <div className="mx-auto text-center flex items-center justify-center flex-col">
                <div className="mb-3">
                  <CloudDownload className='w-20 h-20 text-blue-700' />
                </div>
                <h4 className='text-xl font-semibold text-gray-200 mb-3'>Ready when you are</h4>
                <p className='text-sm font-500 text-gray-500'>Transfer expires in 1 days</p>
              </div>
            </div>
          </div>
        </div>
        <Separator className='' />
        <div className="footer px-5 py-4 flex items-center justify-center">
          <Button size={"sm"} disabled={isLoading} className="w-full" onClick={handleDownloadButtonClick}>
            Download
          </Button>
        </div>
      </div>
    </PageFlexWrapper>
  )
}

export default Page;
