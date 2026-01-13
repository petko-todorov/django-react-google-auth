import { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../AuthContext';

const LoginPopUp = () => {
    const { setUser } = useContext(AuthContext);

    const handleSuccess = async (googleResponse) => {
        try {
            const response = await fetch(
                'http://localhost:8000/api/auth/google-popup-login/',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: googleResponse.credential }),
                    credentials: 'include',
                }
            );

            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log('Login Failed')}
            />
        </>
    );
};

export default LoginPopUp;
