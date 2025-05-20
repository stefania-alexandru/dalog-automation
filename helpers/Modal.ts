import { Locator, Page } from 'playwright';
import { HelperBase } from './HelperBase';
import { expect } from '@playwright/test';

export class ModalHelper extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async getInputFieldByLabel(label: string): Promise<Locator> {
    return this.page
      .locator('div.ms-Stack', {
        has: this.page.locator('span', { hasText: label }),
      })
      .locator('input');
  }

  async getButtonByText(buttonText: string): Promise<Locator> {
    return this.page.locator(`button:has-text("${buttonText}")`);
  }

  async fillAutocompleteFieldByLabel(
    label: string,
    value: string
  ): Promise<void> {
    const input = await this.getInputFieldByLabel(label);
    await input.fill(value);
    await input.waitFor({ state: 'attached', timeout: 5000 });

    const fieldValue = await input.inputValue();
    expect(fieldValue).toBe(value);
  }
}
