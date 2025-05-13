import { Locator, Page } from 'playwright';
import { HelperBase } from '../pages/HelperBase';

export class GridHelper extends HelperBase {
  private gridLocator: Locator;

  constructor(page: Page, gridLocator: string) {
    super(page);
    this.gridLocator = page.locator(gridLocator);
  }

  private async getColumnHeaders() {
    return await this.gridLocator
      .locator('[role="grid"] [role="columnheader"]')
      .allTextContents();
  }

  private async getColumnIndexByName(columnName: string) {
    const columnHeaders = await this.getColumnHeaders();
    const columnIndex = columnHeaders.indexOf(columnName);
    if (columnIndex === -1) {
      throw new Error(`"${columnName}" column not found`);
    }
    return columnIndex;
  }

  private async getColumnTextContents(columnIndex: number) {
    const columnCells = this.gridLocator.locator(
      `[role="gridcell"]:nth-child(${columnIndex + 2})`
    );
    return await columnCells.allTextContents();
  }

   public async assertColumnValuesAreConsistent(columnName: string) {
    const columnIndex = await this.getColumnIndexByName(columnName);
    const columnTexts = await this.getColumnTextContents(columnIndex);

    if (columnTexts.length === 0) {
      throw new Error(`No rows found in the "${columnName}" column`);
    }

    const firstConditionText = columnTexts[0];
    for (let i = 1; i < columnTexts.length; i++) {
      if (columnTexts[i] !== firstConditionText) {
        throw new Error(
          `Inconsistent value found in the "${columnName}" column`
        );
      }
    }
  }
  
  public async assertColumnValuesHaveTheSameColor(columnName: string) {
    const columnIndex = await this.getColumnIndexByName(columnName);
    const columnCells = this.gridLocator.locator(
      `[role="gridcell"]:nth-child(${columnIndex + 2})`
    );
    const firstCellColor = await columnCells.nth(0).evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    for (let i = 1; i < await columnCells.count(); i++) {
      const cellColor = await columnCells
        .nth(i)
        .evaluate((el) => window.getComputedStyle(el).color);
      if (cellColor !== firstCellColor) {
        throw new Error(
          `Inconsistent color found in the "${columnName}" column`
        );
      }
    }
  }
}
