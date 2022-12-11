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