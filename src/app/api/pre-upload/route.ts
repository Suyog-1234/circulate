import { s3 } from "@/lib/server/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
   try {
      const { fileKey, fileSize, contentType} = await req.json();
      const preSignedUrlBuildCommand = new PutObjectCommand({
          Bucket:"circulate-dev-new",
          Key:`upload/${fileKey}`,
          ContentType:contentType
      })
      const preSignedUrl = await getSignedUrl(s3,preSignedUrlBuildCommand);
      return NextResponse.json({url:preSignedUrl},{status:201})
   } catch (error) {
      return NextResponse.json({ message: "internal server error" ,error:error}, { status: 501 });
   }
} 