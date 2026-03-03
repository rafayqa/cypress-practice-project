// import ContactUsPage from "../../support/pageObjects/contactUs";

// describe('Contact Us Tests', () => {

//     let contactUsPage;
//     let contactData;

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

//         cy.contains('button', 'Next').should('exist').click({ force: true });

//         const expectedMessages = contactData.expectedErrorMessages;
//         cy.get('div.text-red-500 span').each(($el, index) => {
//             expect($el.text()).to.contain(expectedMessages[index]);
//         });
//     });

//     // Dynamically generate tests for each file
//     it('Contact us with multiple file uploads', () => {
//         cy.fixture('contact_us').then((contactData) => {
//             contactData.files.forEach(({ fileName, description, expectedMessage }) => {
//                 // Wrap each file upload in Cypress "Cypress._.each" to ensure commands are queued
//                 cy.visit("https://www.venre.org/");

//                 contactUsPage.ProcesstoContactUsForm();

//                 contactUsPage.enterFormDetails();

//                 //Verify the next page is loaded 
//                 cy.contains('h2', contactData.secondPageTitle).should('be.visible');
//                 contactUsPage.selectdateusingCalendar(contactData.dateToSelect)
//                     .then(($input) => {
//                         const [year, month, day] = $input.val().split('-');
//                         const formattedDate = `${month}/${day}/${year}`;
//                         expect(formattedDate).to.eq(contactData.expectedFrontEndDate);
//                     });

//                 contactUsPage.selectBudgetOption(contactData.minBudget, contactData.maxBudget)
//                     .then(({ firstField, secondField }) => {
//                         firstField.should('have.value', contactData.minBudget);
//                         secondField.should('have.value', contactData.maxBudget);
//                     });

//                 cy.contains('button', 'Next').click({ force: true });
//                 contactUsPage.locateAndChecktheSubjectButtons(contactData.servicesToSelect);
//                 cy.contains('button', 'Next').click({ force: true });
//                 cy.contains('h2', contactData.thirdPageTitle).should('be.visible');

//                 contactUsPage.enterDetailsinLastForm(fileName, description, expectedMessage);

//                 if (!expectedMessage) {
//                     cy.get('button').contains(contactData.mainButtonText).click({ force: true });
//                     cy.contains(contactData.successMessage, { timeout: 8000 }).should('be.visible');
//                 }

//                 // Reset to start page for next file
//                 cy.visit(Cypress.env('baseUrl'));
//                 contactUsPage.ProcesstoContactUsForm();
//             });
//         });
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

        cy.contains('button', 'Next').click({ force: true });

        const expectedMessages = contactData.expectedErrorMessages;
        cy.get('div.text-red-500 span').each(($el, index) => {
            expect($el.text()).to.contain(expectedMessages[index]);
        });
    });

    it('Contact us with valid file', () => {
        const file = contactData.files[0];

        cy.visit(Cypress.env('baseUrl'));
        contactUsPage.ProcesstoContactUsForm();
        contactUsPage.enterFormDetails(contactData.formDetails);

        cy.contains('h2', contactData.secondPageTitle).should('be.visible');

        contactUsPage.selectdateusingCalendar(contactData.dateToSelect);
        contactUsPage.selectBudgetOption(contactData.minBudget, contactData.maxBudget);
        cy.contains('button', 'Next').click({ force: true });

        contactUsPage.locateAndChecktheSubjectButtons(contactData.servicesToSelect);
        cy.contains('button', 'Next').click({ force: true });
        cy.contains('h2', contactData.thirdPageTitle).should('be.visible');

        contactUsPage.enterDetailsinLastForm(file);

        // Assert success message
        cy.contains(contactData.successMessage, { timeout: 8000 }).should('be.visible');
    });

    it('Contact us with corrupt file', () => {
      const file = contactData.files[1];

        cy.visit(Cypress.env('baseUrl'));
        contactUsPage.ProcesstoContactUsForm();
        contactUsPage.enterFormDetails(contactData.formDetails);

        cy.contains('h2', contactData.secondPageTitle).should('be.visible');

        contactUsPage.selectdateusingCalendar(contactData.dateToSelect);
        contactUsPage.selectBudgetOption(contactData.minBudget, contactData.maxBudget);
        cy.contains('button', 'Next').click({ force: true });

        contactUsPage.locateAndChecktheSubjectButtons(contactData.servicesToSelect);
        cy.contains('button', 'Next').click({ force: true });
        cy.contains('h2', contactData.thirdPageTitle).should('be.visible');

        contactUsPage.enterDetailsinLastForm(file);

        // Assert expected error for corrupt file
        cy.contains(file.expectedMessage).should('be.visible');
    });

    it('Contact us with locked file', () => {
        const file = contactData.files[2];

        cy.visit(Cypress.env('baseUrl'));
        contactUsPage.ProcesstoContactUsForm();
        contactUsPage.enterFormDetails(contactData.formDetails);

        cy.contains('h2', contactData.secondPageTitle).should('be.visible');

        contactUsPage.selectdateusingCalendar(contactData.dateToSelect);
        contactUsPage.selectBudgetOption(contactData.minBudget, contactData.maxBudget);
        cy.contains('button', 'Next').click({ force: true });

        contactUsPage.locateAndChecktheSubjectButtons(contactData.servicesToSelect);
        cy.contains('button', 'Next').click({ force: true });
        cy.contains('h2', contactData.thirdPageTitle).should('be.visible');

        contactUsPage.enterDetailsinLastForm(file);

        // Assert expected error for locked file
        cy.contains(file.expectedMessage).should('be.visible');
    });

});