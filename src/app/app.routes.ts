import { Routes } from '@angular/router';
import { AuthComponent } from './modules/components/auth/auth.component';
import { tokenGuard } from './core/guards/token.guard';
import { MainComponent } from './modules/components/main/main.component';
import { authGuard } from './core/guards/auth.guard';
import { TeamsComponent } from './modules/components/teams/teams.component';
import { CalendarComponent } from './modules/shared/calendar/calendar.component';
import { TodoComponent } from './modules/shared/todo/todo.component';

export const routes: Routes = [
    {path: "auth", component: AuthComponent, canActivate: [tokenGuard]},
    {path: "main", component: MainComponent, canActivate: [authGuard]},
    {path: "teams", component: TeamsComponent, canActivate: [authGuard]},
    {path: "calendar", component: CalendarComponent, canActivate: [authGuard]}, //Need to be deleted
    {path: "todo", component: TodoComponent, canActivate: [authGuard]}, //Need to be deleted
    {path: '**', component: AuthComponent, canActivate: [tokenGuard]}
];
