import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
// import { testData } from '../test-data/testData';

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

setup('authenticate test account', async ({ page }) => {
  if (!email || !password) {
    throw new Error(
      'E2E_EMAIL and E2E_PASSWORD are required. Create one dedicated demo-store account, then set these values in .env or GitHub Actions secrets.'
    );
  }

  const login = new LoginPage(page);
  await login.open();
  await login.login(email, password);
  await login.expectSignedIn();
  await page.context().storageState({ path: 'test-results/auth.json' });
});