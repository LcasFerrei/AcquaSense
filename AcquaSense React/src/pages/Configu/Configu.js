import React from 'react';
import HeaderNav from "../../components/AcquaNav/Header";
import ConfiguContent from "../../components/Configuracoes/Configu"; // Importa o conteúdo do Configu
import '../../components/Configuracoes/Configu.css';  // Importa o CSS da pasta Configu

function Configu() {
  return (
    <div className="configu-container">
      <HeaderNav />
      <ConfiguContent />
    </div>
  );
}


export default Configu;

