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

    selectBudgetOption(minBudget, maxBudget) {
        // Return wrapped elements so the test can use them separately
        return cy.get('input[type="number"]').then(($input) => {
            const firstField = cy.wrap($input.eq(0));
            const secondField = cy.wrap($input.eq(1));

            // Type the values here
            firstField.clear().type(minBudget);
            secondField.clear().type(maxBudget);

            return cy.wrap({ firstField, secondField });
        });
    }

    locateAndChecktheSubjectButtons(buttonsToSelect) {
        cy.get('div.grid button').each(($btn) => {
            const buttonText = $btn.text().trim();
            if (buttonsToSelect.includes(buttonText)) {
                cy.wrap($btn)
                    .should('be.visible')
                    .click({ force: true });
            }
        });
    }

    // enterDetailsinLastForm(fileName, description) {
    //     cy.get('textarea[placeholder = "Please provide a summary of your project"]').should('be.visible').clear().type(description).should('have.value', description);

    //     cy.get('input[type="file"]').should('exist').selectFile(`cypress/fixtures/${fileName}`, { force: true });



    //     cy.get('input[type="file"]')
    //         .should(($input) => {
    //             const file = $input[0].files[0];
    //             expect(file.name).to.eq(fileName);
    //         });

    //     cy.get('svg[stroke="currentColor"][fill="none"][stroke-width="2"]').eq(1)
    //         .click({ force: true });

    //     if (fileName === 'corrupt.pdf') {
    //         cy.contains('p', 'The file you uploaded is not valid. Please upload a valid file.').should('be.visible');
    //     }
    //     cy.get('input[type = "checkbox"]').check({ force: true }).should('be.checked');
    // }

  enterDetailsinLastForm(fileName, description, expectedMessage = null) {
    // Fill project description
    cy.get('textarea[placeholder="Please provide a summary of your project"]')
      .should('be.visible')
      .clear()
      .type(description)
      .should('have.value', description);

    // Upload the file
    cy.get('input[type="file"]').should('exist')
      .selectFile(`cypress/fixtures/${fileName}`, { force: true });

    // Verify uploaded file name
    cy.get('input[type="file"]').should(($input) => {
        const file = $input[0].files[0];
        expect(file.name).to.eq(fileName);
    });

    // // Optional: click the cross/remove icon if needed
    // cy.get('svg[stroke="currentColor"][fill="none"][stroke-width="2"]').eq(1)
    //   .click({ force: true });

    // Check the required checkbox
    cy.get('input[type="checkbox"]').check({ force: true }).should('be.checked');

    // Click the Submit / Send Query button
    cy.get('button').contains('Send Enquiry').click({ force: true });

    // Assert expected message AFTER clicking submit
    if (expectedMessage) {
        cy.contains(expectedMessage, { timeout: 5000 }).should('be.visible');
    }
}
}

export default ContactUsPage;