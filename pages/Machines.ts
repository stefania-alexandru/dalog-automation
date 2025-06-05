import { expect, Locator, Page, request } from '@playwright/test';
import { HelperBase } from '../helpers/HelperBase';
import { ModalHelper } from '../helpers/Modal';
import { faker } from '@faker-js/faker';
import { generateFormattedString } from '../utils/stringUtils';
import * as dotenv from 'dotenv';
import { getAuthorizedRequestContext } from '../utils/apiUtils';
import { API_ENDPOINTS } from '../utils/apiEndpoints';

dotenv.config();

export class Machines extends HelperBase {
  private modalHelper: ModalHelper;
  readonly addMachineButton: Locator;

  constructor(page: Page) {
    super(page);
    this.modalHelper = new ModalHelper(page);
    this.addMachineButton = page.getByRole('button', { name: 'Add' });
  }

  async openAddMachineModal(): Promise<void> {
    await this.addMachineButton.click();
  }

  async openProjectDropdown(): Promise<void> {
    const projectDropdown = this.page
      .locator('div.ms-Stack', {
        has: this.page.locator('label', { hasText: 'Project *' }),
      })
      .locator('input');
    await projectDropdown.click();
  }

  async selectProjectFromDropdown(projectName: string): Promise<void> {
    await this.modalHelper.selectOptionFromDropdown(projectName);
  }

  async fillIdInputField(): Promise<void> {
    const dalogId = await this.generateUniqueDalogId();
    const idInputField =
      await this.modalHelper.getInputFieldByLabel('Dalog Id *');
    await idInputField.fill(dalogId);
  }

  async fillMachineNameInputField(): Promise<string> {
    const generatedUniqueMachineName = await this.generateUniqueMachineName();

    const nameInput = await this.modalHelper.getInputFieldByLabel('Name');
    await nameInput.fill(generatedUniqueMachineName);

    return generatedUniqueMachineName;
  }

  async filCustomerCodeInputField(): Promise<void> {
    const customerCodeInputField =
      await this.modalHelper.getInputFieldByLabel('Customer Code');
    await customerCodeInputField.fill(faker.number.int().toString());
  }

  async fillManufacturerInputField(): Promise<void> {
    const manufacturerInputField =
      await this.modalHelper.getInputFieldByLabel('Manufacturer');
    await manufacturerInputField.fill(faker.string.alpha(5));
  }

  async fillProcessInputField(): Promise<void> {
    const processInputField =
      await this.modalHelper.getInputFieldByLabel('Process');
    await processInputField.fill(faker.string.alpha(5));
  }

  async fillTypeInputField(): Promise<void> {
    const typeInputField = await this.modalHelper.getInputFieldByLabel('Type');
    await typeInputField.fill(faker.string.alpha(5));
  }

  async fillNotationInputField(): Promise<void> {
    const notationInputField =
      await this.modalHelper.getInputFieldByLabel('Notation');
    await notationInputField.fill(faker.string.alpha(5));
  }

  async fillGearboxManufacturerInputField(): Promise<void> {
    const gearboxManufacturerInputField =
      await this.modalHelper.getInputFieldByLabel('Gearbox Manufacturer');
    await gearboxManufacturerInputField.fill(faker.string.alpha(5));
  }

  async fillGearboxNameInputField(): Promise<void> {
    const gearboxNameInputField =
      await this.modalHelper.getInputFieldByLabel('Gearbox Name');
    await gearboxNameInputField.fill(faker.string.alpha(5));
  }

  async fillGearboxPowerInputField(): Promise<void> {
    const gearboxPowerInputField =
      await this.modalHelper.getInputFieldByLabel('Gearbox Power');
    await gearboxPowerInputField.fill(
      faker.number.int({ max: 50000 }).toString()
    );
  }

  async fillGearboxRotationalSpeedInputField(): Promise<void> {
    const gearboxRotationalSpeedInputField =
      await this.modalHelper.getInputFieldByLabel('Gearbox Rotational Speed');
    await gearboxRotationalSpeedInputField.fill(
      faker.number.int({ max: 50000 }).toString()
    );
  }

  async fillGearboxSerialNumberInputField(): Promise<void> {
    const gearboxSerialNumberInputField =
      await this.modalHelper.getInputFieldByLabel('Gearbox Serial Number');
    await gearboxSerialNumberInputField.fill(faker.number.int().toString());
  }

  async fillGearboxNotationInputField(): Promise<void> {
    const gearboxNotationInputField =
      await this.modalHelper.getInputFieldByLabel('Gearbox Notation');
    await gearboxNotationInputField.fill(faker.string.alpha(5));
  }

  async clickSaveChangesButton(): Promise<void> {
    const saveButton = await this.modalHelper.getButtonByText('Save Changes');
    await saveButton.click();
  }

  async verifyAPICreationIsSuccessful(): Promise<void> {
    const waitForResponse = this.page.waitForResponse(
      (res) =>
        res.url().includes(API_ENDPOINTS.MACHINES_POST) &&
        res.status() === 201 &&
        res.request().method() === 'POST'
    );

    await this.clickSaveChangesButton();

    const response = await waitForResponse;
    expect(response.status()).toBe(201);
  }

  private async generateUniqueDalogId(): Promise<string> {
    const requestContext = await getAuthorizedRequestContext();
    const response = await requestContext.get(API_ENDPOINTS.MACHINES_GET);
    const companies = await response.json();

    if (!Array.isArray(companies)) {
      throw new Error('Invalid data format');
    }

    while (true) {
      const newId = generateFormattedString();
      const isIdTaken = companies.some((company) => company.dalogId === newId);

      if (!isIdTaken) {
        return newId;
      }
    }
  }

  private async generateUniqueMachineName(): Promise<string> {
    const requestContext = await getAuthorizedRequestContext();
    const response = await requestContext.get(API_ENDPOINTS.MACHINES_GET);
    const machines = await response.json();

    if (!Array.isArray(machines)) {
      throw new Error('Invalid data format');
    }

    while (true) {
      const newMachineName = faker.commerce.product();
      const isNameTaken = machines.some(
        (machine) => machine.name === newMachineName
      );

      if (!isNameTaken) {
        return newMachineName;
      }
    }
  }
}
