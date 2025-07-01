import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import CreateAvatar from '@/components/pages/CreateAvatar';
import MemoryCollection from '@/components/pages/MemoryCollection';
import DigitalHome from '@/components/pages/DigitalHome';
import ChatInterface from '@/components/pages/ChatInterface';
import FamilyPortal from '@/components/pages/FamilyPortal';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-avatar" element={<CreateAvatar />} />
            <Route path="/memories" element={<MemoryCollection />} />
            <Route path="/digital-home" element={<DigitalHome />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/family" element={<FamilyPortal />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-50"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;