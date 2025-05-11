describe('Navegação no App Expo - Fluxo de Tutorial', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
    cy.visit('/');
  });

  it('Deve carregar a tela Inicio e redirecionar para Inicio2 após 5 segundos', () => {
    // Verifica se a imagem do logo está visível na tela Inicio
    cy.get('[data-testid="logo-image"]').should('be.visible');

    // Aguarda 5 segundos para o redirecionamento
    cy.wait(5000);

    // Verifica se redirecionou para a tela Inicio2
    cy.get('[data-testid="title-text"]').should('have.text', 'Monitore seu consumo de água diário');
    cy.get('[data-testid="subtitle-text"]').should('have.text', 'Acompanhe diariamente a quantidade de litros que você consome');
    cy.get('[data-testid="energetika-image"]').should('be.visible');
  });

  it('Deve navegar da tela Inicio2 para Inicio3 ao clicar em Continuar', () => {
    // Aguarda o redirecionamento de Inicio para Inicio2
    cy.wait(6000);

    // Verifica se a tela Inicio2 está visível
    cy.get('[data-testid="title-text"]').should('have.text', 'Monitore seu consumo de água diário');
    cy.get('[data-testid="subtitle-text"]').should('have.text', 'Acompanhe diariamente a quantidade de litros que você consome');
    

    // Clica no botão "Continuar"
    cy.get('[data-testid="continue-button"]').click();

    // Verifica se redirecionou para a tela Inicio3
    cy.contains('Identifique vazamentos no seu apartamento').should('be.visible'); 
  });

  
it('Deve voltar da tela Inicio3 para Inicio2 ao clicar no botão de voltar', () => {
// Passa por Inicio → Inicio2 - Inicio3
cy.wait(6000); // Aguarda Inicio - Inicio2
cy.get('[data-testid="continue-button"]').click(); // Navega de Inicio2 - Inicio3

// Verifica se está na tela Inicio3
cy.get('[data-testid="titl-text"]').should('have.text', 'Identifique vazamentos no seu apartamento');

// Clica no botão de voltar
cy.get('[data-testid="back-button"]').click();

// Verifica se voltou para a tela Inicio2
cy.get('[data-testid="title-text"]').should('have.text', 'Monitore seu consumo de água diário');
cy.get('[data-testid="subtitle-text"]').should('have.text', 'Acompanhe diariamente a quantidade de litros que você consome');
cy.get('[data-testid="energetika-image"]').should('be.visible');
});

it('Deve navegar da tela Inicio3 para Inicio4 ao clicar em Continuar', () => {
// Passa por Inicio - Inicio2 - Inicio3
cy.wait(6000); // Aguarda Inicio - Inicio2
cy.get('[data-testid="continue-button"]').click(); // Navega de Inicio2  - Inicio3

// Verifica se está na tela Inicio3
cy.get('[data-testid="titl-text"]').should('have.text', 'Identifique vazamentos no seu apartamento');

// Clica no botão "Continuar" para ir para Inicio4
cy.get('[data-testid="continu-button"]').click();

// Verifica se redirecionou para a tela Inicio4
cy.contains('Digite a chave de acesso').should('be.visible'); 
});


it('Deve navegar da tela Inicio4 para Inicio5 ao clicar em Cadastrar', () => {
// Passa por Inicio → Inicio2 → Inicio3 → Inicio4
cy.wait(6000); // Aguarda Inicio → Inicio2
cy.get('[data-testid="continue-button"]').click(); // Navega de Inicio2 → Inicio3
cy.get('[data-testid="continu-button"]').click(); // Navega de Inicio3 → Inicio4

// Verifica se está na tela Inicio4
cy.get('[data-testid="tit-text"]').should('have.text', 'Digite a chave de acesso');
cy.contains('Apenas aqueles que já contrataram nossos serviços terão acesso à chave').should('be.visible');
cy.get('[data-testid="continue-button-inicio4"]').should('be.visible');

// Clica no botão "Cadastrar"
cy.get('[data-testid="continue-button-inicio4"]').click();

// Verifica se redirecionou para a tela Inicio5
cy.contains('Bem vindos ao AcquaSense').should('be.visible');
cy.contains('Uma solução de monitoramento em tempo real').should('be.visible');
cy.contains('Crie sua conta e acesse agora mesmo os nossos serviços').should('be.visible');
});

