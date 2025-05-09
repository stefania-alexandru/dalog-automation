import { test, expect } from '@playwright/test';
import { Homepage } from '../../pages/Homepage';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('should update Machine Conditions table when Conditions pie chartfilter is clicked', async ({
  page,
}) => {
  const homepage = new Homepage(page);

  await homepage.clickFilterInPieChart(2, 1);
  await homepage.validateMachineConditions();
});
