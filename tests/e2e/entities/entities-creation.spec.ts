import { test } from '../../fixtures/UIcorporationFixture';
import { Corporation } from '../../../pages/Corporation';
import { Company } from '../../../pages/Company';

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