it('Deve preencher username e senha, alternar visibilidade da senha e clicar no botão entrar', () => {
  // Aguarda o carregamento inicial da primeira tela
  cy.get('[data-testid="continue-button"]', { timeout: 15000 }).should('exist');

  // Inicio2 → Inicio3
  cy.get('[data-testid="continue-button"]').click();
  cy.get('[data-testid="continu-button"]', { timeout: 10000 }).should('exist');

  // Inicio3 → Inicio4
  cy.get('[data-testid="continu-button"]').click();
  cy.get('[data-testid="tit-text"]', { timeout: 10000 }).should('have.text', 'Digite a chave de acesso');

  // Inicio4 → Inicio5
  cy.get('[data-testid="continue-button-inicio4"]').click();
  cy.contains('Bem vindos ao AcquaSense', { timeout: 10000 }).should('be.visible');

  // Inicio5 → Login
  cy.get('[data-testid="botao-criar-conta"]', { timeout: 10000 }).click();
  cy.screenshot('tela-login'); // Captura a tela para depuração

  // Verifica que está na tela de Login
  cy.get('[data-testid="login-screen"]', { timeout: 15000 }).should('exist');
  cy.get('[data-testid="input-username"]', { timeout: 10000 }).should('exist');
  cy.get('[data-testid="input-senha"]', { timeout: 10000 }).should('exist');
  cy.get('[data-testid="botao-entrar"]', { timeout: 10000 }).should('exist');

  // Preenche o campo de username com "Saul"
  cy.get('[data-testid="input-username"]').type('Saul');

  // Preenche o campo de senha com "acquasense"
  cy.get('[data-testid="input-senha"]').type('acquasense');

  // Verifica que a senha está inicialmente oculta
  cy.get('[data-testid="eye-icon-hidden"]', { timeout: 10000 }).should('exist');

  // Clica no botão para ver a senha
  cy.get('[data-testid="toggle-senha"]').click();

  // Verifica que a senha está visível
  cy.get('[data-testid="eye-icon-visible"]', { timeout: 10000 }).should('exist');

  // Clica novamente para ocultar a senha
  cy.get('[data-testid="toggle-senha"]').click();

  // Verifica que a senha está oculta novamente
  cy.get('[data-testid="eye-icon-hidden"]', { timeout: 10000 }).should('exist');

  // Clica no botão "Entrar"
  cy.get('[data-testid="botao-entrar"]').click();

  // Opcional: Verifica se a navegação para a próxima tela ocorreu (ajuste conforme necessário)
  // Exemplo: cy.get('[data-testid="dash-screen"]', { timeout: 15000 }).should('exist');
});



