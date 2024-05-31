import {Component} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {RouterLink, RouterModule, RouterOutlet} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {LogoComponent} from "../../components/logo/logo.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    NgClass,
    NgIf,
    LogoComponent,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  StoreName: string = 'Mom and Pop Store Name';
}
