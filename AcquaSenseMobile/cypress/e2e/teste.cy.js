describe('Teste AcquaSense Mobile', () => {
    it('Deve exibir a logo e redirecionar corretamente', () => {
        cy.visit('http://localhost:8081'); 
        cy.get('img') 
          .should('be.visible');
        
        cy.wait(5000); 
        cy.url().should('include', 'Inicio2'); 
    });

    it('Ao clicar no botão e redirecionando para Inicio3',() => {
      cy.visit('http://localhost:8081/Inicio2');
      cy.get('Text')
      .contains('Continuar')
      .click()

      cy.wait(3000)
      cy.url().should('include', 'Inicio3')
    })

    it('Ao clicar no botão e redirecionando para Inicio2', () => {
      cy.visit('http://localhost:8081/Inicio3');
      cy.get('Text')
      .contains('❮')
      .click()

      cy.wait(3000)
      cy.url().should('include', 'Inicio2')
       
    })

    it('Ao clicar no botão e redirecionando para Inicio4', () =>{
      cy.visit('http://localhost:8081/Inicio2');
      cy.get('Text')
      .contains('Continuar')
      .click()

      cy.wait(3000)
      cy.url().should('include', 'Inicio4')
      
    })

    it('Deve exibir o formulário de registro e alternar para login', () => {
      cy.visit('http://localhost:8081/login');
      cy.contains('Crie sua conta aqui').should('be.visible');
      cy.get('input[placeholder="Nome"]').should('be.visible');
      cy.get('input[placeholder="Sobrenome"]').should('be.visible');
      cy.contains('Login').click();
      cy.contains('Seja bem vindo').should('be.visible');
      cy.get('input[placeholder="Nome"]').should('not.exist');
    });

    it('Deve redirecionar para "dash" ao clicar em "Cadastrar', ()=>{
      cy.visit('http://localhost:8081/login');
      cy.get('input[placeholder="Email"]').type('lucas@unifor.br');
      cy.get('input[placeholder="Senha"]').type('12345678');
      cy.contains('Entrar').click();
      cy.url().should('include', 'dash');


    })
});
