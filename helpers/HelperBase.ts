import { Page } from '@playwright/test';
import path from 'path';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { request } from '@playwright/test';

dotenv.config();

export class HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForNumberOfSeconds(timeInSeconds: number): Promise<void> {
    this.page.waitForTimeout(timeInSeconds * 1000);
  }

  protected async getAuthorizedRequestContext() {
    const tokenPath = path.resolve('.auth', 'token.json');
    const tokenJson = await fs.readFile(tokenPath, 'utf-8');
    const { access_token } = JSON.parse(tokenJson);

    return await request.newContext({
      baseURL: process.env.API_BASE_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${access_token}`,
        'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY || '',
      },
    });
  }
}
