# 本地api



import os
import shutil
import uuid
from fastapi import UploadFile
from config import LOCAL_IMAGE_DIR

def generate_image_id():
    return uuid.uuid4().hex

def get_image_path(image_id: str) -> str:
    return os.path.join(LOCAL_IMAGE_DIR, f"{image_id}.jpg")

def upload_image(file: UploadFile) -> dict:
    image_id = generate_image_id()
    dest_path = get_image_path(image_id)
    with open(dest_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {
        "id": image_id,
        "url": f"/api/image/{image_id}",
        "type": "self"
    }

def get_image_file(image_id: str) -> str:
    path = get_image_path(image_id)
    return path if os.path.exists(path) else None

def delete_image(image_id: str) -> bool:
    path = get_image_path(image_id)
    if os.path.exists(path):
        os.remove(path)
        return True
    return False

def list_images() -> list:
    images = []
    for file in os.listdir(LOCAL_IMAGE_DIR):
        if file.endswith(".jpg"):
            image_id = file.split(".")[0]
            images.append({
                "id": image_id,
                "url": f"/api/image/{image_id}",
                "type": "self"
            })
    return images
