import { expect, type Locator, type Page } from '@playwright/test';

export class SearchPage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly firstProductResult: Locator;
  readonly categoryButton: Locator;
  readonly megaMenuButton: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.locator('#main-header').getByRole('textbox', { name: 'Search For Products' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.firstProductResult = page.locator('.product-thumb, .product-layout').first();
    this.categoryButton = page.getByRole('button', { name: 'Shop by Category' });
    this.megaMenuButton = page.getByRole('button', { name: 'Mega Menu' });
  }

  searchHeading(productName: string): Locator {
    return this.page.getByRole('heading', { name: `Search - ${productName}` });
  }

  categoryLink(category: string): Locator {
    // return this.page.getByRole('link', { name: new RegExp(`^${category}$`, 'i') }).first();
    return this.page.getByRole('link', { name: `${category}`, exact: true });
  }

  categoryHeading(category: string): Locator {
    return this.page.getByRole('heading', { name: new RegExp(category, 'i') });
  }

  manufacturerLink(manufacturer: string): Locator {
    // return this.page.getByRole('link', { name: new RegExp(`^${manufacturer}$`, 'i') });
    return this.page.getByRole('link', { name: `${manufacturer}`, exact: true });
  }

  manufacturerHeading(manufacturer: string): Locator {
    return this.page.getByRole('heading', { name: `${manufacturer}`, exact: true });
  }

  async byName(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    await expect(this.searchHeading(productName)).toBeVisible();
    await expect(this.firstProductResult).toBeVisible();
  }

  async byCategory(category: string) {
    await this.categoryButton.click();
    await this.categoryLink(category).click();
    await expect(this.categoryHeading(category)).toBeVisible();
    await expect(this.firstProductResult).toBeVisible();
  }

  async byManufacturer(manufacturer: string) {
    // await this.page.goto('/index.php?route=product/manufacturer');
    await this.megaMenuButton.hover();
    await this.manufacturerLink(manufacturer).click();
    await expect(this.manufacturerHeading(manufacturer)).toBeVisible();
    await expect(this.firstProductResult).toBeVisible();
  }

  async selectFirstProduct() {
    await this.firstProductResult.click();
  }
}
