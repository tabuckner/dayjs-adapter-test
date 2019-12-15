import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatInputModule,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from '@angular/material';
import { Platform } from '@angular/cdk/platform';


import { AppComponent } from './app.component';
import { AppDateAdapter, DAY_JS_DATE_ADAPTER_OPTIONS, DAY_JS_DATE_ADAPTER_FORMATS, APP_DATE_FORMAT_DEFAULTS } from './date-formats';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMAT_DEFAULTS },
    { provide: DAY_JS_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
      // deps: [MAT_DATE_LOCALE, Platform]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
