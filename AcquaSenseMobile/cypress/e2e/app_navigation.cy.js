describe('Navegação no App Expo - Fluxo de Tutorial', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('Deve carregar a tela Inicio e redirecionar para Inicio2 após 5 segundos', () => {
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
      
  });