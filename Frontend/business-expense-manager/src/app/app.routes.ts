import {Routes} from '@angular/router';
import {LoginPageComponent} from "../pages/login-page/login-page.component";
import {DashboardPageComponent} from "../pages/dashboard-page/dashboard-page.component";
import {ViewGoalsPageComponent} from "../pages/view-goals-page/view-goals-page.component";
import {ViewCategoriesPageComponent} from "../pages/view-categories-page/view-categories-page.component";
import {CashflowPageComponent} from "../pages/cashflow-page/cashflow-page.component";
import {NavbarComponent} from "../components/navbar/navbar.component";

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
    children: [
      {
        path: 'dashboard-page',
        component: DashboardPageComponent,
        outlet: 'navBar'
      },
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
      }
    ]
  }
];
