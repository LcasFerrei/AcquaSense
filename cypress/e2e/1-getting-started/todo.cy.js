describe('Testes da Página Inicial', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  // Teste existente do "theme-toggle"
  describe('Funcionalidade de Alternância de Tema', () => {
    it.only('deve alternar entre os temas claro e escuro', () => {
      cy.get('body').should('not.have.class', 'dark-mode', { message: 'O tema inicial deve ser claro (sem a classe dark-mode)' });
      cy.get('#theme-toggle').should('contain.text', 'Modo Escuro', { message: 'O botão deve exibir "Modo Escuro" inicialmente' });
      cy.get('#theme-toggle i').should('have.class', 'fa-moon', { message: 'O ícone inicial deve ser de lua (fa-moon)' });

      cy.get('#theme-toggle').click();
      cy.get('body').should('have.class', 'dark-mode', { message: 'O tema deve mudar para escuro (com a classe dark-mode)' });
      cy.get('#theme-toggle').should('contain.text', 'Modo Claro', { message: 'O botão deve exibir "Modo Claro" após a mudança' });
      cy.get('#theme-toggle i').should('have.class', 'fa-sun', { message: 'O ícone deve mudar para sol (fa-sun)' });

      cy.get('#theme-toggle').click();
      cy.get('body').should('not.have.class', 'dark-mode', { message: 'O tema deve voltar para claro (sem a classe dark-mode)' });
      cy.get('#theme-toggle').should('contain.text', 'Modo Escuro', { message: 'O botão deve voltar a exibir "Modo Escuro"' });
      cy.get('#theme-toggle i').should('have.class', 'fa-moon', { message: 'O ícone deve voltar para lua (fa-moon)' });
    });
  });

  // Teste do Carrossel de Banners
  describe('Funcionalidade do Carrossel de Banners', () => {
    it('deve exibir o banner inicial e permitir navegação', () => {
      // Verifica o banner inicial
      cy.get('.banner-carousel .banner-content h2')
        .should('contain.text', 'Qual a importância da conscientização sobre o consumo de água?', { message: 'O título do banner inicial está incorreto' });
      cy.get('.banner-carousel .banner-content button')
        .should('contain.text', 'Saiba mais...', { message: 'O botão do banner inicial deve exibir "Saiba mais..."' });

      // Verifica se há 3 indicadores (bolinhas)
      cy.get('.banner-carousel .indicators span')
        .should('have.length', 3, { message: 'Deve haver 3 indicadores no carrossel de banners' });

      // Clica no segundo indicador (índice 1) para mudar o slide
      cy.get('.banner-carousel .indicators span').eq(1).click();
      cy.get('.banner-carousel .banner-content h2')
        .should('contain.text', 'Sistema de Monitoramento de Água: Qual a Importância?', { message: 'O título do segundo banner está incorreto' });

      // Clica no botão "Saiba mais..." e verifica o redirecionamento
      cy.get('.banner-carousel .banner-content button').click();
      cy.url().should('eq', 'https://acquasense-jypoxjb.gamma.site/', { message: 'O botão "Saiba mais..." deve redirecionar para a URL correta' });
    });
  });

  // Teste do Carrossel de Notícias
  describe('Funcionalidade do Carrossel de Notícias', () => {
    it.only('deve exibir a notícia inicial e mudar para a próxima', () => {
      // Verifica a notícia inicial
      cy.get('#news .news-article h3')
        .should('contain.text', 'Venha verificar 5 maneiras para economizar água', { message: 'O título da notícia inicial está incorreto' });
      cy.get('#news .news-article p')
        .should('contain.text', 'Aprenda 5 maneiras para se conscientizar sobre o consumo de água.', { message: 'O conteúdo da notícia inicial está incorreto' });

      // Simula a mudança para a próxima notícia (o carrossel muda automaticamente a cada 5s)
      cy.wait(5000); // Espera 5 segundos para o carrossel mudar (ajuste conforme necessário)
      cy.get('#news .news-article h3')
        .should('contain.text', 'Como economizar água pode beneficiar financeiramente?', { message: 'O título da segunda notícia está incorreto' });
      cy.get('#news .news-article p')
        .should('contain.text', 'Entenda os benefícios financeiros ao economizar água em sua residência.', { message: 'O conteúdo da segunda notícia está incorreto' });
    });
  });

  // Teste de Navegação do Menu
  describe('Funcionalidade do Menu de Navegação', () => {
    it.only('deve navegar para diferentes seções da página', () => {
      // Verifica se o link "Sobre Nós" leva à seção correta
      cy.get('nav ul li a[href="#about"]').click();
      cy.get('#about').should('be.visible', { message: 'A seção "Sobre Nós" deve estar visível' });
      cy.get('#about h2').should('contain.text', 'Sobre Nós', { message: 'O título da seção "Sobre Nós" está incorreto' });

      // Verifica se o link "Serviços" leva à seção correta
      cy.get('nav ul li a[href="#services"]').click();
      cy.get('#services').should('be.visible', { message: 'A seção "Serviços" deve estar visível' });
      cy.get('#services h2').should('contain.text', 'Serviços', { message: 'O título da seção "Serviços" está incorreto' });

      // Verifica se o link "Notícias" leva à seção correta
      cy.get('nav ul li a[href="#news"]').click();
      cy.get('#news').should('be.visible', { message: 'A seção "Notícias" deve estar visível' });
      cy.get('#news h2').should('contain.text', 'Notícias', { message: 'O título da seção "Notícias" está incorreto' });

      // Verifica se o link "Contato" leva à seção correta
      cy.get('nav ul li a[href="#contact"]').click();
      cy.get('#contact').should('be.visible', { message: 'A seção "Contato" deve estar visível' });
      cy.get('#contact h2').should('contain.text', 'Contato', { message: 'O título da seção "Contato" está incorreto' });

      // Verifica se o link "Portal do Cliente" redireciona para /login
      cy.get('#portalCliente').click();
      cy.url().should('include', '/login', { message: 'O link "Portal do Cliente" deve redirecionar para /login' });

      // Volta para a página inicial para testar o link "Fale conosco"
      cy.visit('http://localhost:3000');

      // Verifica se o link "Fale conosco" abre o WhatsApp
      cy.get('nav ul li a[href*="api.whatsapp.com"]').should('have.attr', 'href')
        .and('eq', 'https://api.whatsapp.com/send?phone=5585991541634&text=Gostaria%20de%20economizar%20%C3%A1gua!', { message: 'O link "Fale conosco" deve apontar para a URL correta do WhatsApp' });
    });
  });

  // Teste do Botão "Voltar ao Topo"
  describe('Funcionalidade do Botão "Voltar ao Topo"', () => {
    it('deve aparecer após rolar a página e voltar ao topo ao ser clicado', () => {
      // Verifica se o botão não está visível inicialmente
      cy.get('#back-to-top').should('not.be.visible', { message: 'O botão "Voltar ao Topo" não deve estar visível inicialmente' });

      // Rola a página para baixo (mais de 300px)
      cy.scrollTo(0, 500);
      cy.get('#back-to-top').should('be.visible', { message: 'O botão "Voltar ao Topo" deve aparecer após rolar a página' });

      // Clica no botão e verifica se a página voltou ao topo
      cy.get('#back-to-top').click();
      cy.window().its('scrollY').should('eq', 0, { message: 'A página deve voltar ao topo após clicar no botão' });

      // Verifica se o botão desapareceu após voltar ao topo
      cy.get('#back-to-top').should('not.be.visible', { message: 'O botão "Voltar ao Topo" deve desaparecer após voltar ao topo' });
    });
  });

  // Teste de Visibilidade das Seções
  describe('Visibilidade das Seções', () => {
    it.only('deve exibir todas as seções principais com o conteúdo correto', () => {
      // Verifica a seção "Sobre Nós"
      cy.get('#about').should('be.visible', { message: 'A seção "Sobre Nós" deve estar visível' });
      cy.get('#about h2').should('contain.text', 'Sobre Nós', { message: 'O título da seção "Sobre Nós" está incorreto' });
      cy.get('#about p').first()
        .should('contain.text', 'Somos uma plataforma que monitora seu consumo de água em tempo real', { message: 'O conteúdo da seção "Sobre Nós" está incorreto' });

      // Verifica a seção "Serviços"
      cy.get('#services').should('be.visible', { message: 'A seção "Serviços" deve estar visível' });
      cy.get('#services h2').should('contain.text', 'Serviços', { message: 'O título da seção "Serviços" está incorreto' });
      cy.get('#services p').first()
        .should('contain.text', 'AcquaSense é um sistema de monitoramento de consumo de água', { message: 'O conteúdo da seção "Serviços" está incorreto' });

      // Verifica a seção "Notícias"
      cy.get('#news').should('be.visible', { message: 'A seção "Notícias" deve estar visível' });
      cy.get('#news h2').should('contain.text', 'Notícias', { message: 'O título da seção "Notícias" está incorreto' });

      // Verifica a seção "Perguntas Frequentes"
      cy.get('#faq').should('be.visible', { message: 'A seção "Perguntas Frequentes" deve estar visível' });
      cy.get('#faq h2').should('contain.text', 'Perguntas Frequentes', { message: 'O título da seção "Perguntas Frequentes" está incorreto' });
      cy.get('#faq .faq-item h3').first()
        .should('contain.text', 'Como economizar água em casa?', { message: 'O título da primeira pergunta frequente está incorreto' });

      // Verifica a seção "Avaliações de Clientes"
      cy.get('#reviews').should('be.visible', { message: 'A seção "Avaliações de Clientes" deve estar visível' });
      cy.get('#reviews h2').should('contain.text', 'Avaliações de Clientes', { message: 'O título da seção "Avaliações de Clientes" está incorreto' });
      cy.get('#reviews .review-item').should('have.length', 4, { message: 'Deve haver 4 avaliações de clientes' });
      cy.get('#reviews .review-item p').first()
        .should('contain.text', 'O AcquaSense revolucionou nossa forma de economizar água', { message: 'O conteúdo da primeira avaliação está incorreto' });

      // Verifica a seção "Contato"
      cy.get('#contact').should('be.visible', { message: 'A seção "Contato" deve estar visível' });
      cy.get('#contact h2').should('contain.text', 'Contato', { message: 'O título da seção "Contato" está incorreto' });
      cy.get('#contact .contact-text p').eq(1)
        .should('contain.text', 'Email: contato@acquasense.com', { message: 'O email na seção "Contato" está incorreto' });
    });
  });
});