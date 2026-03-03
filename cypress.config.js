const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    baseUrl: "https://www.venre.org/"
  },
  allowCypressEnv: true,

  e2e: {

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/integeration/examples/*.js"
  }
});