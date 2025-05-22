import { expect, Locator, Page, request } from '@playwright/test';
import { HelperBase } from '../helpers/HelperBase';
import { ModalHelper } from '../helpers/Modal';
import { faker } from '@faker-js/faker';
import { generateUniquePropertyValue } from '../utils/entitiesUtils';
import * as dotenv from 'dotenv';

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
    const idInputField =
      await this.modalHelper.getInputFieldByLabel('Dalog Id *');
    await idInputField.fill(
      await generateUniquePropertyValue('machines', 'dalogId')
    );
  }

  async fillMachineNameInputField(): Promise<string> {
    const machineName = faker.commerce.product();

    const nameInput = await this.modalHelper.getInputFieldByLabel('Name');
    await nameInput.fill(machineName);

    return machineName;
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
    await gearboxPowerInputField.fill(faker.number.int().toString());
  }

  async fillGearboxRotationalSpeedInputField(): Promise<void> {
    const gearboxRotationalSpeedInputField =
      await this.modalHelper.getInputFieldByLabel('Gearbox Rotational Speed');
    await gearboxRotationalSpeedInputField.fill(faker.number.int().toString());
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
        res.url().includes('/dev/meta/write/v1/machines') &&
        res.status() === 201 &&
        res.request().method() === 'POST'
    );

    await this.clickSaveChangesButton();

    const response = await waitForResponse;
    expect(response.status()).toBe(201);
  }
}
