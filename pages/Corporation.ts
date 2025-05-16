import { expect, Locator, Page, request } from '@playwright/test';
import { HelperBase } from '../helpers/HelperBase';
import { ModalHelper } from '../helpers/Modal';
import { getAuthorizedRequestContext } from '../utils/requestContext';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';

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
    const generatedName = faker.company.name();
    const nameInput = await this.modalHelper.getInputFieldByLabel('Name *');
    await nameInput.fill(generatedName);
    return generatedName;
  }

  async fillCorporationNumberInputField(): Promise<void> {
    const numberInput = await this.modalHelper.getInputFieldByLabel('Number');
    await numberInput.fill(faker.string.numeric(4));
  }

  async clickSaveChangesButton(): Promise<void> {
    const saveButton = await this.modalHelper.getButtonByText('Save Changes');
    await saveButton.click();
  }

  async submitCorporationFormAndWaitForApi(): Promise<void> {
    const waitForResponse = this.page.waitForResponse(
      (res) =>
        res.url().includes('/dev/meta/write/v1/corporations') &&
        res.status() === 201 &&
        res.request().method() === 'POST'
    );

    await this.clickSaveChangesButton();

    const response = await waitForResponse;
    expect(response.status()).toBe(201);
  }

  async verifyCorporationExistsViaAPI(corporationName: string): Promise<void> {
    const requestContext = await getAuthorizedRequestContext();
    const response = await requestContext.get('/dev/meta/read/v1/corporations');

    expect(response.ok()).toBeTruthy();

    const corporations = await response.json();
    const matchedCorporation = corporations.find(
      (corp: any) => corp.name === corporationName
    );

    expect(matchedCorporation).toBeTruthy();
  }
}
