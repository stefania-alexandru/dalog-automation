import { expect, Locator, Page, request } from '@playwright/test';
import { HelperBase } from '../helpers/HelperBase';
import { ModalHelper } from '../helpers/Modal';
import {
  fetchAndVerifyEntityByName,
  getAuthorizedRequestContext,
} from '../utils/apiUtils';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { setCreatedCorporationId } from '../tests/fixtures/UITestFixtures';
import { API_ENDPOINTS } from '../utils/apiEndpoints';

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
    const generatedUniqueCorporationName =
      await this.generateUniqueCorporationName();

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

  private async generateUniqueCorporationName(): Promise<string> {
    const requestContext = await getAuthorizedRequestContext();
    const response = await requestContext.get(API_ENDPOINTS.CORPORATIONS_GET);
    const corporations = await response.json();

    if (!Array.isArray(corporations)) {
      throw new Error('Invalid data format');
    }

    while (true) {
      const newCorporationName = faker.company.name();
      const isNameTaken = corporations.some(
        (corporation) => corporation.name === newCorporationName
      );

      if (!isNameTaken) {
        return newCorporationName;
      }
    }
  }
}
