import {inject, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
class PermissionsService {

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = sessionStorage.getItem('id_token')

    if (token) {
      return true;
    }

    this.snackBar.open(
      'No Login Token Found.',
      'Ok',
      {"duration": 5000}
    );

    setTimeout(() => {
      sessionStorage.clear();
      this.router.navigate(['login']);
    }, 500);

    return false;

  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(PermissionsService).canActivate(next, state);
}




// export class AuthGuardService implements CanActivate, CanActivateChild {
//   constructor(private router: Router) {}
//
//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): boolean {
//     const loggedIn = true; // or false get you logged in status from state
//     if (loggedIn) {
//       return true;
//     }
//     this.router.navigate(["login"]);
//     return false;
//   }
//   canActivateChild(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): boolean {
//     return this.canActivate(next, state);
//   }
// }
