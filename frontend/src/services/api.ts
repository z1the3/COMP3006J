import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // 替换为你的 API 服务器地址

// // Demo 数据模拟
// const demoImages = [
//   {
//     id: "abc123",
//     url: "http://localhost:8000/api/image/abc123",
//     type: "self",
//   },
//   {
//     id: "oss456",
//     url: "https://your-bucket.oss-cn-region.aliyuncs.com/oss456.jpg",
//     type: "oss",
//   },
// ];

// 上传图片
export const uploadImage = async (file: File, type: string = "self") => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: { type },
  });
};

// 获取图片
export const getImage = async (id: string, type: string = "self") => {
  return axios.get(`${API_BASE_URL}/image/${id}`, {
    params: { type },
    responseType: "blob",
  });
};

// 删除图片
export const deleteImage = async (id: string) => {
  return axios.delete(`${API_BASE_URL}/image/${id}`);
};

// 获取图片列表
export const fetchImages = async () => {
  return axios.get(`${API_BASE_URL}/images`);
};
