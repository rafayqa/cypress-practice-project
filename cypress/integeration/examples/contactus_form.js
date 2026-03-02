import ContactUsPage from "../../support/pageObjects/contactUs";

describe('Landing Page Tests', () => {



    let contactUsPage;

    // Runs once before all tests
    before(() => {
        contactUsPage = new ContactUsPage();
    });


    it('Contact us with empty fields', () => {

        cy.visit("https://www.venre.org/");

        contactUsPage.ProcesstoContactUsForm();

        // Check the Next button and click on it 

        cy.contains('button', 'Next').should('exist').click({ force: true });

        // Check for the error message for the required fields
        cy.get('div.text-red-500 span').each(($el, index, $list) => {
            const expectedMessages = [
                'Name is required',
                'Email is required',
                'Company name is required'
            ];

            // Verify each error message
            expect($el.text()).to.contain(expectedMessages[index]);
        });

    });


    it('Contact us with valid fields', () => {
        cy.visit("https://www.venre.org/");

        contactUsPage.ProcesstoContactUsForm();

        contactUsPage.enterFormDetails();

        //Verify the next page is loaded 

        cy.contains('h2', 'Let’s talk budget')



        const dateToSelect = '2026-03-04';
        contactUsPage.selectdateusingCalendar(dateToSelect);

        const expectedFrontendDate = "03/04/2026"; // MM/DD/YYYY

        contactUsPage.selectdateusingCalendar(dateToSelect)
            .then(($input) => {
                // Cypress automatically passes the wrapped input here
                const htmlValue = $input.val();  // should be "2026-03-04"
                expect(htmlValue).to.eq(dateToSelect); // optional check

                // Convert to MM/DD/YYYY
                const [year, month, day] = htmlValue.split('-');
                const formattedDate = `${month}/${day}/${year}`;

                // Assert frontend format
                expect(formattedDate).to.eq(expectedFrontendDate);
            });

        contactUsPage.selectBudgetOption().then(({ firstField, secondField }) => {
            firstField.should('have.value', '45');
            secondField.should('have.value', '80');
        });

        //Click on Next Icon 

        cy.get('button').contains('Next').should('be.visible').click({ force: true });

        // Verify the next page is loaded
        cy.contains('h2', 'What services do you require?').should('be.visible');

        const buttonsToSelect = ["UX/UI Design", "AI Consulting", "Product Strategy"];

        cy.get('div.grid button').each(($btn) => {
            const buttonText = $btn.text().trim(); // get the visible text
            if (buttonsToSelect.includes(buttonText)) {
                cy.wrap($btn)
                    .should('be.visible')
                    .click({ force: true });
            }
        });

        // //Click on Back icon and verify the back page content 

        // cy.contains('button', 'Back').should('be.visible').click({ force: true });

        // cy.contains('h2', 'Let’s talk budget').should('be.visible');

        cy.contains('button', 'Next').should('be.visible').click({ force: true });

        cy.contains('h2', 'Give us the deets!').should('be.visible');

        cy.get('textarea[placeholder = "Please provide a summary of your project"]').should('be.visible').type('This is a test project description.').should('have.value', 'This is a test project description.');

        cy.get('input[type="file"]').should('exist').selectFile('cypress/fixtures/test_file.pdf', { force: true });

        cy.get('input[type="file"]')
            .should(($input) => {
                const file = $input[0].files[0];
                expect(file.name).to.eq('test_file.pdf');
            });
        cy.get('input[type = "checkbox"]').check({ force: true }).should('be.checked');


        cy.get('button').contains('button', 'Send Enquiry').should('be.visible').click({ force: true });

        cy.wait(4000);

        cy.url().should('not.contain', '/start-project'); // Ensure we are not on the contact-us page anymore


        // buttonsToSelect.forEach((text) => {
        //     cy.contains('div.grid button', text)
        //         .click({ force: true })
        //         .find('span svg')
        //         .should('exist');
        // });


    });
});