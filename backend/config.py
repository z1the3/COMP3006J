#配置文件
import os

# 本地文件存储配置
LOCAL_IMAGE_DIR = os.path.join(os.getcwd(), "images")
os.makedirs(LOCAL_IMAGE_DIR, exist_ok=True)

# OSS 配置（需完善，替换成咱们的oss信息）
OSS_ENDPOINT = "oss-cn-beijing.aliyuncs.com"
OSS_BUCKET_NAME = "comp3006j-bucket"
OSS_ACCESS_KEY_ID = "LTAI5tGny7d2pZYMoJZyVPoj"
OSS_ACCESS_KEY_SECRET = "ohWi6t4QsB56WEsUqCiAhZO6faW0dn"

