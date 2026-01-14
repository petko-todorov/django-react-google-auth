import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import LoginPopUp from './LoginPopUp';
import { getCookie } from '../utils/getCookie';

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

    if (loading) return <p>Зареждане...</p>;

    return (
        <>
            {user ? (
                <div>
                    <p>
                        Name: {user.first_name} {user.last_name}
                    </p>
                    <p>Email: {user.email}</p>
                    {user.picture && <img src={user.picture} alt="Profile" />}
                    <button onClick={handleLogout}>Изход</button>
                </div>
            ) : (
                <LoginPopUp />
            )}
        </>
    );
};

export default Home;
