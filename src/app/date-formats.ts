import { Optional, Inject, InjectionToken } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import dayjs, { Dayjs } from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';


export interface DayJsDateAdapterOptions {
  /**
   * Turns the use of utc dates on or off.
   * Changing this will change how Angular Material components like DatePicker output dates.
   * {@default false}
   */
  useUtc?: boolean;
}

/** InjectionToken for moment date adapter to configure options. */
export const DAY_JS_DATE_ADAPTER_OPTIONS = new InjectionToken<DayJsDateAdapterOptions>(
  'DAY_JS_DATE_ADAPTER_OPTIONS', {
  providedIn: 'root',
  factory: DAY_JS_DATE_ADAPTER_OPTIONS_FACTORY
});

export function DAY_JS_DATE_ADAPTER_OPTIONS_FACTORY(): DayJsDateAdapterOptions {
  return {
    useUtc: false
  };
}

export interface DayJsDateAdapterFormats {
  parse: {
    dateInput: string,
  };
  display: {
    dateInput: string,
    monthYearLabel: string,
    dateA11yLabel: string,
    monthYearA11yLabel: string,
  };
}

/** InjectionToken for moment date adapter to configure options. */
export const DAY_JS_DATE_ADAPTER_FORMATS = new InjectionToken<DayJsDateAdapterFormats>(
  'DAY_JS_DATE_ADAPTER_FORMATS', {
  providedIn: 'root',
  factory: DAY_JS_DATE_ADAPTER_FORMAT_FACTORY
});

export function DAY_JS_DATE_ADAPTER_FORMAT_FACTORY(): DayJsDateAdapterFormats {
  return APP_DATE_FORMAT_DEFAULTS;
}

/**
 * Custom Date-Formats and Adapter (using https://github.com/iamkun/dayjs)
 */
export const APP_DATE_FORMAT_DEFAULTS = {
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


/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

export class AppDateAdapter extends DateAdapter<Dayjs> {
  private localeData: {
    firstDayOfWeek: number,
    longMonths: string[],
    shortMonths: string[],
    dates: string[],
    longDaysOfWeek: string[],
    shortDaysOfWeek: string[],
    narrowDaysOfWeek: string[]
  };

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) public dateLocale: string,
              @Optional() @Inject(DAY_JS_DATE_ADAPTER_OPTIONS) private options?: DayJsDateAdapterOptions) {
    super();

    // Initalize DayJS-Parser
    dayjs.extend(customParseFormat);
    dayjs.extend(localizedFormat);
    dayjs.extend(utc);
    this.setLocale(dateLocale);
  }

  // TODO: Implement
  setLocale(locale: string) {
    super.setLocale(locale);

    // let momentLocaleData = moment.localeData(locale);
    this.localeData = {
      firstDayOfWeek: +this.dayJs().startOf('week').format('d'),
      longMonths: range(12, (i) => this.dayJs().set('month', i).format('MMMM')),
      shortMonths: range(12, (i) => this.dayJs().set('month', i).format('MMM')),
      dates: range(31, (i) => this.createDate(2017, 0, i + 1).format('D')),
      longDaysOfWeek: range(7, (i) => this.dayJs().set('day', i).format('dddd')),
      shortDaysOfWeek: range(7, (i) => this.dayJs().set('day', i).format('ddd')),
      narrowDaysOfWeek: range(7, (i) => this.dayJs().set('day', i).format('dd')),
    };
  }

  getYear(date: Dayjs): number {
    return this.dayJs(date).year();
  }

  getMonth(date: Dayjs): number {
    return this.dayJs(date).month();
  }

  getDate(date: Dayjs): number {
    return this.dayJs(date).date();
  }

  getDayOfWeek(date: Dayjs): number {
    return this.dayJs(date).day();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return style === 'long' ? this.localeData.longMonths : this.localeData.shortMonths;
  }

  getDateNames(): string[] {
    return this.localeData.dates;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style === 'long') {
      return this.localeData.longDaysOfWeek;
    }
    if (style === 'short') {
      return this.localeData.shortDaysOfWeek;
    }
    return this.localeData.narrowDaysOfWeek;
  }

  getYearName(date: Dayjs): string {
    return this.dayJs(date).format('YYYY');
  }

  getFirstDayOfWeek(): number {
    return this.localeData.firstDayOfWeek;
  }

  getNumDaysInMonth(date: Dayjs): number {
    return this.dayJs(date).daysInMonth();
  }

  clone(date: Dayjs): Dayjs {
    return date.clone();
  }

  createDate(year: number, month: number, date: number): Dayjs {
    const returnDayjs = this.dayJs()
      .set('year', year)
      .set('month', month)
      .set('date', date);
    return returnDayjs;
  }

  today(): Dayjs {
    return this.dayJs();
  }

  // TODO: Handle locales here.
  parse(value: any, parseFormat: string): Dayjs | null {
    return value ? this.dayJs(value, parseFormat) : null;
  }

  format(date: Dayjs, displayFormat: string): string {
    if (!this.isValid(date)) {
      throw Error('MomentDateAdapter: Cannot format invalid date.');
    }
    return date.format(displayFormat);
  }

  addCalendarYears(date: Dayjs, years: number): Dayjs {
    return date.add(years, 'year');
  }

  addCalendarMonths(date: Dayjs, months: number): Dayjs {
    return date.add(months, 'month');
  }

  addCalendarDays(date: Dayjs, days: number): Dayjs {
    return date.add(days, 'day');
  }

  toIso8601(date: Dayjs): string {
    return date.toISOString();
  }

  /**
   * Attempts to deserialize a value to a valid date object. This is different from parsing in that
   * deserialize should only accept non-ambiguous, locale-independent formats (e.g. a ISO 8601
   * string). The default implementation does not allow any deserialization, it simply checks that
   * the given value is already a valid date object or null. The `<mat-datepicker>` will call this
   * method on all of it's `@Input()` properties that accept dates. It is therefore possible to
   * support passing values from your backend directly to these properties by overriding this method
   * to also deserialize the format used by your backend.
   * @param value The value to be deserialized into a date object.
   * @returns The deserialized date object, either a valid date, null if the value can be
   *     deserialized into a null date (e.g. the empty string), or an invalid date.
   */
  deserialize(value: any): Dayjs | null {
    let date;
    if (value instanceof Date) {
      date = this.dayJs(value);
    } else if (this.isDateInstance(value)) {
      // Note: assumes that cloning also sets the correct locale.
      return this.clone(value);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      date = this.dayJs(value).toISOString();
    }
    if (date && this.isValid(date)) {
      return this.dayJs(date); // NOTE: Is this necessary since Dayjs is immutable and Moment was not.
    }
    return super.deserialize(value);
  }

  isDateInstance(obj: any): boolean {
    return dayjs.isDayjs(obj);
  }

  isValid(date: Dayjs): boolean {
    return this.dayJs(date).isValid();
  }

  // TODO: How to create an invalid Dayjs object?
  invalid(): Dayjs {
    return;
  }

  private dayJs(input?: any, format?: string): Dayjs {
    const { useUtc }: DayJsDateAdapterOptions = this.options || {};
    return useUtc ? dayjs.utc(input, format) : dayjs(input, format);
  }

  // /** Creates a Dayjs instance while respecting the current UTC settings. */
  // private _createMoment(
  //   date: MomentInput,
  //   format?: MomentFormatSpecification,
  //   locale?: string,
  // ): Dayjs {
  //   const { strict, useUtc }: DayJsDateAdapterOptions = this._options || {};

  //   return useUtc
  //     ? moment.utc(date, format, locale, strict)
  //     : moment(date, format, locale, strict);
  // }
}
