import { expect, Locator, Page } from '@playwright/test';
import { HelperBase } from '../helpers/HelperBase';
import { ModalHelper } from '../helpers/Modal';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { API_ENDPOINTS } from '../utils/apiEndpoints';
import { generateUniqueEntityName } from '../utils/stringUtils';

dotenv.config();

export class Company extends HelperBase {
  private modalHelper: ModalHelper;
  readonly addCompanyButton: Locator;

  constructor(page: Page) {
    super(page);
    this.modalHelper = new ModalHelper(page);
    this.addCompanyButton = page.getByRole('button', { name: 'Add' });
  }

  async openAddCompanyModal(): Promise<void> {
    await this.addCompanyButton.click();
  }

  async openCorporationDropdown(): Promise<void> {
    const corporationDropdown =
      await this.modalHelper.getInputFieldByLabel('Corporation: *');
    await corporationDropdown.click();
  }

  async selectCorporationFromDropdown(corporationName: string): Promise<void> {
    await this.modalHelper.selectOptionFromDropdown(corporationName);
  }

  async fillCompanyNameInput(): Promise<string> {
    const generatedUniqueCompanyName = await generateUniqueEntityName(
      API_ENDPOINTS.COMPANIES_GET,
      'company'
    );
    const nameInput = await this.modalHelper.getInputFieldByLabel('Name *');

    await nameInput.fill(generatedUniqueCompanyName);

    return generatedUniqueCompanyName;
  }

  async fillCompanyNumberInput(): Promise<void> {
    const numberInput = await this.modalHelper.getInputFieldByLabel('Number');
    await numberInput.fill(faker.string.numeric(4));
  }

  async clickSaveChangesButton(): Promise<void> {
    const saveButton = await this.modalHelper.getButtonByText('Save Changes');
    await saveButton.click();
  }

  async submitCompanyFormAndWaitForApi(): Promise<void> {
    const waitForResponse = this.page.waitForResponse(
      (res) =>
        res.url().includes(API_ENDPOINTS.COMPANIES_POST) &&
        res.status() === 201 &&
        res.request().method() === 'POST'
    );

    await this.clickSaveChangesButton();

    const response = await waitForResponse;
    expect(response.status()).toBe(201);
  }
}
