describe('Teste AcquaSense Mobile', () => {
    it('Deve exibir a logo e redirecionar corretamente', () => {
        cy.visit('http://localhost:8081'); 
        cy.get('img') 
          .should('be.visible');
        
        cy.wait(5000); 
        cy.url().should('include', 'Inicio2'); 
    });
});
