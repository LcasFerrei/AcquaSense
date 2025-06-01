import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './User.css'; // Atualize o nome do CSS se necessário

const UserProfile = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Cartão de Crédito');
  const [tempPaymentMethod, setTempPaymentMethod] = useState('Cartão de Crédito'); // Estado temporário para a forma de pagamento
  const [isEditing, setIsEditing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const paymentIcons = {
    'Cartão de Crédito': '/cartao.png', // Imagem do Cartão de Crédito
    'Boleto': '/boleto.png', // Imagem do Boleto
    'PIX': '/pix.png' // Imagem do PIX
  };

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://acquasense.onrender.com/api/user-profile/', {
          method: "GET",
          credentials: "include", // Envia cookies de autenticação
        });
        const data = await response.json();
        if (response.ok) {
          setPersonalInfo({
            name: data.name,
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
          });
        } else {
          console.error('Erro ao carregar perfil:', data);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    };

    fetchProfile();
  }, []);

  const handlePaymentChange = (e) => {
    setTempPaymentMethod(e.target.value); // Atualiza o estado temporário
  };

  // Handle input changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value
    });
  };

  const handleUpdatePaymentMethod = () => {
    setPaymentMethod(tempPaymentMethod); // Atualiza a forma de pagamento com o estado temporário
    const message = `Forma de pagamento atualizada para: ${tempPaymentMethod}`;
    setUpdateMessage(message);

    setTimeout(() => {
      setUpdateMessage('');
    }, 1000);
  };

  // Update user profile
  const handleUpdate = async () => {

    if (!personalInfo.name || !personalInfo.email) {
      setUpdateMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

      const nameString = personalInfo.name ? String(personalInfo.name) : '';
      console.log(csrfToken)
      // Divide o nome em partes, garantindo que sempre terá valores
      const nameParts = nameString.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const token = localStorage.getItem('authToken'); // Supondo que o token está armazenado no localStorage
      const response = await fetch('https://acquasense.onrender.com/api/user-profile-edit/', {
        method: 'PATCH', // Usar PATCH para atualizações parciais
        credentials: 'include', // Importante para enviar cookies de sessão
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Authorization': `Bearer ${token}` // Adiciona token JWT se estiver usando
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone: personalInfo.phone || '',
          address: personalInfo.address || '',
          email: personalInfo.email || '',
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        setUpdateMessage('Informações atualizadas com sucesso!');
      } else {
        const data = await response.json();
        console.error('Erro ao atualizar perfil:', data);
        setUpdateMessage('Erro ao atualizar perfil.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setUpdateMessage('Erro ao atualizar perfil.');
    }
  };

  return (
    <section className="profile-section">
      <h2><i className="fas fa-solid fa-user"></i> Meu Perfil</h2>
      <div className="profile-container">
        <div className="profile-info">
          <div className="profile-card">
            <h3>Informações Pessoais</h3>
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
            {isEditing ? (
              <>
              <div className="button-container">
              <button onClick={handleUpdate}>Salvar</button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancelar edição
              </button></div>
            </>
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
              <p className="payment-date">13 de Dezembro de 2024 - R$ 62,90</p>
            </div>
            <div className="form-group">
              <label>Último pagamento:</label>
              <p className="payment-date">1 de Novembro de 2024 - R$ 60,90</p>
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

          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;