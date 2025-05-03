from fastapi import APIRouter, UploadFile, File
import os
from tempfile import NamedTemporaryFile
from utils.cloudinary import upload_image_to_cloudinary

router = APIRouter()

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Simpan sementara
        suffix = os.path.splitext(file.filename)[1]
        with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Upload ke Cloudinary
        cloudinary_url = upload_image_to_cloudinary(tmp_path)

        # Hapus file lokal
        os.remove(tmp_path)

        if cloudinary_url:
            return {"success": True, "url": cloudinary_url}
        else:
            return {"success": False, "message": "Failed to upload to Cloudinary."}
    except Exception as e:
        return {"success": False, "message": str(e)}
