import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import testData from '../test-data/ecommerce.data.json';

test.describe('Authentication & Search', () => {
  test('AUTH-1: a registered customer can log in @smoke', async ({ page }) => {
    const login = new LoginPage(page);
    const email = process.env.E2E_EMAIL;
    const password = process.env.E2E_PASSWORD;
    expect(email, 'setup must provide an account email').toBeTruthy();
    await login.open();
    await login.logout();
    await login.open();
    await login.login(email, password);
    await login.expectSignedIn();
  });

  test('SRCH-1: search by product name', async ({ page }) => {
    const search = new SearchPage(page);
    await page.goto('/');
    await search.byName(testData.search.productName);
  });

  test('SRCH-2: browse products by category', async ({ page }) => {
    const search = new SearchPage(page);
    await page.goto('/');
    await search.byCategory(testData.search.category);
  });

  test('SRCH-3: browse products by manufacturer', async ({ page }) => {
    const search = new SearchPage(page);
    await page.goto('/');
    await search.byManufacturer(testData.search.manufacturer);
  });
});

test.describe('Add to cart & Checkout', () => {
  test.describe.configure({ mode: 'serial' });

  testData.products.forEach((product, index) => {
    test(`CART-${index + 1}: add product ${product.name} to the cart`, async ({ page }) => {
      const search = new SearchPage(page);
      const cart = new CartPage(page);
      await page.goto('/');
      await search.byName(product.name);
      await search.selectFirstProduct();
      await cart.addProduct(product.name);
      await cart.open();
      await cart.expectProductInCart(product.name);

    });
  });

  test('CHK-1: complete checkout data and reach Confirm Order', async ({ page }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    await page.goto('/');
    await cart.open();
    await cart.checkoutLink.click();
    await checkout.completeAsExistingUser();
    await checkout.expectConfirmOrderPage();
    await cart.open();
    for (const product of testData.products) {
      await cart.removeProduct(product.name);
    }
  });
});
