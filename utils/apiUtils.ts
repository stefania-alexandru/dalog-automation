import * as fs from 'fs/promises';
import * as path from 'path';
import { request, APIRequestContext, expect } from '@playwright/test';
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

export async function fetchAndVerifyEntityByName(
  endpoint: string,
  name: string
): Promise<any> {
  const requestContext = await getAuthorizedRequestContext();
  const response = await requestContext.get(endpoint);
  expect(response.ok()).toBeTruthy();

  const entities = await response.json();
  const entity = entities.find((item: any) => item.name === name);
  expect(entity).toBeTruthy();

  return entity;
}
