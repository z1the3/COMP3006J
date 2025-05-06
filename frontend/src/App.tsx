import React from 'react';
import { ToastContainer } from 'react-toastify';
import ImageUploader from './components/ImageUploader';
import ImageList from './components/ImageList';
import 'react-toastify/dist/ReactToastify.css';
import styles from './App.css'; // 导入CSS模块

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <h1 className={styles.mainTitle}>Project: Image Hosting Service</h1>
      <ImageUploader onUpload={() => console.log('Image uploaded successfully!')} />
      <ImageList />
      <ToastContainer />
    </div>
  );
};

export default App;