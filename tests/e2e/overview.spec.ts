import { test, expect } from '@playwright/test';
import { Homepage } from '../../pages/Homepage';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('should update Machine Conditions table when Conditions piechart filter is clicked', async ({
  page,
}) => {
  const homepage = new Homepage(page, '.machines-container');

  await homepage.clickFilterInPieChart(2, 1);
  const expectedCondition = await homepage.validateMachineConditionsColumn();
  expect(expectedCondition).toBe('Indication');
});

test('should update Machine Conditions table when Last Data piechart filter is clicked', async ({
  page,
}) => {
  const homepage = new Homepage(page, '.machines-container');

  await homepage.clickFilterInPieChart(3, 1);
  const expectedColor = await homepage.validateLastDataUpdateColumn();
  expect(expectedColor).toBe('rgb(255, 204, 0)');
});
