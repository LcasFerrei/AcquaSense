/*import React from 'react';
import './Homepage.css'; // Importa o CSS para a página inicial

import imgTeste from "../../Assets/img home/indice-3.jpg";

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="header">
        <div className="header-content">
          <h1 className="project-title">Acquasense</h1>
          <p className="project-description">
            Descubra como manter a economia de água em sua vida com Acquasense! Transforme a gestão de água em algo simples e eficiente.
          </p>
          <a href="#learn-more" className="cta-button">Saiba Mais</a>
        </div>
      </header>

      <section className="carousel">
        <div className="carousel-content">
          <img src={imgTeste} alt="Imagem 1" className="carousel-image" />
          <img src={imgTeste} alt="Imagem 2" className="carousel-image" />
          <img src={imgTeste} alt="Imagem 3" className="carousel-image" />
        </div>
      </section>

      <section id="learn-more" className="learn-more">
        <div className="learn-more-content">
          <h2 className="section-title">Sobre o Acquasense</h2>
          <p className="section-description">
            O Acquasense é uma plataforma inovadora dedicada a ajudar você a economizar água. Com funcionalidades avançadas e uma interface intuitiva, nossa missão é promover a sustentabilidade e a eficiência no uso dos recursos hídricos.
          </p>
        </div>
      </section>

      <section className="news">
        <h2 className="news-title">Últimas Notícias</h2>
        <div className="news-container">
          <div className="news-card">
            <h3 className="news-card-title">Notícia 1</h3>
            <p className="news-card-content">
              Descubra as últimas atualizações e novidades do Acquasense. Mantenha-se informado sobre novos recursos e melhorias.
            </p>
            <a href="#" className="news-card-button">Leia Mais</a>
          </div>
          <div className="news-card">
            <h3 className="news-card-title">Notícia 2</h3>
            <p className="news-card-content">
              Acompanhe nossos blogs e artigos sobre sustentabilidade e gestão eficiente da água. Informe-se sobre como fazer a diferença.
            </p>
            <a href="#" className="news-card-button">Leia Mais</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;*/

// src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import img1 from '../../Assets/img home/0.jpg';
import img2 from '../../Assets/img home/agua.jpg';
import img3 from '../../Assets/img home/indice-3.jpg';
import contactImg from '../../Assets/img home/grupo.jpg';

const HomePage = () => {
    return (
        <div className="app">
            <Header />
            <MainContent />
            <Footer />
        </div>
    );
};

