import React from 'react';
import HeaderNav from "../../components/AcquaNav/Header"; // Importa o cabeçalho
import '../../components/Configuracoes/Configu.css'; // Importa o CSS da pasta Configu
import ConfiguSettings from "../../components/Configuracoes/ConfiguSettings"; // Importa o conteúdo do ConfiguSettings

function ConfiguHome() {
  return (
    <div className="configu-container">
      <HeaderNav />  
      <ConfiguSettings /> 
    </div>
  );
}

export default ConfiguHome;
