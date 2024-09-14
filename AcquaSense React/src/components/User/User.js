import React, { useState } from 'react';
import './User.css'; // Atualize o nome do CSS se necessário

const UserProfile = () => {
  const [paymentMethod, setPaymentMethod] = useState('Cartão de Crédito');
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Lucas Ferreira',
    address: 'Rua Exemplo, 123',
    phone: '123-456-7890',
    email: 'lucas@example.com'
  });
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpdate = () => {
    // Aqui você pode enviar as informações para um backend ou armazenar localmente
    console.log('Informações Atualizadas:', personalInfo);
    setIsEditing(false);
  };

  return (
    <section className="profile-section">
      <h2><i className="fas fa-solid fa-user"></i> Meu Perfil</h2>
      <div className="profile-container">
        <div className="profile-info">
          <div className="profile-card">
            <h3>Informações Pessoais</h3>
            <img src={profileImage || 'https://via.placeholder.com/100'} alt="Perfil" />
            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                name="name"
                value={personalInfo.name}
                onChange={handlePersonalInfoChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Endereço:</label>
              <input
                type="text"
                name="address"
                value={personalInfo.address}
                onChange={handlePersonalInfoChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Telefone:</label>
              <input
                type="text"
                name="phone"
                value={personalInfo.phone}
                onChange={handlePersonalInfoChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group upload-btn">
              <label>Foto de perfil:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={!isEditing}
              />
            </div>
            {isEditing ? (
              <button onClick={handleUpdate}>Atualizar Informações</button>
            ) : (
              <button onClick={() => setIsEditing(true)}>Editar Informações</button>
            )}
          </div>
        </div>
        <div className="profile-payment">
          <div className="profile-card">
            <h3>Detalhes da Assinatura</h3>
            <div className="form-group">
              <label>Forma de pagamento:</label>
              <div className="payment-details">
                <img src="https://via.placeholder.com/50" alt="Cartão de Crédito" /> {/* Substitua com imagem do cartão */}
                <p>Forma atual: {paymentMethod}</p>
              </div>
            </div>
            <div className="form-group">
              <label>Próxima cobrança:</label>
              <p>1 de Outubro de 2024 - R$ 62,90</p>
            </div>
            <div className="form-group">
              <label>Último pagamento:</label>
              <p>1 de Novembro de 2024 - R$ 62,90</p>
            </div>
            <div className="form-group">
              <label>Alterar forma de pagamento:</label>
              <select
                value={paymentMethod}
                onChange={handlePaymentChange}
              >
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Boleto">Boleto</option>
                <option value="PIX">PIX</option>
              </select>
            </div>
            <button>Atualizar Forma de Pagamento</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserProfile;
