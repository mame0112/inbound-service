import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { ChooseComponent } from './choose/choose.component';
import { VisitStartComponent } from './visit-start/visit-start.component';
import { HostStartComponent } from './host-start/host-start.component';
import { ConversationComponent } from './conversation/conversation.component';
import { MyPageComponent } from './my-page/my-page.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { DebugComponent } from './debug/debug.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
    { path: '', redirectTo: '/landing', pathMatch: 'full' },
    { path: 'landing', component: LandingComponent },
    { path: 'choose', component: ChooseComponent },
    { path: 'visit-start', component: VisitStartComponent },
    { path: 'host-start', component: HostStartComponent },
    { path: 'conversation/:conv_id', component: ConversationComponent },
    { path: 'my-page', component: MyPageComponent },
    { path: 'privacy', component: PrivacyComponent },
    { path: 'terms', component: TermsComponent },
    { path: 'debug', component: DebugComponent },
    { path: 'chat', component: ChatComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
