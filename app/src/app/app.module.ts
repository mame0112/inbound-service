import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { IgxCalendarModule, IgxNavbarModule } from 'igniteui-angular';

import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';

import { LandingComponent } from './landing/landing.component';
import { VisitStartComponent } from './visit-start/visit-start.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatIconModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { FlexLayoutModule } from '@angular/flex-layout';


import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HostStartComponent } from './host-start/host-start.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ChooseComponent } from './choose/choose.component';

const config = new AuthServiceConfig([
{
  id: FacebookLoginProvider.PROVIDER_ID,
  provider: new FacebookLoginProvider('1194303814099473')
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    VisitStartComponent,
    HeaderComponent,
    FooterComponent,
    HostStartComponent,
    ConversationComponent,
    ChooseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatDatepickerModule,
    IgxNavbarModule,
    NgbModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
