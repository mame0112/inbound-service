import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { IgxCalendarModule, IgxNavbarModule } from 'igniteui-angular';

import { LandingComponent } from './landing/landing.component';
import { VisitStartComponent } from './visit-start/visit-start.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatIconModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatGridListModule, MatSnackBarModule, MatProgressSpinnerModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { FlexLayoutModule } from '@angular/flex-layout';

import { ScrollingModule } from '@angular/cdk/scrolling';

import { CookieService } from 'ngx-cookie-service';

// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HostStartComponent } from './host-start/host-start.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ChooseComponent } from './choose/choose.component';
import { MyPageComponent } from './my-page/my-page.component';
import { DialogComponent } from './dialog/dialog.component';
import { DebugComponent } from './debug/debug.component';

import { ScrollableDirective } from './directive/scrollable.directive';
import { OffsetTopDirective } from './directive/offset-top.directive';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ProgressDialogComponent } from './progress-dialog/progress-dialog.component';
import { ConversationInfoComponent } from './conversation-info/conversation-info.component';

// export function HttpLoaderFactory(http: HttpClient) {
//     return new TranslateHttpLoader(http);
// }

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    VisitStartComponent,
    HeaderComponent,
    FooterComponent,
    HostStartComponent,
    ConversationComponent,
    ChooseComponent,
    MyPageComponent,
    DialogComponent,
    DebugComponent,
    TermsComponent,
    PrivacyComponent,
    ScrollableDirective,
    OffsetTopDirective,
    ProgressDialogComponent,
    ConversationInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    IgxNavbarModule,
    NgbModule,
    ScrollingModule,
    MatSidenavModule
    // TranslateModule.forRoot({
    //   defaultLanguage: 'en',
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   }
    // })
  ],
  entryComponents: [
    DialogComponent,
    ProgressDialogComponent,
    ConversationInfoComponent
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
