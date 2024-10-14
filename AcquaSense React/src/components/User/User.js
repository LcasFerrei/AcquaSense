
import React, { useState } from 'react';
import './User.css'; // Atualize o nome do CSS se necessário

const UserProfile = () => {
  const [paymentMethod, setPaymentMethod] = useState('Cartão de Crédito');
  const [tempPaymentMethod, setTempPaymentMethod] = useState('Cartão de Crédito'); // Estado temporário para a forma de pagamento
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Seu nome',
    address: 'Rua Exemplo, 123',
    phone: '(XX) 1234-5678',
    email: 'meuemail@example.com'
  });
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(''); // Mensagem para feedback do usuário

  // Atualizar a lógica para os ícones de pagamento
  const paymentIcons = {
    'Cartão de Crédito': '/cartao.png', // Imagem do Cartão de Crédito
    'Boleto': '/boleto.png', // Imagem do Boleto
    'PIX': '/pix.png' // Imagem do PIX
  };
  


  const handlePaymentChange = (e) => {
    setTempPaymentMethod(e.target.value); // Atualiza o estado temporário
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

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  // Função para atualizar a forma de pagamento
  const handleUpdatePaymentMethod = () => {
    setPaymentMethod(tempPaymentMethod); // Atualiza a forma de pagamento com o estado temporário
    const message = `Forma de pagamento atualizada para: ${tempPaymentMethod}`;
    setUpdateMessage(message);

    setTimeout(() => {
      setUpdateMessage('');
    }, 1000);
  };

  // Adicionando validação ao atualizar informações
  const handleUpdate = () => {
    if (!personalInfo.name || !personalInfo.email) {
      setUpdateMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    console.log('Informações Atualizadas:', personalInfo);
    setIsEditing(false);
    setUpdateMessage('Informações atualizadas com sucesso!');
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
            {isEditing && (
              <div className="form-group">
                <label>Foto de perfil:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <button className="remove-photo-button" onClick={handleRemoveImage}>Remover Foto</button>
              </div>
            )}
            {isEditing ? (
              <button onClick={handleUpdate}>Salvar</button>
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
                <div className="payment-icon">
                  <img src={paymentIcons[paymentMethod]} alt={paymentMethod} />
                </div>
                <p>Forma atual: {paymentMethod}</p>
              </div>
            </div>
            <div className="form-group">
              <label>Próxima cobrança:</label>
              <p className="payment-date">1 de Outubro de 2024 - R$ 62,90</p>
            </div>
            <div className="form-group">
              <label>Último pagamento:</label>
              <p className="payment-date">1 de Novembro de 2024 - R$ 62,90</p>
            </div>
            <div className="form-group">
              <label>Alterar forma de pagamento:</label>
              <select
                value={tempPaymentMethod} // Atualiza o valor do select com o estado temporário
                onChange={handlePaymentChange}
              >
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Boleto">Boleto</option>
                <option value="PIX">PIX</option>
              </select>
            </div>
            <button onClick={handleUpdatePaymentMethod}>Confirmar forma de pagamento</button>
            {updateMessage && <p className="update-message update-text">{updateMessage}</p>} {/* Exibe mensagem de atualização */}

          </div>
        </div>
      </div>
    </section>
  );
}

export default UserProfile;
