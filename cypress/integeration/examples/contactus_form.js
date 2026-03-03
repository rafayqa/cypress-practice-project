// import ContactUsPage from "../../support/pageObjects/contactUs";

// describe('Contact Us Tests',function () {

//     let contactUsPage;

//     // Runs once before all tests
//     before(function() {
//         cy.fixture('contact_us').then(function (data) {
//             // Use the fixture data as needed
//             this.contact_us = data;
//         });
//         contactUsPage = new ContactUsPage();

//     });


//     it('Contact us with empty fields', function() {

//         cy.visit("https://www.venre.org/");

//         contactUsPage.ProcesstoContactUsForm();

//         // Check the Next button and click on it 

//         cy.contains('button', 'Next').should('exist').click({ force: true });

//         // Check for the error message for the required fields
//         cy.get('div.text-red-500 span').each(($el, index, $list) => {
//             const expectedMessages = [
//                 'Name is required',
//                 'Email is required',
//                 'Company name is required'
//             ];

//             // Verify each error message
//             expect($el.text()).to.contain(expectedMessages[index]);
//         });

//     });


//     it('Contact us with valid fields', function() {
//         cy.visit("https://www.venre.org/");

//         contactUsPage.ProcesstoContactUsForm();

//         contactUsPage.enterFormDetails();

//         //Verify the next page is loaded 

//         cy.contains('h2',this.contact_us.secondPageTitle)



//         const dateToSelect = this.contact_us.dateToSelect; // "2026-03-04"
//         contactUsPage.selectdateusingCalendar(dateToSelect);

//         const expectedFrontendDate = this.contact_us.expectedFrontEndDate; // MM/DD/YYYY

//         contactUsPage.selectdateusingCalendar(dateToSelect)
//             .then(($input) => {
//                 // Cypress automatically passes the wrapped input here
//                 const htmlValue = $input.val();  // should be "2026-03-04"
//                 expect(htmlValue).to.eq(dateToSelect); // optional check

//                 // Convert to MM/DD/YYYY
//                 const [year, month, day] = htmlValue.split('-');
//                 const formattedDate = `${month}/${day}/${year}`;

//                 // Assert frontend format
//                 expect(formattedDate).to.eq(expectedFrontendDate);
//             });
//         const minBugdet = this.contact_us.minBudget;
//         const maxBudget = this.contact_us.maxBudget;

//         contactUsPage.selectBudgetOption(minBugdet, maxBudget).then(({ firstField, secondField }) => {
//             firstField.should('have.value', this.contact_us.minBudget);
//             secondField.should('have.value', this.contact_us.maxBudget);
//         });

//         //Click on Next Icon 

//         cy.get('button').contains('Next').should('be.visible').click({ force: true });

//         // Verify the next page is loaded
//         cy.contains('h2', this.contact_us.secondPageTitle).should('be.visible');

//         const buttonsToSelect = this.contact_us.servicesToSelect;
//         contactUsPage.locateAndChecktheSubjectButtons(buttonsToSelect);


//         // //Click on Back icon and verify the back page content 

//         // cy.contains('button', 'Back').should('be.visible').click({ force: true });

//         // cy.contains('h2', 'Let’s talk budget').should('be.visible');

//         cy.contains('button', 'Next').should('be.visible').click({ force: true });

//         cy.contains('h2', this.contact_us.thirdPageTitle).should('be.visible');




//         contactUsPage.enterDetailsinLastForm();

//         cy.get('button').contains('button', this.contact_us.mainButtonText).should('be.visible').click({ force: true });

//         cy.contains(this.contact_us.successMessage, { timeout: 8000 }).should('be.visible');

//         cy.wait(4000);

//         cy.url().should('not.contain', '/start-project'); // Ensure we are not on the contact-us page anymore


//         // buttonsToSelect.forEach((text) => {
//         //     cy.contains('div.grid button', text)
//         //         .click({ force: true })
//         //         .find('span svg')
//         //         .should('exist');
//         // });


//     });
// });

import ContactUsPage from "../../support/pageObjects/contactUs";

describe('Contact Us Tests', () => {

    let contactUsPage;
    let contactData;

    // Runs once before all tests
    before(() => {
        // Load fixture
        cy.fixture('contact_us').then((data) => {
            contactData = data;
        });

        // Initialize page object
        contactUsPage = new ContactUsPage();
    });

    it('Contact us with empty fields', () => {
        cy.visit("https://www.venre.org/");

        contactUsPage.ProcesstoContactUsForm();

        // Check the Next button and click on it
        cy.contains('button', 'Next').should('exist').click({ force: true });

        // Verify required field error messages
        const expectedMessages = contactData.expectedErrorMessages;

        cy.get('div.text-red-500 span').each(($el, index) => {
            expect($el.text()).to.contain(expectedMessages[index]);
        });
    });

    it('Contact us with valid fields', () => {
        cy.visit("https://www.venre.org/");

        contactUsPage.ProcesstoContactUsForm();

        // Fill form with valid data
        contactUsPage.enterFormDetails();

        // Verify the next page loaded
        cy.contains('h2', contactData.secondPageTitle).should('be.visible');

        // Select date
        const dateToSelect = contactData.dateToSelect; // "2026-03-04"
        contactUsPage.selectdateusingCalendar(dateToSelect)
            .then(($input) => {
                const htmlValue = $input.val();
                expect(htmlValue).to.eq(dateToSelect);

                // Convert to MM/DD/YYYY and assert frontend format
                const [year, month, day] = htmlValue.split('-');
                const formattedDate = `${month}/${day}/${year}`;
                expect(formattedDate).to.eq(contactData.expectedFrontEndDate);
            });

        // Select budget
        contactUsPage.selectBudgetOption(contactData.minBudget, contactData.maxBudget)
            .then(({ firstField, secondField }) => {
                firstField.should('have.value', contactData.minBudget);
                secondField.should('have.value', contactData.maxBudget);
            });

        // Click Next
        cy.contains('button', 'Next').should('be.visible').click({ force: true });

        // Verify next page title
        cy.contains('h2', contactData.secondPageTitle).should('be.visible');

        // Select services
        contactUsPage.locateAndChecktheSubjectButtons(contactData.servicesToSelect);

        // Click Next to go to last page
        cy.contains('button', 'Next').should('be.visible').click({ force: true });

        // Verify third page title
        cy.contains('h2', contactData.thirdPageTitle).should('be.visible');

        // Fill last form
        contactUsPage.enterDetailsinLastForm();

        // Submit
        cy.get('button').contains(contactData.mainButtonText).should('be.visible').click({ force: true });

        // Verify success popup
        cy.contains(contactData.successMessage, { timeout: 8000 }).should('be.visible');

        // Wait for auto-hide (optional)
        cy.wait(4000);

        // Ensure we are navigated away
        cy.url().should('not.contain', '/start-project');
    });
});