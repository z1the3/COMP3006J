import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // 替换为你的 API 服务器地址

// 控制使用 demo 数据还是实际发送请求的开关
const useDemoData = true; // 将其设置为 true 使用 demo 数据，设置为 false 使用真实数据

// Demo 数据模拟
const demoImages = [
  {
    id: "abc123",
    url: "http://localhost:8000/api/image/abc123",
    type: "self",
  },
  {
    id: "oss456",
    url: "https://your-bucket.oss-cn-region.aliyuncs.com/oss456.jpg",
    type: "oss",
  },
];

// 上传图片
export const uploadImage = async (file: File, type: string = "self") => {
  if (useDemoData) {
    const mockResponse = {
      data: {
        code: 200,
        data: {
          url: `http://localhost:8000/api/image/${file.name}`, // 模拟返回的URL
          id: file.name, // 使用文件名作为ID
          type,
        },
        message: "Image uploaded successfully.",
      },
    };
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockResponse), 500)
    );
  } else {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: { type },
    });
  }
};

// 获取图片
export const getImage = async (id: string, type: string = "self") => {
  if (useDemoData) {
    const image = demoImages.find((img) => img.id === id);
    if (!image) {
      throw new Error("Image not found");
    }
    if (type === "oss") {
      return { redirect: image.url }; // 返回重定向链接
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: new Blob(), // 模拟返回的二进制数据
          type: "image/jpeg",
        });
      }, 500);
    });
  } else {
    return axios.get(`${API_BASE_URL}/image/${id}`, {
      params: { type },
      responseType: "blob",
    });
  }
};

// 删除图片
export const deleteImage = async (id: string) => {
  if (useDemoData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            code: 200,
            message: "Image deleted successfully.",
          },
        });
      }, 500);
    });
  } else {
    return axios.delete(`${API_BASE_URL}/image/${id}`);
  }
};

// 获取图片列表
export const fetchImages = async () => {
  if (useDemoData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            code: 200,
            data: {
              success: demoImages,
              failed: [],
            },
            message: `Batch fetched with ${demoImages.length} successes and 0 failed.`,
          },
        });
      }, 500);
    });
  } else {
    return axios.get(`${API_BASE_URL}/images`);
  }
};
