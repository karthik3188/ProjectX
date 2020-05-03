import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelfRegisterPageRoutingModule } from './self-register-routing.module';

import { SelfRegisterPage } from './self-register.page';
import { AgmCoreModule } from '@agm/core';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { FileSizeFormatPipe } from './file-size-format.pipe';

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelfRegisterPageRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (LanguageLoader),
        deps: [HttpClient]
      }
    }),
    AgmCoreModule.forRoot({
      apiKey: '', 
      libraries: ['places', 'geometry']
    })
  ],
  declarations: [SelfRegisterPage, FileSizeFormatPipe]
})
export class SelfRegisterPageModule {}
