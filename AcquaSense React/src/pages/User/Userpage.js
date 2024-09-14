import DashboardHeaderNav from "../../components/AcquaNav/Header";
import './UserPage.css';
import UserProfile from "../../components/User/User";


function UserHome(){
    return (
        <div className="User-container">
            <DashboardHeaderNav />
            <UserProfile />
        </div>
    );
}

export default UserHome;