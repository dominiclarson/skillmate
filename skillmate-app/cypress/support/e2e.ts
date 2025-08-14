

/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      localDateTimeString(daysAhead?: number, hour?: number): Chainable<string>;
    }
  }
}

// Registers commands like cy.findByRole / cy.findByLabelText
import '@testing-library/cypress/add-commands';

// Example custom helper returning a Chainable<string>
Cypress.Commands.add('localDateTimeString', (daysAhead = 1, hour = 15) => {
  const dt = new Date(Date.now() + daysAhead * 24 * 3600 * 1000);
  dt.setMinutes(0, 0, 0);
  dt.setHours(hour);
  const pad = (n: number) => String(n).padStart(2, '0');
  const local =
    `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}` +
    `T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  return cy.wrap(local);
});
