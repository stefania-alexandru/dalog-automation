import { test as base, expect } from '@playwright/test';
import { Corporation } from '../../pages/Corporations';
import { Company } from '../../pages/Companies';
import { Project } from '../../pages/Projects';
import { getAuthorizedRequestContext } from '../../utils/requestContext';
import * as dotenv from 'dotenv';

dotenv.config();

type Fixtures = {
  corporationName: string;
  companyName: string;
  projectName: string;
};

export const test = base.extend<Fixtures>({
  corporationName: async ({ page }, use) => {
    const corporation = new Corporation(page);

    await page.goto('/corporations');
    await corporation.openAddCorporationModal();
    const name = await corporation.fillCorporationNameInputField();
    await corporation.fillCorporationNumberInputField();
    await corporation.submitCorporationFormAndWaitForApi();

    const requestContext = await getAuthorizedRequestContext();
    const response = await requestContext.get('/dev/meta/read/v1/corporations');
    expect(response.ok()).toBeTruthy();

    const corporations = await response.json();
    const corporationToMatch = corporations.find(
      (corp: any) => corp.name === name
    );

    expect(corporationToMatch).toBeTruthy();

    await use(name);
  },

  companyName: async ({ page, corporationName }, use) => {
    const company = new Company(page);

    await page.goto('/companies');
    await company.openAddCompanyModal();
    await company.fillCorporationName(corporationName);
    const name = await company.fillCompanyNameInput();
    await company.fillCompanyNumberInput();
    await company.submitCompanyFormAndWaitForApi();

    const requestContext = await getAuthorizedRequestContext();
    const response = await requestContext.get('/dev/meta/read/v1/companies');
    expect(response.ok()).toBeTruthy();

    const companies = await response.json();
    const companyToMatch = companies.find((comp: any) => comp.name === name);
    expect(companyToMatch).toBeTruthy();

    await use(name);
  },

  projectName: async ({ page, companyName }, use) => {
    const project = new Project(page);

    await page.goto('/projects');
    await project.openAddProjectModal();
    await project.fillCompanyNameInputField(companyName);
    const name = await project.fillProjectNameInputField();
    await project.submitProjectFormAndWaitForApi();

    const requestContext = await getAuthorizedRequestContext();
    const response = await requestContext.get('/dev/meta/read/v1/projects');
    expect(response.ok()).toBeTruthy();

    const projects = await response.json();
    const projectToMatch = projects.find((proj: any) => proj.name === name);
    expect(projectToMatch).toBeTruthy();

    await use(name);
  },
});

export { expect };
