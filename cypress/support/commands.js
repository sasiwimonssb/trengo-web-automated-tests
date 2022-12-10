// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Cypress.Commands.add('login', () => {

//     cy.request({
//         url: 'https://app.trengo.com/auth/login',
//         method: 'POST', 
//         body: {
//             email: 'sasiwimon.ssb@gmail.com',
//             password: 'test1234'
//         }
//     })

// })

Cypress.Commands.add('login', (user) => {
    cy.session(
      user,
      () => {
        cy.visit('https://app.trengo.com/auth/login')
        cy.get('[name=email]').type(user.email)
        cy.get('[name=password]').type(user.password)
        cy.get('button').contains('Login').click()
        cy.url().should('include', '/tickets')
      },
    )
  })