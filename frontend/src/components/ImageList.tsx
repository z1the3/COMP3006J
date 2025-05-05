import React, { useEffect, useState } from 'react';
import { fetchImages, deleteImage, getImage } from '../services/api';
import { toast } from 'react-toastify';

const ImageList: React.FC = () => {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [randomFetchType, setRandomFetchType] = useState<string>('self');

    const loadImages = async () => {
        try {
            const response = await fetchImages();
            setImages(response.data?.data?.list);
        } catch (error) {
            toast.error('Failed to fetch images!');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteImage(id);
            toast.success('Image deleted successfully!');
            loadImages(); // Reload images after deletion
        } catch (error) {
            toast.error('Failed to delete image!');
        }
    };

    const handleFetchImage = async (id: string, fetchType: string) => {
        setLoading(true);
        const startTime = Date.now(); // 记录开始时间
        try {
            const response = await getImage(id, fetchType); // 根据 fetchType 获取图片
            const endTime = Date.now(); // 记录结束时间
            const timeTaken = endTime - startTime; // 计算耗时

            // const imageUrl = fetchType === 'self' ? URL.createObjectURL(response.data) : response.redirect;
            const imageUrl = URL.createObjectURL(response.data);

            // Create an image element to show the fetched image
            const imageElement = document.createElement('img');
            imageElement.src = imageUrl; // 设置图片源
            imageElement.alt = id;
            imageElement.style.maxWidth = '200px'; // 控制图片最大宽度
            imageElement.style.marginTop = '10px';

            // Append image to the document body for display
            document.getElementById(`image-display-${id}`)?.appendChild(imageElement);

            toast.success(`Image fetched successfully! Time taken: ${timeTaken} ms`);
        } catch (error) {
            toast.error('Failed to fetch image!');
        } finally {
            setLoading(false);
        }
    };

    const handleRandomFetch = async () => {
        const startTime = Date.now();
        try {
            const response = await fetch(`/api/batch-fetch/${randomFetchType}`, { method: 'POST' });
            const data = await response.json();
            const endTime = Date.now();
            const timeTaken = endTime - startTime; // 计算耗时

            if (data.code === 200) {
                toast.success(`Successfully fetched ${data.data.list.length} images! Time taken: ${timeTaken} ms`);
                setImages(data.data.list); // 更新状态以显示新拉取的图片
            }
        } catch (error) {
            toast.error('Failed to fetch images!');
        }
    };

    useEffect(() => {
        loadImages();
    }, []);

    return (
        <div>
            <h2>Image List</h2>
            <div>
                <select value={randomFetchType} onChange={(e) => setRandomFetchType(e.target.value)}>
                    <option value="self">Self</option>
                    <option value="oss">OSS</option>
                </select>
                <button onClick={handleRandomFetch} disabled={loading}>
                    随机拉取图片（用于性能测试）
                </button>
            </div>
            <ul>
                {images.map((image) => (
                    <li key={image.id} style={{ marginBottom: '20px' }}>
                        <div>
                            <strong>图片 ID:</strong> {image.id}
                        </div>
                        <div>
                            <strong>来源：</strong> {image.type} {/* 显示类型 */}
                        </div>
                        <div>
                            <button onClick={() => handleFetchImage(image.id, image.type)} disabled={loading}>
                                获取图片
                            </button>
                        </div>
                        <div id={`image-display-${image.id}`}></div> {/* 显示图片的地方 */}
                        <button onClick={() => handleDelete(image.id)} style={{ marginTop: '10px' }}>
                            删除
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ImageList;