const Header = () => {
    const toggleDarkMode = () => {
        document.body.classList.toggle('dark-mode');
        const icon = document.querySelector('#theme-toggle i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            document.getElementById('theme-toggle').textContent = ' Modo Claro';
            document.getElementById('theme-toggle').prepend(icon);
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            document.getElementById('theme-toggle').textContent = ' Modo Escuro';
            document.getElementById('theme-toggle').prepend(icon);
        }
    };

    return (
        <header className="header">
            <nav>
                <ul>
                    <li><a href="#home">Início</a></li>
                    <li><a href="#about">Sobre Nós</a></li>
                    <li><a href="#services">Serviços</a></li>
                    <li><a href="#news">Notícias</a></li>
                    <li><a href="#contact">Contato</a></li>
                    <li><a href="/login">Portal do Cliente</a></li>
                    <li><a href="https://wa.me/5585991541634?text=Ol%C3%A1%20Gostaria%20de%20saber%20sobre%20o%20Acquasense%20e%20Entrar%20para%20o%20time%20dos%20economizadores%20e%20descubra%20como%20cada%20gota%20conta%21%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank">Entre em Contato</a></li>
                    <li>
                        <button id="theme-toggle" onClick={toggleDarkMode}>
                            <i className="fa-solid fa-moon"></i> Modo Escuro
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

const MainContent = () => (
    <main>
        <section id="home" className="hero">
            <h2>AcquaSense</h2>
            <p>Com AcquaSense, economizar água é tão fácil quanto virar a torneira.</p>
        </section>

        <section id="about" className="about">
            <h2>Sobre Nós</h2>
            <p>Somos uma empresa dedicada à qualidade e sustentabilidade no fornecimento de água. Com anos de experiência no setor, garantimos um serviço eficiente e comprometido com o meio ambiente.</p>
        </section>

        <section id="services" className="services">
            <h2>Serviços</h2>
            <p>Distribuição de água potável</p>
            <p>Tratamento e purificação de água</p>
            <p>Serviços de emergência e manutenção</p>
        </section>

        <NewsSection />

        <section id="faq" className="faq">
            <h2>Perguntas Frequentes</h2>
            <div className="faq-item">
                <h3>Como economizar água em casa?</h3>
                <p>Utilize torneiras e chuveiros com baixa vazão e conserte vazamentos imediatamente.</p>
            </div>
            <div className="faq-item">
                <h3>Qual é o impacto financeiro da economia de água?</h3>
                <p>Reduzir o consumo de água pode diminuir significativamente sua conta de água e contribuir para a preservação ambiental.</p>
            </div>
            <div className="faq-item">
                <h3>Quais são as novas tecnologias em purificação de água?</h3>
                <p>A tecnologia de osmose reversa e os filtros de carvão ativado são algumas das mais recentes inovações no mercado.</p>
            </div>
        </section>

        <section id="reviews" className="reviews">
            <h2>Avaliações de Clientes</h2>
            <div className="review-item">
                <p>"O AcquaSense revolucionou nossa forma de economizar água. Recomendo!" - João Silva</p>
            </div>
            <div className="review-item">
                <p>"Excelente serviço e ótimas dicas de economia de água." - Maria Oliveira</p>
            </div>
        </section>

        <section id="contact" className="contact">
            <div className="contact-text">
                <h2>Contato</h2>
                <p>Entre em contato conosco para mais informações sobre nossos serviços ou para qualquer dúvida.</p>
                <p>Email: contato@acquasense.com</p>
                <p>Telefone: (00) 0000-0000</p>
            </div>
            <div className="contact-image">
                <img src={contactImg} alt="Contato" />
            </div>
        </section>
    </main>
);

const NewsSection = () => (
    <div className="news-section">
        <NewsCarousel />
        <AcquaCast />
    </div>
);

const NewsCarousel = () => {
    const [currentNews, setCurrentNews] = useState(0);
    const newsItems = [
        {
            title: "Como Economizar Água em Casa",
            content: "Descubra dicas simples para reduzir o consumo de água em sua casa e economizar na conta.",
            image: img1
        },
        {
            title: "Benefícios Financeiros da Economia de Água",
            content: "Saiba como a economia de água pode impactar positivamente suas finanças e contribuir para um futuro mais sustentável.",
            image: img2
        },
        {
            title: "Novas Tecnologias em Purificação de Água",
            content: "Explore as mais recentes inovações no tratamento e purificação da água.",
            image: img3
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentNews((prev) => (prev + 1) % newsItems.length);
        }, 5000); // Muda a cada 5 segundos

        return () => clearInterval(interval);
    }, [newsItems.length]);

    return (
        <section id="news" className="news">
            <h2>Notícias</h2>
            <div className="carousel">
                <article key={currentNews}>
                    <img src={newsItems[currentNews].image} alt={newsItems[currentNews].title} className="news-image" />
                    <h3>{newsItems[currentNews].title}</h3>
                    <p>{newsItems[currentNews].content}</p>
                </article>
            </div>
        </section>
    );
};

const AcquaCast = () => {
    return (
        <aside className="acquacast">
            <h2>Escute o AcquaCast</h2>
            <p>Os podcasts mais recentes sobre sustentabilidade e conservação da água:</p>
            <ul>
                <li><a href="#">Podcast 1: A importância da economia de água</a></li>
                <li><a href="#">Podcast 2: Tecnologias emergentes para purificação</a></li>
                <li><a href="#">Podcast 3: O futuro da água potável</a></li>
                <li><a href="#">Podcast 4: Impacto financeiro da sustentabilidade</a></li>
            </ul>
        </aside>
    );
};

const Footer = () => (
    <footer className="footer">
        <p>&copy; 2024 AcquaSense. Todos os direitos reservados a © AJLL Tech Solutions.</p>
    </footer>
);

export default HomePage;