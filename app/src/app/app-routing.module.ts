import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { VisitStartComponent } from './visit-start/visit-start.component';
import { HostStartComponent } from './host-start/host-start.component';
import { ConversationComponent } from './conversation/conversation.component';

const routes: Routes = [
    { path: '', redirectTo: '/landing', pathMatch: 'full' },
    { path: 'landing', component: LandingComponent },
    { path: 'visit-start', component: VisitStartComponent },
    { path: 'host-start', component: HostStartComponent },
    { path: 'conversation', component: ConversationComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
