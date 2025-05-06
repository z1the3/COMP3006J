# 主入口
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import image_api
app = FastAPI(title="图床服务 - 本地自建 API")

# 配置 CORS
origins = [
    "http://localhost:1234",  # 允许的源地址，这里需要添加您的前端地址
    # 添加更多允许的源地址如有需要 
    "http://120.26.131.156:1234/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # 允许的源
    allow_credentials=True,
    allow_methods=["*"],      # 允许的 HTTP 方法
    allow_headers=["*"],      # 允许的 HTTP 请求头
)

# 注册 API 路由
app.include_router(image_api.router, prefix="/api")
