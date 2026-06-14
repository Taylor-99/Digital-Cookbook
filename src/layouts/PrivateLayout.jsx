import { Outlet } from 'react-router-dom';
import PrivateNavbar from '../components/PrivateNavbar';

// this is the private layout for when the user logs in to view their recipes and collections
const PrivateLayout = () => {
    return (
        <div>
            <PrivateNavbar />
            <Outlet />
        </div>
    );
};

export default PrivateLayout;