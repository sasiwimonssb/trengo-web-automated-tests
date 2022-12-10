describe('Cypress Testing', () => {

  beforeEach('login to the app', () => {
    cy.login({ email: Cypress.env('email'), password: Cypress.env('password')})
  })

  it('create custom channel and check message', () => {
    // set channel name
    const channelName = 'Channel#' + Date.now()

    cy.intercept('POST', '/api/v2/channels').as('createChannel')

    cy.visit('https://app.trengo.com/admin/channels2/custom')

    cy.get('button').contains('Connect Custom channel').click()

    // create channel 
    cy.get('.box-header').contains('General')
      .get('label').contains('Internal name:').parents('.box-body').find('input').clear().type(channelName)

    cy.get('button').contains('Create channel').click()

    cy.wait('@createChannel').then((intercept) => {
      console.log(intercept.response)
      // channel identifier
      const channel = intercept.response.body.username

      // have a message come into the channel
      cy.request({
        method: 'POST',
        url: 'https://app.trengo.com/api/v2/custom_channel_messages', // baseUrl is prepend to URL
        body: {

          "channel": channel, 
          "contact": {
            "name": "John Doe",
            "email": "john@email.com",
            "identifier": "custom-ADJtTlr18TR11"
          },
          "body": {
            "text": "Lorem ipsum dolar samit."
          },
          "attachments": [{
            "url": "https://website.com/example.jpg",
            "name": "example.jpg"
          }]

        },
        headers: {
          Authorization: `Bearer ${Cypress.env('token')}`
        }
      }).then((res) => {
        expect(res.status).to.eq(200)

        // open an inbox to see message
        cy.get('[data-test="main-navigation-inbox"]').click().wait(500)

        // select the channel
        cy.get('.flex h6').contains('Channels').parents('.collapse-container').find('div span').contains(channelName).click({ force: true })

        // open the message
        cy.get('#ticket-list').click()
      })
    })
  })

  it('create team', () => {
    // set team name
    const teamName = 'Team#' + Date.now()

    cy.visit('https://app.trengo.com/admin/teams').wait(500)
    cy.get('button').contains('Create a team').click()

    cy.get('[placeholder="Sales Team"]').type(teamName)

    cy.get('[placeholder="Select one or more users"]').click()
      .get('.multiselect__element').contains('Sasiwimon Saksomboon').click()

    cy.get('[placeholder="Select one or more channels"]').click().type('channel')
      .get('.multiselect__element').contains('Channel').click()

    cy.get('button').contains('Create team').click({force: true})

    // verify if the team is created
    cy.get('#settings-primary').find('.row-inner').should('contain', teamName)
  })
})
