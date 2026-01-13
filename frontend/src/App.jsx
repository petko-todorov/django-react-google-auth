import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './AuthContext';
import Home from './components/Home';

function App() {
    const GOOGLE_CLIENT_ID =
        '984896660136-9qah6rb65u01dagd80b86jp94g7f9gbb.apps.googleusercontent.com';

    return (
        <>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <AuthProvider>
                    <Home />
                </AuthProvider>
            </GoogleOAuthProvider>
        </>
    );
}

export default App;
