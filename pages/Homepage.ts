import { Locator, Page } from '@playwright/test';
import { HelperBase } from '../helpers/HelperBase';
import { GridHelper } from '../helpers/Grid';

export class Homepage extends HelperBase {
  readonly pieChartPanels: Locator;
  private gridHelper: GridHelper;

  constructor(page: Page, gridSelector: string) {
    super(page);
    this.pieChartPanels = page.locator('.panel-card');
    this.gridHelper = new GridHelper(page, gridSelector);
  }

  /**
   * Clicks on a filter (legend circle) in a specified pie chart.
   *
   * @param index - The 1-based index of the pie chart (1 for the first, 2 for the second, etc.).
   * @param filterIndex - The 0-based index of the filter (legend circle) in the selected pie chart.
   */
  async clickFilterInPieChart(index: number, filterIndex: number): Promise<void> {
    const filterCircle = this.pieChartPanels
      .nth(index - 1)
      .locator('.legend-circle')
      .nth(filterIndex);

    await filterCircle.click();
  }

  async validateMachineConditionsColumn() {
    return await this.gridHelper.assertAllColumnCellsEqual('Condition');
  }

  async validateLastDataUpdateColumn() {
    return await this.gridHelper.assertColumnCellColorsAreEqual(
      'Last Data Update'
    );
  }
}
