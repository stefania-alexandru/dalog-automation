import { test as base, expect } from '@playwright/test';
import { Corporation } from '../../pages/Corporations';
import { Company } from '../../pages/Companies';
import { Project } from '../../pages/Projects';
import {
  getAuthorizedRequestContext,
  fetchAndVerifyEntityByName,
} from '../../utils/apiUtils';
import * as dotenv from 'dotenv';
import { API_ENDPOINTS } from '../../utils/apiEndpoints';

dotenv.config();

type Fixtures = {
  corporationName: string;
  companyName: string;
  projectName: string;
};

let createdCorporationId: string | null;

export const test = base.extend<Fixtures>({
  corporationName: async ({ page }, use) => {
    const corporation = new Corporation(page);

    await page.goto('/corporations');
    await corporation.openAddCorporationModal();
    const name = await corporation.fillCorporationNameInputField();

    await corporation.fillCorporationNumberInputField();
    await corporation.submitCorporationFormAndWaitForApi();
    const corporationToMatch = await fetchAndVerifyEntityByName(
      API_ENDPOINTS.CORPORATIONS_GET,
      name
    );
    createdCorporationId = corporationToMatch.id;

    await use(name);
  },

  companyName: async ({ page, corporationName }, use) => {
    const company = new Company(page);

    await page.goto('/companies');
    await company.openAddCompanyModal();
    await company.openCorporationDropdown();
    await company.selectCorporationFromDropdown(corporationName);
    const name = await company.fillCompanyNameInput();
    await company.fillCompanyNumberInput();
    await company.submitCompanyFormAndWaitForApi();
    await fetchAndVerifyEntityByName(API_ENDPOINTS.COMPANIES_GET, name);
    await use(name);
  },

  projectName: async ({ page, companyName }, use) => {
    const project = new Project(page);

    await page.goto('/projects');
    await project.openAddProjectModal();
    await project.openCompanyDropdown();
    await project.selectCompanyFromDropdown(companyName);
    const name = await project.fillProjectNameInputField();
    await project.submitProjectFormAndWaitForApi();
    await fetchAndVerifyEntityByName(API_ENDPOINTS.PROJECTS_GET, name);

    await use(name);
  },
});

export { expect };

export function setCreatedCorporationId(id: string) {
  createdCorporationId = id;
}

test.afterEach(async () => {
  if (createdCorporationId) {
    const requestContext = await getAuthorizedRequestContext();
    const response = await requestContext.delete(
      `${API_ENDPOINTS.CORPORATIONS_POST}/${createdCorporationId}`
    );
    expect(response.ok()).toBeTruthy();
    createdCorporationId = null;
  }
});
