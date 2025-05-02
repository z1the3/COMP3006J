# 主入口
from fastapi import FastAPI
from routes import image_api
app = FastAPI(title="图床服务 - 本地自建API")

# 注册API路由
app.include_router(image_api.router, prefix="/api")
