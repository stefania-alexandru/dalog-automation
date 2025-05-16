import { test as baseTest, expect, request } from '@playwright/test';
import { Corporation } from '../../pages/Corporation';
import * as dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
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

    const tokenPath = path.resolve('.auth', 'token.json');
    const tokenJson = await fs.readFile(tokenPath, 'utf-8');
    const { access_token } = JSON.parse(tokenJson);

    const requestContext = await request.newContext({
      baseURL: process.env.API_BASE_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${access_token}`,
        'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY || '',
      },
    });

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
