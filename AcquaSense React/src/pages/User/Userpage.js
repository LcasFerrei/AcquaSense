import DashboardHeaderNav from "../../components/AcquaNav/Header";
import './UserPage.css';
import UserProfile from "../../components/User/User";


function UserHome(){
    return (
        <div className="dashboard-container">
            <DashboardHeaderNav />
            <UserProfile />
        </div>
    );
}

export default UserHome;