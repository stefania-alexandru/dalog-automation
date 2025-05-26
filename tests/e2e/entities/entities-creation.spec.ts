import { test } from '../../fixtures/UITestFixtures';
import { Corporation } from '../../../pages/Corporations';
import { Company } from '../../../pages/Companies';
import { Machines } from '../../../pages/Machines';
import { Project } from '../../../pages/Projects';
import { fetchAndVerifyEntityByName } from '../../../utils/requestContext';

test('Verify that corporation creation is successful', async ({ page }) => {
  const corporationPage = new Corporation(page);

  await page.goto('/corporations');

  await corporationPage.openAddCorporationModal();
  const expectedCorporationName =
    await corporationPage.fillCorporationNameInputField();
  await corporationPage.fillCorporationNumberInputField();
  await corporationPage.submitCorporationFormAndWaitForApi();
  await fetchAndVerifyEntityByName(
    '/dev/meta/read/v1/corporations',
    expectedCorporationName
  );
  await Corporation.setCreatedCorporationIdByName(expectedCorporationName);
});

test('Verify that company is created within an existing corporation', async ({
  page,
  corporationName,
}) => {
  const companyPage = new Company(page);

  await page.goto('/companies');

  await companyPage.openAddCompanyModal();
  await companyPage.openCorporationDropdown();
  await companyPage.selectCorporationFromDropdown(corporationName);
  const expectedCompanyName = await companyPage.fillCompanyNameInput();
  await companyPage.fillCompanyNumberInput();
  await companyPage.submitCompanyFormAndWaitForApi();
  await fetchAndVerifyEntityByName(
    '/dev/meta/read/v1/companies',
    expectedCompanyName
  );
});

test('Verify that project is created within an existing company', async ({
  page,
  companyName,
}) => {
  const projectPage = new Project(page);

  await page.goto('/projects');

  await projectPage.openAddProjectModal();
  await projectPage.openCompanyDropdown();
  await projectPage.selectCompanyFromDropdown(companyName);
  const expectedProjectName = await projectPage.fillProjectNameInputField();
  await projectPage.selectContinentFromDropdown('Europe');
  await projectPage.selectCountryFromDropdown('Germany');
  await projectPage.fillProjectCityInputField('Berlin');
  await projectPage.fillProjectLatitudeInputField();
  await projectPage.fillProjectLongitudeInputField();
  await projectPage.submitProjectFormAndWaitForApi();
  await fetchAndVerifyEntityByName('/dev/meta/read/v1/projects', expectedProjectName);
});

test('Verify that machine is created within an existing project', async ({
  page,
  projectName,
}) => {
  const machinePage = new Machines(page);

  await page.goto('/machines');

  await machinePage.openAddMachineModal();
  await machinePage.openProjectDropdown();
  await machinePage.selectProjectFromDropdown(projectName);
  await machinePage.fillIdInputField();
  const expectedMachineName = await machinePage.fillMachineNameInputField();
  await machinePage.filCustomerCodeInputField();
  await machinePage.fillManufacturerInputField();
  await machinePage.fillProcessInputField();
  await machinePage.fillTypeInputField();
  await machinePage.fillNotationInputField();
  await machinePage.fillGearboxManufacturerInputField();
  await machinePage.fillGearboxNameInputField();
  await machinePage.fillGearboxPowerInputField();
  await machinePage.fillGearboxRotationalSpeedInputField();
  await machinePage.fillGearboxSerialNumberInputField();
  await machinePage.fillGearboxNotationInputField();
  await machinePage.verifyAPICreationIsSuccessful();
});
