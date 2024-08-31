import DashboardHeaderNav from "../../components/AcquaNav/Header";
import '../../components/User/User.css';
import UserProfile from "../../components/User/User";


function UserHome(){
    return (
        <div className="user-home-container">
            <DashboardHeaderNav />
            <UserProfile />
        </div>
    );
}

export default UserHome;