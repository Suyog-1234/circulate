import { s3 } from "@/lib/server/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
   try {
      const { fileKey, fileSize, contentType} = await req.json();
      if(fileSize > 30){
         return NextResponse.json({message:"file size should not be more than 10mb"},{status:401})
      }
      const preSignedUrlBuildCommand = new PutObjectCommand({
          Bucket:"circulate-bucket",
          Key:`upload/${fileKey}`,
          ContentType:'application/zip'
      })
      const preSignedUrl = await getSignedUrl(s3,preSignedUrlBuildCommand);
      return NextResponse.json({url:preSignedUrl},{status:201})
   } catch (error) {
      return NextResponse.json({ message: "internal server error" }, { status: 501 });
   }
} 