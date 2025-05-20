import { expect, Locator, Page, request } from '@playwright/test';
import { HelperBase } from '../helpers/HelperBase';
import { ModalHelper } from '../helpers/Modal';
import { faker } from '@faker-js/faker';
import { getAuthorizedRequestContext } from '../utils/requestContext';
import * as dotenv from 'dotenv';

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

  async fillCompanyNameInputField(companyName: string): Promise<void> {
    await this.modalHelper.fillAutocompleteFieldByLabel('Company', companyName);
  }

  async fillProjectNameInputField(): Promise<string> {
    const projectName = faker.location.state();

    const nameInput = await this.modalHelper.getInputFieldByLabel('Name *');
    await nameInput.fill(projectName);

    return projectName;
  }

  async fillProjectContinentInputField(continent: string): Promise<void> {
    await this.modalHelper.fillAutocompleteFieldByLabel('Continent', continent);
  }

  async fillProjectCountryInputField(country: string): Promise<void> {
    await this.modalHelper.fillAutocompleteFieldByLabel('Country', country);
  }

  async fillProjectCityInputField(city: string): Promise<void> {
    await this.modalHelper.fillAutocompleteFieldByLabel('City', city);
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
        res.url().includes('/dev/meta/write/v1/projects') &&
        res.status() === 201 &&
        res.request().method() === 'POST'
    );

    await this.clickSaveChangesButton();

    const response = await waitForResponse;
    expect(response.status()).toBe(201);
  }

  async verifyProjectExistsViaAPI(projectName: string): Promise<void> {
    const requestContext = await getAuthorizedRequestContext();
    const response = await requestContext.get('/dev/meta/read/v1/projects');

    expect(response.ok()).toBeTruthy();

    const projects = await response.json();
    const matchedProject = projects.find(
      (proj: any) => proj.name === projectName
    );

    expect(matchedProject).toBeTruthy();
  }
}
