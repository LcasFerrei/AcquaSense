import React, { useState } from 'react';
import './User.css';

const UserProfile = () => {
  const [profilePic, setProfilePic] = useState(null); // Estado para armazenar a foto do perfil

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // Atualiza o estado com a URL da imagem
      };
      reader.readAsDataURL(file); // Lê a imagem como URL de dados
    }
  };

  return (
    <div className="user-home-container">
      <div className="user-column">
        <h2>Dados do Usuário</h2>
        <div className="user-info">
          <div className="profile-pic-container">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="profile-pic" />
            ) : (
              <div className="profile-pic-placeholder">Nenhuma foto</div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="file-input" 
            />
          </div>
          <p><strong>Nome:</strong> João da Silva</p>
          <p><strong>IP do Cliente:</strong> 192.168.1.1</p>
          <p><strong>Endereço:</strong> Rua das Flores, 123, Fortaleza - CE</p>
          <p><strong>Quantidade de Sensores Instalados:</strong> 3</p>
          <p><strong>IP dos Sensores:</strong></p>
          <ul>
            <li>192.168.1.101</li>
            <li>192.168.1.102</li>
            <li>192.168.1.103</li>
          </ul>
          <p><strong>Último Acesso:</strong> 26/08/2024 14:35</p>
          <p><strong>Status da Conta:</strong> Ativa</p>
          <p><strong>Número de Alertas:</strong> 2</p>
          <p><strong>Histórico de Atividades:</strong></p>
          <ul>
            <li>Configuração de novos sensores - 25/08/2024</li>
            <li>Alteração de senha - 20/08/2024</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
