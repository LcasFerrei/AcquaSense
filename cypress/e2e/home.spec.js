describe('Home Page - Theme Toggle Functionality', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000'); // Ajuste a URL conforme necessário
    });
  
    it('should toggle between light and dark themes', () => {
      cy.get('body').should('have.attr', 'data-theme', 'light');
      cy.get('[data-testid="theme-toggle"]').click();
      cy.get('body').should('have.attr', 'data-theme', 'dark');
      cy.get('[data-testid="theme-toggle"]').click();
      cy.get('body').should('have.attr', 'data-theme', 'light');
    });
  });