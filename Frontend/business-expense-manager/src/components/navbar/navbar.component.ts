import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {LogoComponent} from "../logo/logo.component";
import {MatListModule} from "@angular/material/list";
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {Router, RouterLink, RouterModule, RouterOutlet} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-navbar',
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
    NgStyle,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, AfterViewInit {

  StoreName: string = 'Mom and Pop Store Name';

  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  isMobile: boolean = false;

  constructor(
    private router: Router,
    private observer: BreakpointObserver,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    this.router.navigate(['/home', { outlets: { 'navBar': ['dashboard-page'] } }]);

    this.observer
      .observe(['(max-width: 800px)'])
      .subscribe((screenSize) => {
        this.isMobile = screenSize.matches;
    });
  }

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
    }
  }

}
