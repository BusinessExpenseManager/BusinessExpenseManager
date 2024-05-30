import { Component } from '@angular/core';
import {
  LoginInformationInputContainerComponent
} from "../../components/login-information-input-container/login-information-input-container.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    LoginInformationInputContainerComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

}
