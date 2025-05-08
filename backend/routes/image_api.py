# 配置api，对于oss和本地
from fastapi import APIRouter, UploadFile, File, HTTPException, Response, Query
from fastapi.responses import FileResponse
from typing import Optional
import random

from storage import self_storage, oss_storage

router = APIRouter()


# 上传图片
@router.post("/upload")
async def upload_image(type: str = Query("self"), file: UploadFile = File(...)):
    if type == "self":
        result = self_storage.upload_image(file)
    elif type == "oss":
        result = oss_storage.upload_image(file)
    else:
        raise HTTPException(status_code=400, detail="Unsupported type.")
    return {
        "code": 200,
        "data": result,
        "message": "Image uploaded successfully."
    }


# 获取图片内容
@router.get("/image/{image_id}")
async def get_image(image_id: str, type: Optional[str] = Query("self")):
    if type == "self":
        path = self_storage.get_image_file(image_id)
        if not path:
            raise HTTPException(status_code=404, detail="Image not found.")
        return FileResponse(path, media_type="image/jpeg")
    elif type == "oss":
        url = oss_storage.get_image_url(image_id)
        if not url:
            raise HTTPException(status_code=404, detail="Image not found.")
        return Response(status_code=307, headers={"Location": url})
    else:
        raise HTTPException(status_code=400, detail="Unsupported type.")


# 删除图片
@router.delete("/image/{image_id}")
async def delete_image(image_id: str):
    success_self = self_storage.delete_image(image_id)
    success_oss = oss_storage.delete_image(image_id)
    if not (success_self or success_oss):
        raise HTTPException(status_code=404, detail="Image not found.")
    return {
        "code": 200,
        "message": "Image deleted successfully."
    }



# 批量拉取图片（性能测试）
@router.get("/batch-fetch/{type}")
async def batch_fetch(type: str):
    if type == "self":
        all_images = self_storage.list_images()
    elif type == "oss":
        all_images = oss_storage.list_images()
    else:
        raise HTTPException(status_code=400, detail="Unsupported type.")

    if not all_images:
        return {
            "code": 200,
            "data": {
                "success": [],
                "failed": []
            },
            "message": "No images available for batch fetch."
        }

    sample_size = min(10, len(all_images))
    #此行代码可决定随机fetch量，即min中的第一个参数

    sample = random.sample(all_images, sample_size)
    success = []
    failed = []

    for img in sample:
        if type == "self":
            path = self_storage.get_image_file(img["id"])
            if path:
                success.append(img)
            else:
                failed.append(img["id"])
        elif type == "oss":
            url = oss_storage.get_image_url(img["id"])
            if url:
                img["url"] = url
                success.append(img)
            else:
                failed.append(img["id"])

    return {
        "code": 200,
        "data": {
            "success": success,
            "failed": failed
        },
        "message": f"Batch fetched with {len(success)} success and {len(failed)} failed."
    }


# 获取所有图片列表
@router.get("/images")
async def list_all_images(type: str):
    if type == "self":
        images = self_storage.list_images()
    elif type == "oss":
        images = oss_storage.list_images()
    else:
        raise HTTPException(status_code=400, detail="Unsupported type.")

    return {
        "code": 200,
        "data": {
            "list": images
        },
        "message": f"Images listed successfully with {len(images)} images."
    }
