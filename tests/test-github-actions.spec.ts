import { test } from '@playwright/test';

test('test github actions', async ({ page }) => {
  await page.goto('/');
});
