import { test as baseTest, expect, request } from '@playwright/test';
import { Corporation } from '../../pages/Corporation';
import { getAuthorizedRequestContext } from '../../utils/requestContext';
import * as dotenv from 'dotenv';
dotenv.config();

type CorporationFixture = {
  corporationName: string;
};

export const test = baseTest.extend<CorporationFixture>({
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
});
