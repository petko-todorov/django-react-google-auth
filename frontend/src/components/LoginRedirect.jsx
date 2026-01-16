import { useGoogleLogin } from '@react-oauth/google';

const LoginRedirect = () => {
    const login = useGoogleLogin({
        ux_mode: 'redirect',
        flow: 'auth-code',
        redirect_uri: 'http://localhost:5173/google-callback',
    });

    return <button onClick={() => login()}>Login with Google Redirect</button>;
};

export default LoginRedirect;
