import {Component, Inject, OnInit} from '@angular/core';
import {LogoComponent} from "../logo/logo.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormsModule, NgForm} from "@angular/forms";
import {BusinessService} from "../../services/business.service";
import {Business} from "../../models/business.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {DOCUMENT, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {environment} from "../../../environment";

@Component({
  selector: 'app-login-information-input-container',
  standalone: true,
  imports: [
    LogoComponent,
    RouterLink,
    FormsModule,
    MatInput,
    MatError,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgIf,
    MatIconModule,
  ],
  templateUrl: './login-information-input-container.component.html',
  styleUrl: './login-information-input-container.component.css'
})
export class LoginInformationInputContainerComponent implements OnInit {
  authenticationUrl = environment.authorizationUrl;
  businessName: string = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private businessService: BusinessService,
              private snackBar: MatSnackBar,
              @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    // logged In
    if (sessionStorage.getItem('id_token')) {
      this.router.navigate(['/home', {outlets: {'navBar': ['dashboard-page']}}]);
    }

    // login/signUp
    this.route.fragment.subscribe((fragments) => {
      if (!fragments) {
        return;
      }

      const fragment = fragments.split('&')[1]?.split('=');
      if (fragment[0] !== 'id_token') {
        return;
      }

      const token = fragment[1];
      if (token) {
        sessionStorage.setItem('id_token', token);

        let businessName = sessionStorage.getItem('businessName')
        if (businessName) {
          // call API to register
          const request: Business = {
            name: businessName
          }
          this.businessService.registerBusiness(request).subscribe({
            next: response => {
              if (response.success) {
                this.router.navigate(['/home', {outlets: {'navBar': ['dashboard-page']}}]);
              }
            },
            error: err => {
              this.snackBar.open('An error occurred registering business.', 'X', {"duration": 4000});
            }
          });
       } else {
          this.router.navigate(['/home', {outlets: {'navBar': ['dashboard-page']}}]);
        }
      }
    });
  }

  register(registrationForm: NgForm) {
    if (registrationForm.form.valid) {
      sessionStorage.setItem('businessName', this.businessName);
      this.document.location.href = this.authenticationUrl;
    }

  }

  login() {
    this.document.location.href = this.authenticationUrl;
  }
}
