import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const PublicLayout = () => {
    return (
        <div>
            <PublicNavbar />
            <Outlet />
        </div>
    );
};

export default PublicLayout;