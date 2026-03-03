// import ContactUsPage from "../../support/pageObjects/contactUs";

// describe('Contact Us Tests', () => {

//     let contactUsPage;
//     let contactData;

//     // Runs once before all tests
//     before(() => {
//         // Load fixture
//         cy.fixture('contact_us').then((data) => {
//             contactData = data;
//         });

//         // Initialize page object
//         contactUsPage = new ContactUsPage();
//     });

//     it('Contact us with empty fields', () => {
//         cy.visit(Cypress.env('baseUrl'));

//         contactUsPage.ProcesstoContactUsForm();

//         // Check the Next button and click on it
//         cy.contains('button', 'Next').should('exist').click({ force: true });

//         // Verify required field error messages
//         const expectedMessages = contactData.expectedErrorMessages;

//         cy.get('div.text-red-500 span').each(($el, index) => {
//             expect($el.text()).to.contain(expectedMessages[index]);
//         });
//     });

//     it('Contact us with valid fields', () => {
//         cy.visit(Cypress.env('baseUrl'));

//         contactUsPage.ProcesstoContactUsForm();

//         // Fill form with valid data
//         contactUsPage.enterFormDetails();

//         // Verify the next page loaded
//         cy.contains('h2', contactData.secondPageTitle).should('be.visible');

//         // Select date
//         const dateToSelect = contactData.dateToSelect; // "2026-03-04"
//         contactUsPage.selectdateusingCalendar(dateToSelect)
//             .then(($input) => {
//                 const htmlValue = $input.val();
//                 expect(htmlValue).to.eq(dateToSelect);

//                 // Convert to MM/DD/YYYY and assert frontend format
//                 const [year, month, day] = htmlValue.split('-');
//                 const formattedDate = `${month}/${day}/${year}`;
//                 expect(formattedDate).to.eq(contactData.expectedFrontEndDate);
//             });

//         // Select budget
//         contactUsPage.selectBudgetOption(contactData.minBudget, contactData.maxBudget)
//             .then(({ firstField, secondField }) => {
//                 firstField.should('have.value', contactData.minBudget);
//                 secondField.should('have.value', contactData.maxBudget);
//             });

//         // Click Next
//         cy.contains('button', 'Next').should('be.visible').click({ force: true });

//         // Verify next page title
//         cy.contains('h2', contactData.secondPageTitle).should('be.visible');

//         // Select services
//         contactUsPage.locateAndChecktheSubjectButtons(contactData.servicesToSelect);

//         // Click Next to go to last page
//         cy.contains('button', 'Next').should('be.visible').click({ force: true });

//         // Verify third page title
//         cy.contains('h2', contactData.thirdPageTitle).should('be.visible');

//         // Fill last form

//         const fileName = contactData.valid_fileName; // e.g., "testfile.pdf"
//         const description = contactData.projectDescription; // e.g., "This is a test project description."
//         contactUsPage.enterDetailsinLastForm(fileName, description);

//         // Uploading corrupt file
//         const corruptFileName = contactData.corrupt_fileName; // e.g., "corruptfile.pdf"
//         contactUsPage.enterDetailsinLastForm(corruptFileName,description);


//         // Submit
//         cy.get('button').contains(contactData.mainButtonText).should('be.visible').click({ force: true });

//         // Verify success popup
//         cy.contains(contactData.successMessage, { timeout: 8000 }).should('be.visible');

//         // Wait for auto-hide (optional)
//         cy.wait(4000);

//         // Ensure we are navigated away
//         cy.url().should('not.contain', '/start-project');
//     });
// });
import ContactUsPage from "../../support/pageObjects/contactUs";

describe('Contact Us Tests', () => {

    let contactUsPage;
    let contactData;

    before(() => {
        // Load fixture
        cy.fixture('contact_us').then((data) => {
            contactData = data;
        });

        // Initialize page object
        contactUsPage = new ContactUsPage();
    });

    it('Contact us with empty fields', () => {
        cy.visit(Cypress.env('baseUrl'));
        contactUsPage.ProcesstoContactUsForm();

        cy.contains('button', 'Next').should('exist').click({ force: true });

        const expectedMessages = contactData.expectedErrorMessages;
        cy.get('div.text-red-500 span').each(($el, index) => {
            expect($el.text()).to.contain(expectedMessages[index]);
        });
    });

    // Dynamically generate tests for each file
    it('Contact us with multiple file uploads', () => {
        cy.fixture('contact_us').then((contactData) => {
            contactData.files.forEach(({ fileName, description, expectedMessage }) => {
                // Wrap each file upload in Cypress "Cypress._.each" to ensure commands are queued
                cy.visit("https://www.venre.org/");

                contactUsPage.ProcesstoContactUsForm();

                contactUsPage.enterFormDetails();

                //Verify the next page is loaded 
                cy.contains('h2', contactData.secondPageTitle).should('be.visible');
                contactUsPage.selectdateusingCalendar(contactData.dateToSelect)
                    .then(($input) => {
                        const [year, month, day] = $input.val().split('-');
                        const formattedDate = `${month}/${day}/${year}`;
                        expect(formattedDate).to.eq(contactData.expectedFrontEndDate);
                    });

                contactUsPage.selectBudgetOption(contactData.minBudget, contactData.maxBudget)
                    .then(({ firstField, secondField }) => {
                        firstField.should('have.value', contactData.minBudget);
                        secondField.should('have.value', contactData.maxBudget);
                    });

                cy.contains('button', 'Next').click({ force: true });
                contactUsPage.locateAndChecktheSubjectButtons(contactData.servicesToSelect);
                cy.contains('button', 'Next').click({ force: true });
                cy.contains('h2', contactData.thirdPageTitle).should('be.visible');

                contactUsPage.enterDetailsinLastForm(fileName, description, expectedMessage);

                if (!expectedMessage) {
                    cy.get('button').contains(contactData.mainButtonText).click({ force: true });
                    cy.contains(contactData.successMessage, { timeout: 8000 }).should('be.visible');
                }

                // Reset to start page for next file
                cy.visit(Cypress.env('baseUrl'));
                contactUsPage.ProcesstoContactUsForm();
            });
        });
    });

});