import HeaderNav from "../../components/AcquaNav/Header";
import MonitoramentoAgua from "../../components/Monitoramento/Monitoramento";
import './HomeMonitoring.css';



function MonitoringHome(){
    return (
        <div className="dashboard-container">
            <HeaderNav />
            <MonitoramentoAgua/>
           
        </div>
)}

export default MonitoringHome