import { Locator, Page } from '@playwright/test';
import { HelperBase } from './HelperBase';
import { GridHelper } from '../helpers/GridHelper';

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
  async clickFilterInPieChart(index: number, filterIndex: number) {
    const filterCircle = this.pieChartPanels
      .nth(index - 1)
      .locator('.legend-circle')
      .nth(filterIndex);

    await filterCircle.click();
  }

  async validateMachineConditions() {
    await this.gridHelper.assertColumnValuesAreConsistent('Condition');
  }

  async validateLastData() {
    await this.gridHelper.assertColumnValuesHaveTheSameColor(
      'Last Data Update'
    );
  }
}
