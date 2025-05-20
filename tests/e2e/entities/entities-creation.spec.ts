import { test } from '../../fixtures/UITestFixtures';
import { Corporation } from '../../../pages/Corporations';
import { Company } from '../../../pages/Companies';
import { Project } from '../../../pages/Projects';

test('Verify that corporation creation is successful', async ({ page }) => {
  const corporationPage = new Corporation(page);
  await page.goto('/corporations');

  await corporationPage.openAddCorporationModal();
  const expectedCorporationName =
    await corporationPage.fillCorporationNameInputField();
  await corporationPage.fillCorporationNumberInputField();
  await corporationPage.submitCorporationFormAndWaitForApi();
  await corporationPage.verifyCorporationExistsViaAPI(expectedCorporationName);
});

test('Verify that company is created within an existing corporation', async ({
  page,
  corporationName,
}) => {
  const companyPage = new Company(page);
  await page.goto('/companies');

  await companyPage.openAddCompanyModal();
  await companyPage.fillCorporationName(corporationName);
  const expectedCompanyName = await companyPage.fillCompanyNameInput();
  await companyPage.fillCompanyNumberInput();
  await companyPage.submitCompanyFormAndWaitForApi();
  await companyPage.verifyCompanyExistsViaAPI(expectedCompanyName);
});

test('Verify that project is created within an existing company', async ({
  page,
  companyName,
}) => {
  const projectPage = new Project(page);
  await page.goto('/projects');

  await projectPage.openAddProjectModal();
  await projectPage.fillCompanyNameInputField(companyName);
  const expectedProjectName = await projectPage.fillProjectNameInputField();
  await projectPage.fillProjectContinentInputField('Europe');
  await projectPage.fillProjectCountryInputField('Germany');
  await projectPage.fillProjectCityInputField('Berlin');
  await projectPage.fillProjectLatitudeInputField();
  await projectPage.fillProjectLongitudeInputField();
  await projectPage.submitProjectFormAndWaitForApi();
  await projectPage.verifyProjectExistsViaAPI(expectedProjectName);
});
