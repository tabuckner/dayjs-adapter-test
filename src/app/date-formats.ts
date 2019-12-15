import { Platform } from '@angular/cdk/platform';
import { NativeDateAdapter } from '@angular/material';
import * as dayjs from 'dayjs';
import 'dayjs/locale/de';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';


/**
 * Custom Date-Formats and Adapter (using https://github.com/iamkun/dayjs)
 */
export const APP_DATE_FORMATS = {
  parse: {
    dateInput: 'MM.DD.YYYY',
  },
  display: {
    dateInput: 'MM.DD.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

export class AppDateAdapter extends NativeDateAdapter {

  constructor(matDateLocale: string, platform: Platform) {
    super(matDateLocale, platform);

    // Initalize DayJS-Parser
    dayjs.locale('de');
    dayjs.extend(customParseFormat);
    dayjs.extend(localizedFormat);
  }

  parse(value: any): Date | null {
    return dayjs(value, 'DD.MM.YYYY').toDate();
  }

  format(date: Date, displayFormat: any): string {
    return dayjs(date).format(displayFormat);
  }
}
