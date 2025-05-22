import { getAuthorizedRequestContext } from './requestContext';

export async function generateUniquePropertyValue(
  page: string,
  property: string
): Promise<string> {
  const requestContext = await getAuthorizedRequestContext();

  while (true) {
    const uniqueString = generateFormattedString();
    const response = await requestContext.get(
      `${process.env.API_BASE_URL}/dev/meta/read/v1/${page}`
    );

    if (!response.ok()) {
      console.error(`Request failed with status: ${response.status()}`);
      return 'null';
    }

    const entities = await response.json();

    if (Array.isArray(entities)) {
      const isPropertyValueUnique = entities.some(
        (entity: { property: string }) => entity.property === uniqueString
      );

      if (!isPropertyValueUnique) {
        return uniqueString;
      }
    } else {
      console.error('Expected an array but got:', entities);
    }
  }
}

function generateFormattedString() {
  return `${rand(2)}-${rand(3)}-${rand(2)}`;
}

function rand(length: number) {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
}
