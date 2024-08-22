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
import logoAcquaSense from '../../Assets/img login/LogoAcquaSense.png';


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
            title: "Qual a importância da conscientização sobre o consumo de água?",
            image: bannerImg,
            buttonText: "Saiba mais...",
        },
        {
            title: "Venha aprender maneiras sobre como economizar água ",
            image: img1,
            buttonText: "Saiba mais...",
        },
        {
            title: "Quem são os criadores do AcquaSense?",
            image: contactImg,
            buttonText: "Saiba mais...",
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
            title: "Venha verificar 5 maneiras para aconomizar água",
            content: "Aprenda 5 maneiras para se conscientizar sobre o consumo de água.",
            image: img1
        },
        {
            title: "Como economizar água pode beneficiar financeiramente?",
            content: "Entenda os benefícios financeiros ao economizar água em sua residência.",
            image: img2
        },
        {
            title: "Como o AcquaSense vai realizar o monitoramento de água?",
            content: "Venha entender as tecnologias usadas para realização do monitoramento de água.",
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
                    <li className="no-hover">
                        <a href="#home">
                            <img src={logoAcquaSense} alt="Logo AcquaSense" className="logo" />
                        </a>
                     </li>
                    <li><a href="#about">Sobre Nós</a></li>
                    <li><a href="#services">Serviços</a></li>
                    <li><a href="#news">Notícias</a></li>
                    <li><a href="#contact">Contato</a></li>
                    <li><a href="/login">Portal do Cliente</a></li>

                    <li><a href="https://api.whatsapp.com/send?phone=5585991541634&text=Gostaria%20de%20economizar%20%C3%A1gua!" target="_blank" rel="noopener noreferrer">Fale conosco</a></li>
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
            <h2 className='animated-text'>
                <span className='stroke-text'>AcquaSense</span>
                <span className='fill-text'>AcquaSense</span>
            </h2> 
            <p>Com AcquaSense, economizar água é tão fácil quanto virar a torneira.</p>
        </section>

        <section id="about" className="about">
            <h2>Sobre Nós</h2>
            <p></p>
            <p>Somos uma plataforma que monitora seu consumo de água em tempo real, alertando sobre excessos de consumo e possíveis vazamentos, tudo através de um celular, tablet ou computador.</p>
            <p></p>
            <p>o AcquaSense é capaz de fornecer informações sobre o consumo de água de forma diária, disponibilizando a visualização dos dados de hora em hora, com visão geral do dia. Ou de forma mensal, disponibilizando a visualização dia a dia, com visão geral do mês.</p>

        </section>

        <section id="services" className="services">
            <h2>Serviços</h2>
            <p></p>
            <p> AcquaSense é um sistema de monitoramento de consumo de água, que opera em tempo real. Utilizamos tecnologia de ponta em Internet das Coisas (IoT), que permite a comunicação constante entre dispositivos conectados à internet. Além disso, empregamos Inteligência Artificial para analisar e gerenciar o consumo de água, bem como detectar possíveis vazamentos</p>
            <p></p>
            <p>Além disso, o sistema fornece a visualização de forma gráfica comparações comportamentais de consumo entre meses ou entre anos, de forma intuitiva e simplista.</p>
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
                <p>Ficou com dúvida? Entre em contato conosco para mais informações.</p>
                <p>Email: contato@acquasense.com</p>
                <p>Telefone: (85) 3276-2854</p>
                <p>Endereço: Av. Washington Soares, 1321 - Edson Queiroz</p>
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

