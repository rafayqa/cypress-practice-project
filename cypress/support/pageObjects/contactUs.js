// 



class ContactUsPage {

    // Navigate from home to start project page
    ProcesstoContactUsForm() {
        cy.contains('a', 'Contact').should('exist').click({ force: true });
        cy.url().should('include', '/contact');

        cy.contains('a', "Start a Project").should('exist').click({ force: true });
        cy.url().should('include', '/start-project');
    }

    // Fill first form: Name, Email, Company, then click Next
    enterFormDetails({ name, email, company }) {
        const fields = [
            { placeholder: 'Name', value: name },
            { placeholder: 'Email', value: email },
            { placeholder: 'Company', value: company }
        ];

        fields.forEach(({ placeholder, value }) => {
            cy.get(`input[placeholder="${placeholder}"]`)
                .should('be.visible')
                .clear()
                .type(value)
                .should('have.value', value);
        });

        cy.contains('button', 'Next')
            .should('be.visible')
            .click({ force: true });
    }

    // Select date using calendar input
    selectdateusingCalendar(date) {
        return cy.get('input[type="date"]')
            .should('be.visible')
            .clear()
            .type(date)
            .trigger('change');
    }

    // Enter budget min and max
    selectBudgetOption(minBudget, maxBudget) {
        return cy.get('input[type="number"]').then(($input) => {
            const firstField = cy.wrap($input.eq(0)).clear().type(minBudget);
            const secondField = cy.wrap($input.eq(1)).clear().type(maxBudget);

            return cy.wrap({ firstField, secondField });
        });
    }

    // Select services from grid buttons
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

    // Enter project summary, upload file, check checkbox, and submit
    enterDetailsinLastForm({ fileName, description, expectedMessage = null }) {
        // Fill project description
        cy.get('textarea[placeholder="Please provide a summary of your project"]')
            .should('be.visible')
            .clear()
            .type(description)
            .should('have.value', description);

        // Upload file
        cy.get('input[type="file"]')
            .should('exist')
            .selectFile(`cypress/fixtures/${fileName}`, { force: true });

        // Verify uploaded file name
        cy.get('input[type="file"]').should(($input) => {
            const file = $input[0].files[0];
            expect(file.name).to.eq(fileName);
        });

        // Check the required checkbox
        cy.get('input[type="checkbox"]').check({ force: true }).should('be.checked');

        // Click the Submit / Send Query button
        cy.get('button').contains('Send Enquiry').click({ force: true });

        // Assert expected message after submit
        if (expectedMessage) {
            cy.contains(expectedMessage, { timeout: 5000 }).should('be.visible');
        }
    }
}

export default ContactUsPage;