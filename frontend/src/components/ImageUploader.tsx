import React, { useState } from 'react';
import { uploadImage } from '../services/api';
import { toast } from 'react-toastify';

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
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <select value={storageType} onChange={(e) => setStorageType(e.target.value)}>
                <option value="self">Self</option>
                <option value="oss">OSS</option>
            </select>
            <button onClick={handleUpload}>Upload Image</button>
        </div>
    );
};

export default ImageUploader;