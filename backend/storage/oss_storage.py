# oss的api



import oss2
import uuid
from fastapi import UploadFile
from config import OSS_ENDPOINT, OSS_BUCKET_NAME, OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET

# 初始化 OSS 客户端
auth = oss2.Auth(OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET)
bucket = oss2.Bucket(auth, OSS_ENDPOINT, OSS_BUCKET_NAME)

def generate_image_id():
    return uuid.uuid4().hex

def upload_image(file: UploadFile) -> dict:
    image_id = generate_image_id()
    object_key = f"{image_id}.jpg"
    bucket.put_object(object_key, file.file)
    url = f"https://{OSS_BUCKET_NAME}.{OSS_ENDPOINT}/{object_key}"
    return {
        "id": image_id,
        "url": url,
        "type": "oss"
    }

def get_image_url(image_id: str) -> str:
    object_key = f"{image_id}.jpg"
    if bucket.object_exists(object_key):
        return f"https://{OSS_BUCKET_NAME}.{OSS_ENDPOINT}/{object_key}"
    return None

def delete_image(image_id: str) -> bool:
    object_key = f"{image_id}.jpg"
    if bucket.object_exists(object_key):
        bucket.delete_object(object_key)
        return True
    return False

def list_images() -> list:
    result = []
    for obj in oss2.ObjectIterator(bucket, prefix="", delimiter="/"):
        if obj.key.endswith(".jpg"):
            image_id = obj.key.replace(".jpg", "")
            result.append({
                "id": image_id,
                "url": f"https://{OSS_BUCKET_NAME}.{OSS_ENDPOINT}/{obj.key}",
                "type": "oss"
            })
    return result
