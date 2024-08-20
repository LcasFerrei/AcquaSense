import React, { useEffect } from "react";
import "./login.css"; // Importa o CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faGoogle, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

// Importando as imagens (certifique-se de que as imagens estejam no diretório correto)
import imgVisualization from "../../Assets/img login/undraw_visualization_re_1kag.svg";
import imgVisionaryTechnology from "../../Assets/img login/undraw_visionary_technology_re_jfp7.svg";

const Login = () => {
  useEffect(() => {
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    sign_up_btn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });

    sign_in_btn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      sign_up_btn.removeEventListener("click", () => {
        container.classList.add("sign-up-mode");
      });

      sign_in_btn.removeEventListener("click", () => {
        container.classList.remove("sign-up-mode");
      });
    };
  }, []);

  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form action="#" className="sign-in-form">
            <h2 className="title">Login</h2>
            <p>Que bom ter você de volta!</p>
            <p>Continue sua jornada na economia de água e veja o impacto de cada gota.</p>
            <div className="input-field">
              <FontAwesomeIcon icon={faUser} />
              <input type="text" placeholder="Username" />
            </div>
            <div className="input-field">
              <FontAwesomeIcon icon={faLock} />
              <input type="password" placeholder="Password" />
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
            {/* Botão de "Esqueci minha senha" */}
            <a href="/forgot-password" className="forgot-password">Esqueci minha senha</a>
          </form>
          <form action="#" className="sign-up-form">
            <h2 className="title">Inscrever-se</h2>
            <div className="input-field">
              <FontAwesomeIcon icon={faUser} />
              <input type="text" placeholder="Username" />
            </div>
            <div className="input-field">
              <FontAwesomeIcon icon={faEnvelope} />
              <input type="email" placeholder="Email" />
            </div>
            <div className="input-field">
              <FontAwesomeIcon icon={faLock} />
              <input type="password" placeholder="Password" />
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
            <p>
              Entre para o time dos economizadores e descubra como cada gota conta!
            </p>
            <button className="btn transparent" id="sign-up-btn">
              Cadastre-se
            </button>
          </div>
          <img src={imgVisualization} className="image" alt="Visualization" />
        </div>
        <div className="panel right-panel">
          <div className="top-bar">
            <h1><a href="/">AcquaSense</a></h1>
          </div>
          <div className="content">
            <h3>Já inscrito?</h3>
            <p>
              Faça login para acessar sua conta e continuar sua jornada na economia de água.
            </p>
            <button className="btn transparent" id="sign-in-btn">
              Entrar
            </button>
            
          </div>
          <img src={imgVisionaryTechnology} className="image" alt="Visionary Technology" />
        </div>
      </div>
    </div>
  );
};

export default Login;
