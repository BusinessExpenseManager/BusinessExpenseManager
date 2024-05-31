import { Routes } from '@angular/router';
import {LoginPageComponent} from "../pages/login-page/login-page.component";
import {DashboardComponent} from "../pages/dashboard/dashboard.component";
import {HomeComponent} from "../components/home/home.component";
import {GoalPageComponent} from "../pages/goal-page/goal-page.component";
import {ViewGoalsPageComponent} from "../pages/view-goals-page/view-goals-page.component";
import {ViewCategoriesPageComponent} from "../pages/view-categories-page/view-categories-page.component";
import {CashflowPageComponent} from "../pages/cashflow-page/cashflow-page.component";

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
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
      },

    ]
  }
];
