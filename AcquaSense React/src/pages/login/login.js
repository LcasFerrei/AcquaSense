import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import imgVisualization from "../../Assets/img login/undraw_visualization_re_1kag.svg";
import imgVisionaryTechnology from "../../Assets/img login/undraw_visionary_technology_re_jfp7.svg";
import LogoAcqua from "../../Assets/img login/LogoAcquaSense.png";
import Cookies from 'js-cookie';
import axios from 'axios';
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleFormToggle = () => {
    setIsSignUp((prev) => !prev);
    setFormData({ username: '', password: '', email: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getCsrfToken = () => Cookies.get('csrftoken');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignUp ? 'http://localhost:8000/register/' : 'http://localhost:8000/login/';
    const data = { username: formData.username, password: formData.password, ...(isSignUp && { email: formData.email }) };

    try {
      await axios.post(url, data, { headers: { 'X-CSRFToken': getCsrfToken() }, withCredentials: true });
      navigate('/Dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'Ocorreu um erro. Tente novamente.');
      setFormData({ username: '', password: '', email: '' });
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className={`acqua-login-wrapper ${isSignUp ? "acqua-sign-up-mode" : ""}`}>
      <div className="acqua-form-panel">
        <form onSubmit={handleSubmit} className="acqua-login-form">
          <a href="/" className="acqua-logo-link">
            <img src={LogoAcqua} alt="Logo AcquaSense" className="acqua-logo" />
          </a>
          <h2 className="acqua-form-title">{isSignUp ? "Cadastrar" : "Entrar"}</h2>
          <div className="acqua-input-group">
            <FontAwesomeIcon icon={faUser} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          {isSignUp && (
            <div className="acqua-input-group">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <div className="acqua-input-group acqua-password-group">
            <FontAwesomeIcon icon={faLock} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="acqua-password-toggle-icon"
              onClick={togglePasswordVisibility}
            />
          </div>
          <button type="submit" className="acqua-action-button acqua-solid-button">{isSignUp ? "Cadastrar" : "Entrar"}</button>
          {!isSignUp && <a href="/forgot-password" className="acqua-forgot-password-link">Esqueci minha senha</a>}
        </form>
        <button className="acqua-action-button acqua-transparent-button" onClick={handleFormToggle}>
          {isSignUp ? "Entrar" : "Cadastre-se"}
        </button>
      </div>
      <div className="acqua-info-panel">
        <h1><a href="/">AcquaSense</a></h1>
        <img src={isSignUp ? imgVisionaryTechnology : imgVisualization} alt="Ilustração" />
        <h2>{isSignUp ? "Junte-se a nós" : "Bem-vindo de volta"}</h2>
        <p>{isSignUp ? "Faça parte do time que transforma cada gota em economia." : "Continue sua jornada de economia de água e veja o impacto de cada gota."}</p>
      </div>
    </div>
  );
};

export default Login;
