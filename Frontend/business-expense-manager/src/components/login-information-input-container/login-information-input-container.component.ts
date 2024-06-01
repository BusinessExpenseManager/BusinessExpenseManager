import {Component} from '@angular/core';
import {LogoComponent} from "../logo/logo.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login-information-input-container',
  standalone: true,
  imports: [
    LogoComponent,
    RouterLink,
  ],
  templateUrl: './login-information-input-container.component.html',
  styleUrl: './login-information-input-container.component.css'
})
export class LoginInformationInputContainerComponent {

}
