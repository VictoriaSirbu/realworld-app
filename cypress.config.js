import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { percyHealthCheck } from "@percy/cypress/task";
import codeCoverageTask from "@cypress/code-coverage/task";
import { defineConfig } from "cypress";
import "@cypress/instrument-cra";
const { devServer } = require("@cypress/react/plugins/react-scripts");

dotenv.config({ path: ".env.local" });
dotenv.config();

const awsConfig = require(path.join(__dirname, "./aws-exports-es5.js"));

module.exports = defineConfig({
  projectId: "7s5okt",
  env: {
    apiUrl: "http://localhost:3002",
    mobileViewportWidthBreakpoint: 414,
    coverage: false,
    codeCoverage: {
      url: "http://localhost:3002/__coverage__",
      exclude: "cypress/**/*.*",
    },
    defaultPassword: process.env.SEED_DEFAULT_USER_PASSWORD,
    paginationPageSize: process.env.PAGINATION_PAGE_SIZE,

    // Auth0
    auth0_username: process.env.AUTH0_USERNAME,
    auth0_password: process.env.AUTH0_PASSWORD,
    auth0_domain: process.env.REACT_APP_AUTH0_DOMAIN,
    auth0_audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    auth0_scope: process.env.REACT_APP_AUTH0_SCOPE,
    auth0_client_id: process.env.REACT_APP_AUTH0_CLIENTID,
    auth0_client_secret: process.env.AUTH0_CLIENT_SECRET,
    auth_token_name: process.env.REACT_APP_AUTH_TOKEN_NAME,

    // Okta
    okta_username: process.env.OKTA_USERNAME,
    okta_password: process.env.OKTA_PASSWORD,
    okta_domain: process.env.REACT_APP_OKTA_DOMAIN,
    okta_client_id: process.env.REACT_APP_OKTA_CLIENTID,

    // Amazon Cognito
    cognito_username: process.env.AWS_COGNITO_USERNAME,
    cognito_password: process.env.AWS_COGNITO_PASSWORD,
    awsConfig: awsConfig.default,

    // Google
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    googleClientId: process.env.REACT_APP_GOOGLE_CLIENTID,
    googleClientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
  },
  component: {
    devServer,
    specPattern: "cypress/tests/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    signedUpUser: {},
    cookies: [],
    bankAccount: {},
    specPattern: "cypress/tests/**/*.spec.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    viewportHeight: 1000,
    viewportWidth: 1280,
    setupNodeEvents(on, config) {
      on("task", {
        percyHealthCheck,
        log(message) {
          console.log(message);
          return null;
        },
        writeFile({ filename, content }) {
          const filePath = path.join(__dirname, "cypress", "fixtures", filename);
          fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
          return null;
        },
      });
      codeCoverageTask(on, config);
      return config;
    },
  },
});
