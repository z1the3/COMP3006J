import React, { useState } from 'react';
import { uploadImage } from '../services/api';
import { toast } from 'react-toastify';
import styles from './ImageUploader.module.css'; // Assuming you have a CSS module for styling

const ImageUploader: React.FC<{ onUpload: () => void }> = ({ onUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [storageType, setStorageType] = useState<string>('self');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file) {
            try {
                await uploadImage(file, storageType);
                toast.success('Image uploaded successfully!');
                onUpload();
            } catch (error) {
                toast.error('Upload failed!');
            }
        }
    };

    return (
        <div className={styles.uploadContainer}>
            <h2 className={styles.uploadTitle}>Upload Image</h2>
            <div className={styles.uploadControls}>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
                <select 
                    value={storageType} 
                    onChange={(e) => setStorageType(e.target.value)}
                    className={styles.storageSelect}
                >
                    <option value="self">Self</option>
                    <option value="oss">Oss</option>
                </select>
                <button 
                    onClick={handleUpload}
                    className={styles.uploadButton}
                >
                    Upload Image
                </button>
            </div>
        </div>
    );
};

export default ImageUploader;