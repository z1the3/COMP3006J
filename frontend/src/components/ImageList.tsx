import React, { useEffect, useState } from 'react';
import { fetchImages, deleteImage, getImage, randomFetchImages } from '../services/api';
import { toast } from 'react-toastify';
import styles from './ImageList.module.css';

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

    const handleRandomFetch = async (randomFetchType: string) => {
        const startTime = Date.now();
        try {
            const response = await randomFetchImages(randomFetchType);
            const data = response.data;
            const endTime = Date.now();
            const timeTaken = endTime - startTime; // 计算耗时
            if (data.code === 200) {
                toast.success(`Successfully fetched ${data.data.success.length} images! Time taken: ${timeTaken} ms`);
                setImages(data.data.success); // 更新状态以显示新拉取的图片
            }
        } catch (error) {
            toast.error('Failed to fetch images!');
        }
    };

    useEffect(() => {
        loadImages();
    }, []);

    return (
        <div className={styles.listContainer}>
            <h2 className={styles.listTitle}>Image Gallery</h2>
            <div className={styles.controls}>
                <select 
                    value={randomFetchType} 
                    onChange={(e) => setRandomFetchType(e.target.value)}
                    className={styles.fetchSelect}
                >
                    <option value="self">Self</option>
                    <option value="oss">Oss</option>
                </select>
                <button 
                    onClick={() => handleRandomFetch(randomFetchType)} 
                    disabled={loading}
                    className={styles.fetchButton}
                >
                    {loading ? 'Loading...' : 'Fetch Random Images (Performance Test)'}
                </button>
            </div>
            <ul className={styles.imageList}>
                {images.map((image) => (
                    <li key={image.id} className={styles.imageItem}>
                        <div className={styles.imageMeta}>
                            <div className={styles.imageId}>Image ID: {image.id}</div>
                            <div className={styles.imageType}>Storage: {image.type}</div>
                        </div>
                        <div>
                            <button 
                                onClick={() => handleFetchImage(image.id, image.type)} 
                                disabled={loading}
                                className={styles.actionButton}
                            >
                                {loading ? 'Loading...' : 'Fetch Image'}
                            </button>
                            <button 
                                onClick={() => handleDelete(image.id)} 
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                            >
                                Delete
                            </button>
                        </div>
                        <div id={`image-display-${image.id}`} className={styles.imageDisplay}></div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
       
export default ImageList;