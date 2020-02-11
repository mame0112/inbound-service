import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { ChooseComponent } from './choose/choose.component';
import { VisitStartComponent } from './visit-start/visit-start.component';
import { HostStartComponent } from './host-start/host-start.component';
import { ConversationComponent } from './conversation/conversation.component';
import { MyPageComponent } from './my-page/my-page.component';

const routes: Routes = [
    { path: '', redirectTo: '/landing', pathMatch: 'full' },
    { path: 'landing', component: LandingComponent },
    { path: 'choose', component: ChooseComponent },
    { path: 'visit-start', component: VisitStartComponent },
    { path: 'host-start', component: HostStartComponent },
    { path: 'conversation/:conv_id', component: ConversationComponent },
    { path: 'my-page', component: MyPageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
