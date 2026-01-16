import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './AuthContext';
import Home from './components/Home';
import { Routes, Route, Navigate } from 'react-router';
import GoogleCallback from './components/GoogleCallback';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/google-callback" element={<GoogleCallback />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;
