import { expect, Locator, Page, request } from '@playwright/test';
import { HelperBase } from '../helpers/HelperBase';
import { ModalHelper } from '../helpers/Modal';
import { faker } from '@faker-js/faker';
import { getAuthorizedRequestContext } from '../utils/requestContext';
import * as dotenv from 'dotenv';

dotenv.config();

export class Company extends HelperBase {
  private modalHelper: ModalHelper;
  readonly addCompanyButton: Locator;

  constructor(page: Page) {
    super(page);
    this.modalHelper = new ModalHelper(page);
    this.addCompanyButton = page.getByRole('button', { name: 'Add' });
  }

  async openAddCompanyModal() {
    await this.addCompanyButton.click();
  }

  async fillCorporationName(corporationName: string) {
    await this.modalHelper.fillAutocompleteFieldByLabel(
      'Corporation: *',
      corporationName
    );
  }

  async fillCompanyNameInput() {
    const companyName = faker.company.name();

    const nameInput = await this.modalHelper.getInputFieldByLabel('Name *');
    await nameInput.fill(companyName);

    return companyName;
  }

  async fillCompanyNumberInput() {
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
        res.url().includes('/dev/meta/write/v1/companies') &&
        res.status() === 201 &&
        res.request().method() === 'POST'
    );

    await this.clickSaveChangesButton();

    const response = await waitForResponse;
    expect(response.status()).toBe(201);
  }

  async verifyCompanyExistsViaAPI(companyName: string): Promise<void> {
    const requestContext = await getAuthorizedRequestContext();
    const response = await requestContext.get('/dev/meta/read/v1/companies');

    expect(response.ok()).toBeTruthy();

    const companies = await response.json();
    const matchedCompany = companies.find(
      (comp: any) => comp.name === companyName
    );

    expect(matchedCompany).toBeTruthy();
  }
}
