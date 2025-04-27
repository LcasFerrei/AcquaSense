describe('Navegação no App Expo - Fluxo de Tutorial', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
      cy.visit('/');
    });
  
    it.only('Deve carregar a tela Inicio e redirecionar para Inicio2 após 5 segundos', () => {
      // Verifica se a imagem do logo está visível na tela Inicio
      cy.get('[data-testid="logo-image"]').should('be.visible');
  
      // Aguarda 5 segundos para o redirecionamento
      cy.wait(6000);
  
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
      cy.get('[data-testid="energetika-image"]').should('be.visible');
  
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

      
  });