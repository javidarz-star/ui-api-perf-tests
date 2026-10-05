import { expect, type Locator, type Page } from '@playwright/test';
// import type { ProductData } from '../test-data/testData';

export class CartPage {
  readonly addToCartButton: Locator;
  readonly addToCartSuccessMessage: Locator;
  readonly cartContent: Locator;
  readonly checkoutLink: Locator;
  readonly removeButton: Locator;

  constructor(private readonly page: Page) {
    this.addToCartButton = page.getByRole('button', { name: /Add to Cart/i });
    this.addToCartSuccessMessage = page.getByText(/Success: You have added/i);
    this.cartContent = page.locator('#content');
    this.checkoutLink = page.getByRole('link', { name: /^Checkout$/i });
    this.removeButton = page.getByRole('button', { description: 'Remove', exact: true }).first();
  }

  productLink(productName: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(productName, 'i') }).first();
  }

  async addProduct(productName: string) {
    // await this.page.goto(productName.productUrl);
    await this.addToCartButton.click();
    await expect(this.addToCartSuccessMessage).toBeVisible();
  }

  async open() {
    await this.page.goto('/index.php?route=checkout/cart');
  }

  async expectProductInCart(productName: string) {
    await expect(this.productLink(productName)).toBeVisible();
    await expect(this.cartContent).toContainText(/Total:/i);
  }

  async removeProduct(productName: string) {
    await this.removeButton.click();
    await expect(this.cartContent).not.toContainText(new RegExp(productName, 'i'));
  }
}