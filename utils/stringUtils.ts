import { faker } from '@faker-js/faker';
import { getAuthorizedRequestContext } from './apiUtils';

export function generateFormattedString(): string {
  return `${rand(2)}-${rand(3)}-${rand(2)}`;
}

function rand(length: number): string {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
}

export async function generateUniqueEntityName(
  endpoint: string,
  type: 'machine' | 'project' | 'company' | 'corporation'
): Promise<string> {
  const requestContext = await getAuthorizedRequestContext();
  const response = await requestContext.get(endpoint);
  const entity = await response.json();

  if (!Array.isArray(entity)) {
    throw new Error('Invalid data format');
  }

  while (true) {
    let newEntityName =
      type === 'machine' || type === 'project'
        ? faker.commerce.product()
        : faker.company.name();

    const isNameTaken = entity.some((e) => e.name === newEntityName);

    if (!isNameTaken) {
      return newEntityName;
    }
  }
}
