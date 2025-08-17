





describe('Auth flow', () => {
  it('user can sign up, log out, and log back in', () => {
    const email = `user_${Date.now()}@example.com`;
    const pwd = 'testtest';

    // Sign up
    cy.visit('/signup');
   
    cy.findByLabelText(/first name/i, { timeout: 2000 }).type('Test').then(() => {});
    cy.findByLabelText(/last name/i, { timeout: 2000 }).type('User').then(() => {});

    cy.findByLabelText(/email/i).type(email);
    cy.findByLabelText(/password/i).type(pwd);
    cy.findByRole('button', { name: /sign up/i }).click();

    cy.url().should('match', /\/$/);

    // Logout
    cy.findByRole('button', { name: /logout/i }).click();

    // Login
    cy.visit('/login');
    cy.findByLabelText(/email/i).type(email);
    cy.findByLabelText(/password/i).type(pwd);
    cy.findByRole('button', { name: /login/i }).click();
    cy.url().should('match', /\/$/);
  });
});
