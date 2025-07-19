describe('Authentication E2E Flows', () => {
  const timestamp = Date.now();
  const testUser = { email: `cypress_${timestamp}@test.com`, password: 'Passw0rd!' };

  it('signs up and stays logged in', () => {
    cy.visit('/signup');
    cy.get('input[placeholder="Email"]').type(testUser.email);
    cy.get('input[placeholder="Password"]').type(testUser.password);
    cy.contains('Sign Up').click();
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    cy.contains('Logout').should('be.visible');
  });

  it('logs out and logs back in', () => {
    cy.contains('Logout').click();
    cy.url().should('include', '/login');
    cy.visit('/login');
    cy.get('input[placeholder="Email"]').type(testUser.email);
    cy.get('input[placeholder="Password"]').type(testUser.password);
    cy.contains('Log In').click();
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    cy.contains('Logout').should('be.visible');
  });
});