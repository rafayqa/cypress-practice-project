class ContactUsPage {

    ProcesstoContactUsForm() {

        // Check for contact us button
        cy.contains('a', 'Contact').should('exist').click({ force: true });

        //Check for the navigation by checking url 
        cy.url().should('include', '/contact');

        // Check for Start a Project button
        cy.contains('a', "Start a Project").should('exist').click({ force: true });

        // Check for the navigation by checking url
        cy.url().should('include', '/start-project');
    }

    enterFormDetails() {
        // Name input
        cy.get('input[placeholder="Name"]')
            .should('be.visible')
            .type('John Doe')
            .should('have.value', 'John Doe');

        // Email input
        cy.get('input[placeholder="Email"]')
            .should('be.visible')
            .type('testauto@example.com')
            .should('have.value', 'testauto@example.com');

        // Company input
        cy.get('input[placeholder="Company"]')
            .should('be.visible')
            .type('Test Company')
            .should('have.value', 'Test Company');

        // Click the Next button
        cy.contains('button', 'Next')
            .should('be.visible')
            .click({ force: true });
    }

    selectdateusingCalendar(date) {

        return cy.get('input[type="date"]')
            .should('be.visible')
            .clear()          // clear existing value
            .type(date) // types the date in YYYY-MM-DD
            .trigger('change'); // trigger onChange

    }

    selectBudgetOption() {
        // Return wrapped elements so the test can use them separately
        return cy.get('input[type="number"]').then(($input) => {
            const firstField = cy.wrap($input.eq(0));
            const secondField = cy.wrap($input.eq(1));

            // Type the values here
            firstField.clear().type('45');
            secondField.clear().type('80');

            return cy.wrap({ firstField, secondField });
        });
    }
}

export default ContactUsPage;