it('Deve alternar a visibilidade da senha ao clicar no ícone', () => {
  // Aguarda o carregamento inicial da primeira tela
  cy.get('[data-testid="continue-button"]', { timeout: 15000 }).should('exist');

  // Inicio2 → Inicio3
  cy.get('[data-testid="continue-button"]').click();
  cy.get('[data-testid="continu-button"]', { timeout: 10000 }).should('exist');

  // Inicio3 → Inicio4
  cy.get('[data-testid="continu-button"]').click();
  cy.get('[data-testid="tit-text"]', { timeout: 10000 }).should('have.text', 'Digite a chave de acesso');

  // Inicio4 → Inicio5
  cy.get('[data-testid="continue-button-inicio4"]').click();
  cy.contains('Bem vindos ao AcquaSense', { timeout: 10000 }).should('be.visible');

  // Inicio5 → Login
  cy.get('[data-testid="botao-criar-conta"]', { timeout: 10000 }).click();
  cy.screenshot('tela-login'); // Captura a tela para depuração

  // Verifica que está na tela de Login
  cy.get('[data-testid="login-screen"]', { timeout: 15000 }).should('exist');
  cy.get('[data-testid="input-senha"]', { timeout: 10000 }).should('exist');
  cy.get('[data-testid="botao-entrar"]', { timeout: 10000 }).should('exist');
  cy.wait(1000);
  // Digita uma senha
  cy.get('[data-testid="input-senha"]').type('MinhaSenha123');
  cy.wait(1000);
  // Verifica que a senha está inicialmente oculta
  cy.get('[data-testid="eye-icon-hidden"]', { timeout: 10000 }).should('exist');
  cy.wait(1000);
  // Clica no botão para ver a senha
  cy.get('[data-testid="toggle-senha"]').click();
  cy.wait(1000);
  // Verifica que a senha está visível
  cy.get('[data-testid="eye-icon-visible"]', { timeout: 10000 }).should('exist');
  cy.wait(1000);
  // Clica novamente para ocultar a senha
  cy.get('[data-testid="toggle-senha"]').click();

  // Verifica que a senha está oculta novamente
  cy.get('[data-testid="eye-icon-hidden"]', { timeout: 10000 }).should('exist');
});

it('Deve preencher username e senha, alternar visibilidade da senha, clicar no botão entrar e verificar a tela Dashboard', () => {

  // Aguarda o carregamento inicial da primeira tela
  cy.get('[data-testid="continue-button"]', { timeout: 15000 }).should('exist');

  // Inicio2 → Inicio3
  cy.get('[data-testid="continue-button"]').click();
  cy.get('[data-testid="continu-button"]', { timeout: 10000 }).should('exist');

  // Inicio3 → Inicio4
  cy.get('[data-testid="continu-button"]').click();
  cy.get('[data-testid="tit-text"]', { timeout: 10000 }).should('have.text', 'Digite a chave de acesso');

  // Inicio4 → Inicio5
  cy.get('[data-testid="continue-button-inicio4"]').click();
  cy.contains('Bem vindos ao AcquaSense', { timeout: 10000 }).should('be.visible');

  // Inicio5 → Login
  cy.get('[data-testid="botao-criar-conta"]', { timeout: 10000 }).click();
  cy.screenshot('tela-login'); // Captura a tela para depuração

  // Verifica que está na tela de Login
  cy.get('[data-testid="login-screen"]', { timeout: 15000 }).should('exist');
  cy.get('[data-testid="input-username"]', { timeout: 10000 }).should('exist');
  cy.get('[data-testid="input-senha"]', { timeout: 10000 }).should('exist');
  cy.get('[data-testid="botao-entrar"]', { timeout: 10000 }).should('exist');

  // Preenche o campo de username com "Saul"
  cy.get('[data-testid="input-username"]').type('Saul');

  // Preenche o campo de senha com "acquasense"
  cy.get('[data-testid="input-senha"]').type('acquasense');

  // Verifica que a senha está inicialmente oculta
  cy.get('[data-testid="eye-icon-hidden"]', { timeout: 10000 }).should('exist');

  // Clica no botão para ver a senha
  cy.get('[data-testid="toggle-senha"]').click();

  // Verifica que a senha está visível
  cy.get('[data-testid="eye-icon-visible"]', { timeout: 10000 }).should('exist');

  // Clica novamente para ocultar a senha
  cy.get('[data-testid="toggle-senha"]').click();

  // Verifica que a senha está oculta novamente
  cy.get('[data-testid="eye-icon-hidden"]', { timeout: 10000 }).should('exist');

  // Clica no botão "Entrar"
  cy.get('[data-testid="botao-entrar"]').click();

  // Aguarda a requisição de login mockada


  // Verifica se a tela Dashboard foi carregada e contém o texto "Dashboard"
  cy.get('[data-testid="dash-screen"]', { timeout: 15000 }).should('exist');
  cy.get('[data-testid="dash-title"]', { timeout: 10000 }).should('have.text', 'Dashboard');
  // Alternativamente, se o testID não estiver disponível:
  // cy.contains('Dashboard', { timeout: 10000 }).should('be.visible');
});

