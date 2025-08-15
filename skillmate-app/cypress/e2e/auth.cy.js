





describe('Sign Up & Log In Flows', () => {
  const timestamp = Date.now();
  const email = `user${timestamp}@example.com`;
  const password = 'Password123!';

  it('allows a new user to sign up', () => {
    cy.visit('/signup');
    cy.get('input[type="email"]').clear().type(email);
    cy.get('input[type="password"]').clear().type(password);
    cy.contains('Sign Up').click();

    // After signup, should land on home 
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.contains('Logout');
  });

  it('allows the same user to log out and then log back in', () => {
    
    cy.get('body').then($body => {
      if ($body.find('button:contains("Logout")').length) {
        cy.contains('Logout').click();
      }
    });

    
    cy.visit('/login');
    cy.get('input[type="email"]').clear().type(email);
    cy.get('input[type="password"]').clear().type(password);
    cy.contains('Log In').click();

  
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.contains('Logout');
  });
});
