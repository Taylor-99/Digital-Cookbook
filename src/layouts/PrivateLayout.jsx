import { Outlet } from 'react-router-dom';
import PrivateNavbar from '../components/PrivateNavbar';

const PrivateLayout = () => {
    return (
        <div>
            <PrivateNavbar />
            <Outlet />
        </div>
    );
};

export default PrivateLayout;