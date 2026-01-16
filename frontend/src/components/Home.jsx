import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import LoginPopUp from './LoginPopUp';
import LoginRedirect from './LoginRedirect';
import { getCookie } from '../utils/getCookie.js';

const Home = () => {
    const { user, loading, setUser } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            };
            const response = await fetch(
                'http://localhost:8000/api/auth/logout/',
                {
                    method: 'POST',
                    headers,
                    credentials: 'include',
                }
            );
            if (response.ok) {
                setUser(null);
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    if (loading) return <h2>Loading...</h2>;

    return (
        <>
            {user ? (
                <div>
                    <p>
                        Name: {user.first_name} {user.last_name}
                    </p>
                    <p>Email: {user.email}</p>
                    <button onClick={handleLogout}>Изход</button>
                </div>
            ) : (
                <>
                    <LoginPopUp />
                    <br />
                    <br />
                    <LoginRedirect />
                </>
            )}
        </>
    );
};

export default Home;
