import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild} from '@angular/router';
import {UserService} from '../services/user.service';
import {NavController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private userService: UserService, private navController: NavController) {
    }

    canActivate(): Observable<boolean> {
        return this.userService.isLogged()
            .pipe(
                take(1),
                map((isLoggedIn: boolean) => {
                    console.log('isloggedIn');
                    console.log(isLoggedIn);
                    if (!isLoggedIn) {
                        this.navController.navigateRoot('login');
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
