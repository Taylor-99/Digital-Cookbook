import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

//this is the public layout for then the user is not logged in yet and can login/signup or view the landing page
const PublicLayout = () => {
    return (
        <div>
            <PublicNavbar />
            <Outlet />
        </div>
    );
};

export default PublicLayout;