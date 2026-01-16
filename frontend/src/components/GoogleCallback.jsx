import { useEffect, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { AuthContext } from '../AuthContext';

const GoogleCallback = () => {
    const { checkAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    useEffect(() => {
        if (code) {
            const processLogin = async () => {
                try {
                    const response = await fetch(
                        'http://localhost:8000/api/auth/google-login/',
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ code, flow: 'redirect' }),
                            credentials: 'include',
                        }
                    );

                    if (response.ok) {
                        await checkAuth();
                    } else {
                        const errorData = await response.json();
                        console.error('Login failed:', errorData);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    navigate('/');
                }
            };
            processLogin();
        }
    }, [code, checkAuth, navigate]);

    if (!code) {
        return <Navigate to="/" replace />;
    }

    return <h2>Redirecting...</h2>;
};

export default GoogleCallback;
