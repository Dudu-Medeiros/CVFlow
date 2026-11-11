import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google'; // 1. Importação adicionada

import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const GOOGLE_CLIENT_ID = "61190983057-ossikpbkcbmq28pb3itne7uoclivmlj8.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);