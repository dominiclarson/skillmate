


function signupWith(email: string, first = 'Test', last = 'User', pwd = 'testtest') {
  cy.visit('/signup');
  cy.findByLabelText(/first name/i, { timeout: 2000 }).type(first).then(() => {});
  cy.findByLabelText(/last name/i, { timeout: 2000 }).type(last).then(() => {});
  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/password/i).type(pwd);
  cy.findByRole('button', { name: /sign up/i }).click();
  cy.url().should('match', /\/$/);
}

function loginWith(email: string, pwd = 'testtest') {
  cy.visit('/login');
  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/password/i).type(pwd);
  cy.findByRole('button', { name: /login/i }).click();
  cy.url().should('match', /\/$/);
}

describe('Sessions flow', () => {
  const teacherEmail = `teacher_${Date.now()}@example.com`;
  const studentEmail = `student_${Date.now()}@example.com`;
  const pwd = 'testtest';

  it('student requests, teacher accepts, student deletes', () => {
    
    signupWith(teacherEmail, 'Teach', 'Er', pwd);

   
    cy.visit('/post-request');
    // Choose a skill card 
    cy.get('.grid button, [role="button"]').first().click({ force: true }).then(() => {});
    // Description
    cy.get('textarea').first().type('Intro lesson');
   
    cy.findByRole('button', { name: /post skill/i }).click().then(() => {});



    signupWith(studentEmail, 'Stu', 'Dent', pwd);

   
    cy.visit('/featured');
    cy.get('a[href^="/skills/"]').its('length').then((count) => {
      if (!count) {
        
        cy.log('No skills available to book');
        return;
      }
      cy.get('a[href^="/skills/"]').first().click();
      cy.url().should('match', /\/skills\/\d+/);

      
      cy.contains(/book 1-hour lesson|request lesson|book/i).first().click();

      
      cy.localDateTimeString(1, 15).then((local) => {
        cy.findByLabelText(/start/i).type(local);
      });
     
      cy.get('textarea').first().type('See you soon!');
      cy.findByRole('button', { name: /create request/i }).click();
    });

 
    cy.findByRole('button', { name: /logout/i }).click();
    loginWith(teacherEmail, pwd);
    cy.visit('/sessions');
    cy.findByRole('button', { name: /as teacher/i }).click({ force: true }).then(() => {});
    cy.findByRole('button', { name: /accept/i }).first().click({ force: true }).then(() => {});

    
    cy.findByRole('button', { name: /logout/i }).click();
    loginWith(studentEmail, pwd);
    cy.visit('/sessions');
    cy.findByRole('button', { name: /as student/i }).click({ force: true }).then(() => {});
    cy.findByRole('button', { name: /delete/i }).first().click({ force: true }).then(() => {});
  });
});
