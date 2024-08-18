import React, { useState, useEffect } from 'react';
import './App.css';
import img1 from '../../Assets/img home/0.jpg';
import img2 from '../../Assets/img home/agua.jpg';
import img3 from '../../Assets/img home/indice-3.jpg';
import contactImg from '../../Assets/img home/grupo.jpg';
import bannerImg from '../../Assets/img home/agua.jpg';
import foto1 from '../../Assets/img home/1.jpg';
import foto2 from '../../Assets/img home/2.jpg';
import foto3 from '../../Assets/img home/3.jpg';
import foto4 from '../../Assets/img home/4.jpg';

// Hook customizado para o carrossel
const useCarousel = (items, interval = 5000) => {
    const [currentItem, setCurrentItem] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentItem((prevItem) => (prevItem + 1) % items.length);
        }, interval);

        return () => clearInterval(intervalId);
    }, [items.length, interval]);

    return { currentItem, setCurrentItem };
};

// Componente do carrossel de banners
const BannerCarousel = () => {
    const bannerItems = [
        {
            title: "Qual a importãncia da conscientização sobre o consumo de água?",
            image: bannerImg,
            buttonText: "Saiba Mais",
        },
        {
            title: "Venha aprender maneiras sobre como economizar água ",
            image: img1,
            buttonText: "Saiba Mais",
        },
        {
            title: "Quem está por trás do AcquaSense?",
            image: contactImg,
            buttonText: "Conheça as mentes pensantes por trás desse projeto revolucioário",
        },
    ];

    const { currentItem, setCurrentItem } = useCarousel(bannerItems);

    return (
        <div className="banner-carousel">
            <div className="banner-slide">
                <img src={bannerItems[currentItem].image} alt={bannerItems[currentItem].title} />
                <div className="banner-content">
                    <h2>{bannerItems[currentItem].title}</h2>
                    <button>{bannerItems[currentItem].buttonText}</button>
                </div>
            </div>
            <div className="indicators">
                {bannerItems.map((_, index) => (
                    <span
                        key={index}
                        className={`indicator ${currentItem === index ? 'active' : ''}`}
                        onClick={() => setCurrentItem(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

// Componente do carrossel de notícias
const NewsCarousel = () => {
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
        },
    ];

    const { currentItem } = useCarousel(newsItems);

    return (
        <section id="news" className="news">
            <h2>Notícias</h2>
            <div className="carousel">
                <article key={currentItem} className="news-article">
                    <div className="news-image" style={{ backgroundImage: `url(${newsItems[currentItem].image})` }}>
                        <div className="news-content">
                            <h3>{newsItems[currentItem].title}</h3>
                            <p>{newsItems[currentItem].content}</p>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
};


// Componente do cabeçalho
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
                    <li><a href="https://wa.me/5585991541634?text=Ol%C3%A1%20Gostaria%20de%20saber%20sobre%20o%20Acquasense%20e%20Entrar%20para%20o%20time%20dos%20economizadores%20e%20descubra%20como%20cada%20gota%20conta%21%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer">Entre em Contato</a></li>
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

// Componente principal do conteúdo
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
    <div className="review-list">
        <div className="review-item water-drop">
            <img src={foto2} alt="João Silva" />
            <div className="review-text">
                <p>"O AcquaSense revolucionou nossa forma de economizar água. Recomendo!"</p>
                <p>- João Silva</p>
            </div>
        </div>
        <div className="review-item water-drop">
            <img src={foto1} alt="Maria Oliveira" />
            <div className="review-text">
                <p>"Excelente serviço e ótimas dicas de economia de água."</p>
                <p>- Maria Oliveira</p>
            </div>
        </div>
        <div className="review-item water-drop">
            <img src={foto3} alt="Carlos Mendes" />
            <div className="review-text">
                <p>"Conseguimos reduzir bastante o consumo. Muito satisfeito."</p>
                <p>- Carlos Mendes</p>
            </div>
        </div>
        <div className="review-item water-drop">
            <img src={foto4} alt="Ana Costa" />
            <div className="review-text">
                <p>"Uma solução prática e eficiente para economizar água."</p>
                <p>- Ana Costa</p>
            </div>
        </div>
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

// Componente da seção de notícias
const NewsSection = () => (
    <div className="news-section">
        <NewsCarousel />
    </div>
);

// Componente do rodapé
const Footer = () => (
    <footer className="footer">
        <p>&copy; 2024 AcquaSense. Todos os direitos reservados a © A.J.L.L. Tech Solutions.</p>
    </footer>
);

// Componente principal
const Home = () => (
    <div className="home-page">
        <Header />
        <BannerCarousel />
        <MainContent />
        <Footer />
    </div>
);

export default Home;

    //teste Anna Maria
//Lucas, correções feitas
//missões feitas

