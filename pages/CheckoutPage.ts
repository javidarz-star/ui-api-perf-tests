import { expect, type Locator, type Page } from '@playwright/test';
import testData from '../test-data/ecommerce.data.json';

export class CheckoutPage {
  
  readonly commentInput: Locator;
  readonly termsAndConditionsCheckbox: Locator;
  readonly continueButton: Locator;
  readonly confirmOrderHeading: Locator;
  readonly existingAddressRadio: Locator;
  readonly confirmOrderContent: Locator;

  constructor(private readonly page: Page) {
    this.existingAddressRadio = page.getByRole('radio', { name: 'I want to use an existing address' });
    this.commentInput = page.getByRole('textbox', { name: 'Add Comments About Your Order' });
    this.termsAndConditionsCheckbox = page.getByText('I have read and agree to the Terms & Conditions');
    this.continueButton = page.locator('#button-save');
    this.confirmOrderHeading = page.getByRole('heading', { name: testData.checkout.confirmationHeading });
    this.confirmOrderContent = page.locator('#content');
  }

  paymentMethodRadio(paymentMethod: string): Locator {
    return this.page.getByRole('radio', { name: paymentMethod });
  }

  shippingMethodRadio(shippingMethod: string): Locator {
    return this.page.getByRole('radio', { name: shippingMethod });
  }

  async completeAsExistingUser() {
    await this.commentInput.fill(testData.checkout.comment);
    await this.termsAndConditionsCheckbox.check();
    await this.continueButton.click();
  }

  async expectConfirmOrderPage() {
    await expect(this.confirmOrderHeading).toBeVisible();
    await expect(this.page).toHaveTitle(testData.checkout.confirmationHeading);
    for (const product of testData.products) {
      await expect(this.confirmOrderContent).toContainText(product.name);
    }
  }
}
