import { expect, Locator, Page, request } from '@playwright/test';
import { HelperBase } from '../helpers/HelperBase';
import { ModalHelper } from '../helpers/Modal';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { API_ENDPOINTS } from '../utils/apiEndpoints';
import { generateUniqueEntityName } from '../utils/stringUtils';

dotenv.config();

export class Project extends HelperBase {
  private modalHelper: ModalHelper;
  readonly addProjectButton: Locator;

  constructor(page: Page) {
    super(page);
    this.modalHelper = new ModalHelper(page);
    this.addProjectButton = page.getByRole('button', { name: 'Add' });
  }

  async openAddProjectModal(): Promise<void> {
    await this.addProjectButton.click();
  }

  async openCompanyDropdown(): Promise<void> {
    const companyDropdown =
      await this.modalHelper.getInputFieldByLabel('Company');
    companyDropdown.click();
  }

  async selectCompanyFromDropdown(companyName: string): Promise<void> {
    await this.modalHelper.selectOptionFromDropdown(companyName);
  }

  async fillProjectNameInputField(): Promise<string> {
    const generatedUniqueProjectName = await generateUniqueEntityName(
      API_ENDPOINTS.PROJECTS_GET,
      'project'
    );

    const nameInput = await this.modalHelper.getInputFieldByLabel('Name *');
    await nameInput.fill(generatedUniqueProjectName);

    return generatedUniqueProjectName;
  }

  async selectContinentFromDropdown(continent: string): Promise<void> {
    const continentDropdown =
      await this.modalHelper.getInputFieldByLabel('Continent');
    await continentDropdown.click();
    await this.modalHelper.selectOptionFromDropdown(continent);
  }

  async selectCountryFromDropdown(country: string): Promise<void> {
    const countryDropdown =
      await this.modalHelper.getInputFieldByLabel('Country');
    await countryDropdown.click();
    await this.modalHelper.selectOptionFromDropdown(country);
  }

  async fillProjectCityInputField(city: string): Promise<void> {
    const cityField = await this.modalHelper.getInputFieldByLabel('City');
    await cityField.fill(city);
  }

  async fillProjectLatitudeInputField(): Promise<void> {
    const latitudeField =
      await this.modalHelper.getInputFieldByLabel('Longitude');

    const latitude = faker.number.float({
      min: -90,
      max: 90,
      fractionDigits: 1,
    });
    const formatted = latitude.toFixed(1);

    await latitudeField.fill(formatted);
  }

  async fillProjectLongitudeInputField(): Promise<void> {
    const longitudeField =
      await this.modalHelper.getInputFieldByLabel('Longitude');

    const longitude = faker.number.float({
      min: -180,
      max: 180,
      fractionDigits: 1,
    });
    const formatted = longitude.toFixed(1);

    await longitudeField.fill(formatted);
  }

  async clickSaveChangesButton(): Promise<void> {
    const saveButton = await this.modalHelper.getButtonByText('Save Changes');
    await saveButton.click();
  }

  async submitProjectFormAndWaitForApi(): Promise<void> {
    const waitForResponse = this.page.waitForResponse(
      (res) =>
        res.url().includes(API_ENDPOINTS.PROJECTS_POST) &&
        res.status() === 201 &&
        res.request().method() === 'POST'
    );

    await this.clickSaveChangesButton();

    const response = await waitForResponse;
    if (!response.ok()) {
      throw new Error(
        `Failed to create project: ${response.status()} - ${response.statusText()}`
      );
    }
    expect(response.status()).toBe(201);
  }
}
