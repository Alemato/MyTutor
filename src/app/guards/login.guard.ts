import { Injectable } from '@angular/core';
import {CanActivate, CanActivateChild} from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from '../services/user.service';
import {NavController} from '@ionic/angular';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate, CanActivateChild  {
  constructor(private userService: UserService, private navController: NavController) {
  }

  canActivate(): Observable<boolean> {
    console.log('guardia login');
    return this.userService.isLogged()
        .pipe(
            take(1),
            map((isLoggedIn: boolean) => {
              console.log('login è');
              console.log(isLoggedIn);
              if (isLoggedIn) {
                this.navController.navigateRoot('home');
                return false;
              }
              return true;
            })
        );
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }
}
