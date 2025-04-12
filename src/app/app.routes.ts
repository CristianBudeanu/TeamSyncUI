import { Routes } from '@angular/router';
import { AuthComponent } from './modules/components/auth/auth.component';
import { tokenGuard } from './core/guards/token.guard';
import { MainComponent } from './modules/components/main/main.component';
import { authGuard } from './core/guards/auth.guard';
import { CalendarComponent } from './modules/shared/calendar/calendar.component';
import { TodoComponent } from './modules/shared/todo/todo.component';
import { ProjectsComponent } from './modules/components/projects/projects.component';
import { ProjectPageComponent } from './modules/components/projects/project-page/project-page.component';
import { AcceptInvitationComponent } from './modules/components/projects/accept-invitation/accept-invitation.component';
import { LayoutComponent } from './modules/layout/layout.component';
import { AuthLayoutComponent } from './modules/layout/auth-layout/auth-layout.component';
import { ChatComponent } from './modules/components/chat/chat.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'auth', component: AuthComponent, canActivate: [tokenGuard] },
    ],
  },

  {
    path: '',
    component: LayoutComponent, // <app-layout>
    children: [
      { path: 'main', component: MainComponent, canActivate: [authGuard] },
      {
        path: 'projects',
        component: ProjectsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'project/:id',
        component: ProjectPageComponent,
        canActivate: [authGuard],
      },
      {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [authGuard],
      },
      {
        path: 'chat',
        component: ChatComponent,
        canActivate: [authGuard]
      },
      { path: 'todo', component: TodoComponent, canActivate: [authGuard] }, //Need to be deleted
      {
        path: 'accept-invitation/:invitationToken',
        component: AcceptInvitationComponent,
      },
      { path: '**', component: AuthComponent, canActivate: [tokenGuard] },
    ],
  },
];
