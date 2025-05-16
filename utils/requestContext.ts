import * as fs from 'fs/promises';
import * as path from 'path';
import { request, APIRequestContext } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export async function getAuthorizedRequestContext(): Promise<APIRequestContext> {
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
