import { Locator, Page } from 'playwright';
import { HelperBase } from './HelperBase';
import { expect } from '@playwright/test';

export class ModalHelper extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async getInputFieldByLabel(label: string): Promise<Locator> {
    const stackLocator = this.page.locator('div.ms-Stack').filter({
      has: this.page
        .locator('span', { hasText: label })
        .or(this.page.locator('label', { hasText: `^${label}$` })),
    });

    const input = stackLocator.locator('input');

    return input.first();
  }

  async getButtonByText(buttonText: string): Promise<Locator> {
    return this.page.locator(`button:has-text("${buttonText}")`);
  }

  async selectOptionFromDropdown(option: string) {
    const optionLocator = this.page.getByRole('option', {
      name: option,
      exact: true,
    });
    await optionLocator.click();
  }
}
