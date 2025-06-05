import { expect, Locator, Page, request } from '@playwright/test';
import { HelperBase } from '../helpers/HelperBase';
import { ModalHelper } from '../helpers/Modal';
import { fetchAndVerifyEntityByName } from '../utils/apiUtils';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { setCreatedCorporationId } from '../tests/fixtures/UITestFixtures';
import { API_ENDPOINTS } from '../utils/apiEndpoints';
import { generateUniqueEntityName } from '../utils/stringUtils';

dotenv.config();

export class Corporation extends HelperBase {
  private modalHelper: ModalHelper;
  readonly addCorporationButton: Locator;

  constructor(page: Page) {
    super(page);
    this.modalHelper = new ModalHelper(page);
    this.addCorporationButton = page.getByRole('button', { name: 'Add' });
  }

  async openAddCorporationModal(): Promise<void> {
    await this.addCorporationButton.click();
  }

  async fillCorporationNameInputField(): Promise<string> {
    const generatedUniqueCorporationName = await generateUniqueEntityName(
      API_ENDPOINTS.COMPANIES_GET,
      'corporation'
    );

    const nameInput = await this.modalHelper.getInputFieldByLabel('Name *');
    await nameInput.fill(generatedUniqueCorporationName);

    return generatedUniqueCorporationName;
  }

  async fillCorporationNumberInputField(): Promise<void> {
    const numberInput = await this.modalHelper.getInputFieldByLabel('Number');
    await numberInput.fill(faker.string.numeric(7));
  }

  async clickSaveChangesButton(): Promise<void> {
    const saveButton = await this.modalHelper.getButtonByText('Save Changes');
    await saveButton.click();
  }

  async submitCorporationFormAndWaitForApi(): Promise<void> {
    const waitForResponse = this.page.waitForResponse(
      (res) =>
        res.url().includes(API_ENDPOINTS.CORPORATIONS_POST) &&
        res.status() === 201 &&
        res.request().method() === 'POST'
    );

    await this.clickSaveChangesButton();

    const response = await waitForResponse;
    if (!response.ok()) {
      throw new Error(
        `Failed to create corporation: ${response.status()} - ${response.statusText()}`
      );
    }
    expect(response.status()).toBe(201);
  }

  static async setCreatedCorporationIdByName(
    corporationName: string
  ): Promise<void> {
    const match = await fetchAndVerifyEntityByName(
      API_ENDPOINTS.CORPORATIONS_GET,
      corporationName
    );
    if (match) {
      setCreatedCorporationId(match.id);
    }
  }
}
