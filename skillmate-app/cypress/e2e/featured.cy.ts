

describe('Featured skills listing', () => {
  it('renders featured and allows navigating to a skill page', () => {
    cy.visit('/featured');

  
    cy.get('a[href^="/skills/"]').its('length').then((count) => {
      if (count > 0) {
        cy.get('a[href^="/skills/"]').first().click();
        cy.url().should('match', /\/skills\/\d+/);
        cy.get('h1').should('be.visible');
      } else {

        cy.contains(/featured skills/i).should('exist');
      }
    });
  });
});
