import { useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../AuthContext';

const LoginPopUp = () => {
    const { setUser } = useContext(AuthContext);

    const login = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            try {
                const response = await fetch(
                    'http://localhost:8000/api/auth/google-login/',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                            code: codeResponse.code,
                            flow: 'popup',
                        }),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    const errorData = await response.json();
                    console.error('Login failed:', errorData);
                }
            } catch (error) {
                console.error('Login failed:', error);
            }
        },
        onError: () => console.log('Login failed'),
    });

    return (
        <>
            <button onClick={() => login()}>Login with Google Popup</button>
        </>
    );
};

export default LoginPopUp;
