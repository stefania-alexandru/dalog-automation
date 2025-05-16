import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authDir = path.join(__dirname, '../.auth');
const authFile = path.join(authDir, 'user.json');
const tokenFile = path.join(authDir, 'token.json');

setup('authenticate and capture token', async ({ page }) => {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;

  if (!email || !password) {
    throw new Error('Missing EMAIL or PASSWORD in .env');
  }

  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  page.on('response', async (response) => {
    if (response.url().includes('/token') && response.status() === 200) {
      const jsonResponse = await response.json();
      const token = jsonResponse.access_token;

      if (token) {
        fs.writeFileSync(tokenFile, JSON.stringify({ access_token: token }));
      }
    }
  });

  await page.goto('/');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  await page.waitForURL('/');
  await expect(
    page.getByRole('button', { name: 'Quick Settings' })
  ).toBeVisible();

  await page.context().storageState({ path: authFile });
});
