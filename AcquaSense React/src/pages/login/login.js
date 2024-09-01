import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faGoogle, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import imgVisualization from "../../Assets/img login/undraw_visualization_re_1kag.svg";
import imgVisionaryTechnology from "../../Assets/img login/undraw_visionary_technology_re_jfp7.svg";
import axios from 'axios';
import Cookies from 'js-cookie';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Estado para a mensagem de erro
  const navigate = useNavigate();

  useEffect(() => {
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    const handleSignUpClick = () => {
      container.classList.add("sign-up-mode");
      setIsSignUp(true);
    };

    const handleSignInClick = () => {
      container.classList.remove("sign-up-mode");
      setIsSignUp(false);
    };

    sign_up_btn.addEventListener("click", handleSignUpClick);
    sign_in_btn.addEventListener("click", handleSignInClick);

    return () => {
      sign_up_btn.removeEventListener("click", handleSignUpClick);
      sign_in_btn.removeEventListener("click", handleSignInClick);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isSignUp ? 'http://localhost:8000/register/' : 'http://localhost:8000/login/';

    const data = {
      username: formData.username,
      password: formData.password,
      ...(isSignUp && { email: formData.email })
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        withCredentials: true,
      });

      console.log('Success:', response.data);
      
      navigate('/Dashboard');
      
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.error : error.message); // Mensagem de erro
    }
  };

  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={handleSubmit} className={`sign-in-form ${!isSignUp ? 'active' : ''}`}>
            <h2 className="title">Login</h2>
            <p>Que bom ter você de volta!</p>
            <p>Continue sua jornada na economia de água e veja o impacto de cada gota.</p>
            <div className="input-field">
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
            <div className="input-field">
              <FontAwesomeIcon icon={faLock} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <input type="submit" value="Entrar" className="btn solid" />
            <p className="social-text">Ou faça login com plataformas sociais</p>
            <div className="social-media">
              <button className="social-icon">
                <FontAwesomeIcon icon={faFacebookF} />
              </button>
              <button className="social-icon">
                <FontAwesomeIcon icon={faTwitter} />
              </button>
              <button className="social-icon">
                <FontAwesomeIcon icon={faGoogle} />
              </button>
              <button className="social-icon">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </button>
            </div>
            <a href="/forgot-password" className="forgot-password">Esqueci minha senha</a>
          </form>
          <form onSubmit={handleSubmit} className={`sign-up-form ${isSignUp ? 'active' : ''}`}>
            <h2 className="title">Inscrever-se</h2>
            <div className="input-field">
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
            <div className="input-field">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required={isSignUp}
              />
            </div>
            <div className="input-field">
              <FontAwesomeIcon icon={faLock} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <input type="submit" className="btn" value="Cadastrar" />
            <p className="social-text">Ou inscreva-se com plataformas sociais</p>
            <div className="social-media">
              <button className="social-icon">
                <FontAwesomeIcon icon={faFacebookF} />
              </button>
              <button className="social-icon">
                <FontAwesomeIcon icon={faTwitter} />
              </button>
              <button className="social-icon">
                <FontAwesomeIcon icon={faGoogle} />
              </button>
              <button className="social-icon">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="top-bar">
            <h1><a href="/">AcquaSense</a></h1>
          </div>
          <div className="content">
            <h2>Bem vindo ao AcquaSense</h2>
            <p>Entre para o time dos economizadores e descubra como cada gota conta!</p>
            <button className="btn transparent" id="sign-up-btn">Cadastre-se</button>
          </div>
          <img src={imgVisualization} className="image" alt="Visualization" />
        </div>
        <div className="panel right-panel">
          <div className="top-bar">
            <h1><a href="/">AcquaSense</a></h1>
          </div>
          <div className="content">
            <h3>Já inscrito?</h3>
            <p>Ótimo, você já faz parte da nossa equipe! Faça login para acessar sua conta e continuar sua jornada de economia de água.</p>
            <button className="btn transparent" id="sign-in-btn">Entrar</button>
          </div>
          <img src={imgVisionaryTechnology} className="image" alt="Visionary Technology" />
        </div>
      </div>

      {/* Exibição do alerta estilizado */}
      {errorMessage && (
        <div className="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default Login;
