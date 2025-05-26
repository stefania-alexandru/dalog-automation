import { test as base, expect } from '@playwright/test';
import { Corporation } from '../../pages/Corporations';
import { Company } from '../../pages/Companies';
import { Project } from '../../pages/Projects';
import { getAuthorizedRequestContext } from '../../utils/requestContext';
import { findEntityByName } from '../../helpers/Entities';
import * as dotenv from 'dotenv';

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
    const corporationToMatch = await findEntityByName(
      '/dev/meta/read/v1/corporations',
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
    await findEntityByName('/dev/meta/read/v1/companies', name);
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
    await findEntityByName('/dev/meta/read/v1/projects', name);

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
      `/dev/meta/write/v1/corporations/${createdCorporationId}`
    );
    expect(response.ok()).toBeTruthy();
    createdCorporationId = null;
  }
});
