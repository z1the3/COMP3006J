import React from 'react';
import { ToastContainer } from 'react-toastify';
import ImageUploader from './components/ImageUploader';
import ImageList from './components/ImageList';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Image Hosting Service</h1>
      <ImageUploader onUpload={() => console.log('Image uploaded successfully!')} />
      <ImageList />
      <ToastContainer />
    </div>
  );
};

export default App;