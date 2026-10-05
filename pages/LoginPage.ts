import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly logoutLink: Locator;
  readonly logoutContinueButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel(/E-Mail Address/i);
    this.passwordInput = page.getByLabel(/^Password$/i);
    this.loginButton = page.getByRole('button', { name: /^Login$/i });
    this.logoutLink = page.getByRole('link', { name: /Logout/i });
    this.logoutContinueButton = page.getByRole('link', { name: 'Continue' });
  }

  async open() {
    await this.page.goto('/index.php?route=account/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.logoutLink.click();
    await this.logoutContinueButton.click();
  }

  async expectSignedIn() {
    await expect(this.logoutLink).toBeVisible();
  }
}
