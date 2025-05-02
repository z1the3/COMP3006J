#配置文件
import os

# 本地文件存储配置
LOCAL_IMAGE_DIR = os.path.join(os.getcwd(), "images")
os.makedirs(LOCAL_IMAGE_DIR, exist_ok=True)

# OSS 配置（需完善，替换成咱们的oss信息）
OSS_ENDPOINT = os.getenv("OSS_ENDPOINT", "oss-cn-hangzhou.aliyuncs.com")
OSS_BUCKET_NAME = os.getenv("OSS_BUCKET_NAME", "your-bucket-name")
OSS_ACCESS_KEY_ID = os.getenv("OSS_ACCESS_KEY_ID", "your-access-key-id")
OSS_ACCESS_KEY_SECRET = os.getenv("OSS_ACCESS_KEY_SECRET", "your-access-key-secret")