it.only('Deve preencher username e senha, alternar visibilidade, fazer login, verificar Dashboard, clicar no sino e verificar Notiview', () => {
 
  // Aguarda o carregamento inicial da primeira tela
  cy.get('[data-testid="continue-button"]', { timeout: 15000 }).should('exist');

  // Inicio2 → Inicio3
  cy.get('[data-testid="continue-button"]').click();
  cy.get('[data-testid="continu-button"]', { timeout: 10000 }).should('exist');

  // Inicio3 → Inicio4
  cy.get('[data-testid="continu-button"]').click();
  cy.get('[data-testid="tit-text"]', { timeout: 10000 }).should('have.text', 'Digite a chave de acesso');

  // Inicio4 → Inicio5
  cy.get('[data-testid="continue-button-inicio4"]').click();
  cy.contains('Bem vindos ao AcquaSense', { timeout: 10000 }).should('be.visible');

  // Inicio5 → Login
  cy.get('[data-testid="botao-criar-conta"]', { timeout: 10000 }).click();
  cy.screenshot('tela-login'); // Captura a tela para depuração

  // Verifica que está na tela de Login
  cy.get('[data-testid="login-screen"]', { timeout: 15000 }).should('exist');
  cy.get('[data-testid="input-username"]', { timeout: 10000 }).should('exist');
  cy.get('[data-testid="input-senha"]', { timeout: 10000 }).should('exist');
  cy.get('[data-testid="botao-entrar"]', { timeout: 10000 }).should('exist');

  // Preenche o campo de username com "Saul"
  cy.get('[data-testid="input-username"]').type('Saul');

  // Preenche o campo de senha com "acquasense"
  cy.get('[data-testid="input-senha"]').type('acquasense');

  // Clica no botão "Entrar"
  cy.get('[data-testid="botao-entrar"]').click();


  // Verifica se a tela Dashboard foi carregada e contém o texto "Dashboard"
  cy.get('[data-testid="dash-screen"]', { timeout: 15000 }).should('exist');
  cy.get('[data-testid="dash-title"]', { timeout: 10000 }).should('have.text', 'Dashboard');
  cy.screenshot('tela-dashboard'); // Captura a tela para depuração

  // Clica no botão de notificação (sino)
  cy.get('[data-testid="notification-button"]', { timeout: 10000 }).should('exist');
  cy.get('[data-testid="notification-button"]').click();

  // Verifica se a tela Notiview foi carregada
  cy.get('[data-testid="notiview-screen"]', { timeout: 15000 }).should('exist');
  cy.get('[data-testid="notiview-title"]', { timeout: 10000 }).should('have.text', 'Notificações');
  cy.screenshot('tela-notiview'); // Captura a tela para depuração
});

});



//npm install cypress --save-dev (Instalar o Cypress)
//npx cypress open (Configurar o Cypress)

//cy.visit()//: Navega para uma URL.
//cy.get()//: Seleciona elementos do DOM.
//cy.click()//: Simula cliques.
//cy.should()//: Faz asserções (ex.: verificar se um texto existe).
//cy.type()//: Insere texto em campos de entrada (ex.: formulários).
//cy.wait()//: Aguarda um tempo ou uma requisição (ex.: espera uma API responder).
//cy.contains()//: Seleciona elementos com base em seu conteúdo de texto.
//cy.url()//: Verifica ou obtém a URL atual da página.
//cy.intercept()//: Intercepta e manipula requisições de rede (ex.: mock de APIs).


