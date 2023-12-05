import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestingPageComponent } from './testing-page/testing-page.component';
import { KinesisTestComponent } from './kinesis-test/kinesis-test.component';

@NgModule({
  declarations: [
    AppComponent,
    TestingPageComponent,
    KinesisTestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
