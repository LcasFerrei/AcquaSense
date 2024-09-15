import React, { useState } from 'react';
import HeaderNav from "../../components/AcquaNav/Header";
import '../../components/User/User.css';
import './Config.css'; // Ajuste o caminho conforme necessário

// Componente para Ajuda e Suporte
const HelpAndSupport = () => (
  <div className="help-support">
    <h2>Ajuda e Suporte</h2>
    <div className="support-center">
      <h3>Central de Suporte</h3>
      <ul>
        <li><a href="/articles/setup">Configuração Inicial</a></li>
        <li><a href="/articles/common-problems">Problemas Comuns</a></li>
        <li><a href="/articles/advanced-solutions">Soluções Avançadas</a></li>
      </ul>
    </div>
    <div className="feedback">
      <h3>Feedback Rápido</h3>
      <button>Foi útil?</button>
    </div>
    <div className="virtual-assistant">
      <h3>Assistente Virtual</h3>
      <p>Como posso ajudar você hoje?</p>
      <input type="text" placeholder="Digite sua pergunta..." />
      <button>Enviar</button>
    </div>
  </div>
);

// Componente para Configurações de Privacidade
const PrivacySettings = () => (
  <div className="privacy-settings">
    <h2>Envio de informações por:</h2>
    <div>
      <label>
        <input type="radio" name="visibility" value="private" />
        Aplicativo
      </label>
      <label>
        <input type="radio" name="visibility" value="friends" />
        Email
      </label>
      <label>
        <input type="radio" name="visibility" value="public" />
        SMS
      </label>
    </div>
    <div>
      <h3>Preferências de Comunicação:</h3>
      <label>
        <input type="checkbox" name="shareCompartment1" />
        Diurno
      </label>
      <label>
        <input type="checkbox" name="shareCompartment2" />
        Noturno
      </label>
    </div>
    <div className="data-analysis">
      <h3>Usar dados quando tiver utilizando dados móveis:</h3>
      <label>
        <input type="checkbox" name="shareCompartment1" />
        Sim
      </label>
      <label>
        <input type="checkbox" name="shareCompartment2" />
        Não
      </label>
    </div>
    <a href="/privacy-policy">Leia nossa Política de Privacidade</a>
  </div>
);

function ConfiguHome() {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    console.log('Alterações salvas');
    setIsEditing(false);
  };

  const handleCancel = () => {
    console.log('Alterações canceladas');
    setIsEditing(false);
  };

  return (
    <div>
      <HeaderNav />
      <div className="config-container">
        <HelpAndSupport />
        <PrivacySettings />
        <div className="buttons">
          {isEditing ? (
            <>
              <button onClick={handleSave}>Salvar</button>
              <button onClick={handleCancel}>Cancelar</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>Editar Configurações</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfiguHome;