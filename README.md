# E-commerce Playwright tests

Automated browser tests for the LambdaTest E-commerce Playground. The suite covers login, product discovery by name/category/manufacturer, cart addition, and entering checkout. It never submits the final order.

## Run locally

```bash
npm install
npx playwright install
npm test
```

Before running the tests, create **one dedicated test account** in the demo store. Do not use a personal account or create an account per test run. Create `.env` and add that account's `E2E_EMAIL` and `E2E_PASSWORD`.

The setup test signs in once and saves its authenticated browser state; each test then receives an isolated copy of that session. The login test signs out and signs back in with the same credentials, so authentication is still exercised explicitly.

View the generated report with `npm run report`.

## Test data and locators

`test-data/ecommerce.data.json` is the single source for product, search, cart and checkout data. Credentials are read from `.env` locally or GitHub secrets in CI and override the empty credential values in JSON, keeping secrets out of source control. Each page object declares its static Playwright locators as public `readonly` fields; parameterized locators, such as a category or product link, are exposed as reusable page-object methods.

## CI

GitHub Actions runs on pull requests, pushes to `main`, nightly at 02:00 UTC, and manual dispatch. Add the dedicated account's `E2E_EMAIL` and `E2E_PASSWORD` as repository secrets. The workflow fails early if either secret is absent and uploads the HTML report, JUnit XML, screenshots, videos, and traces.

## Test flow and cases

| ID | Flow | Expected outcome |
| --- | --- | --- |
| AUTH-1 | Sign in with a registered account | Account session is created |
| SRCH-1 | Search `iMac` by name | Search results are shown |
| SRCH-2 | Open Cameras category | Category products are shown |
| SRCH-3 | Open Apple manufacturer | Manufacturer products are shown |
| CART-1 | Add HTC Touch HD and open cart | Product and total are present |
| CART-2 | Add iPod Nano and open cart | Product and total are present |
| CHK-1 | Complete checkout with products added | Confirm Order page is visible; the final order is not submitted |

