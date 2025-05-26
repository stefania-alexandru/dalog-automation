import { expect } from '@playwright/test';
import { getAuthorizedRequestContext } from '../utils/requestContext';

export async function findEntityByName(endpoint: string, name: string) {
  const requestContext = await getAuthorizedRequestContext();
  const response = await requestContext.get(endpoint);
  expect(response.ok()).toBeTruthy();

  const entities = await response.json();
  const entity = entities.find((item: any) => item.name === name);
  expect(entity).toBeTruthy();

  return entity;
}
