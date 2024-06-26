import {Routes} from '@angular/router';
import {LoginPageComponent} from "../pages/login-page/login-page.component";
import {ViewGoalsPageComponent} from "../pages/view-goals-page/view-goals-page.component";
import {ViewCategoriesPageComponent} from "../pages/view-categories-page/view-categories-page.component";
import {CashflowPageComponent} from "../pages/cashflow-page/cashflow-page.component";
import {NavbarComponent} from "../components/navbar/navbar.component";
import {AuthGuard} from "../services/auth-guard.service";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'home',
    component: NavbarComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'goals',
        component: ViewGoalsPageComponent,
        outlet: 'navBar'
      },
      {
        path: 'cashflow',
        component: CashflowPageComponent,
        outlet: 'navBar'
      },
      {
        path: 'categories',
        component: ViewCategoriesPageComponent,
        outlet: 'navBar'
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
