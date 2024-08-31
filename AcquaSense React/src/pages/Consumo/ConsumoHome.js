import HeaderNav from "../../components/AcquaNav/Header";
import ConsumoAgua from "../../components/ConsumoAgua/ConsumoAgua";
import './ConsumoHome.css';



function ConsumoHome(){
    return (
        <div className="dashboard-container">
            <HeaderNav />
            <ConsumoAgua />
        </div>
)}

export default ConsumoHome