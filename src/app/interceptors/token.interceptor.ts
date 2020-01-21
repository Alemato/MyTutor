import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {UserService} from '../services/user.service';
import {AUTH} from '../constants';



@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private userService: UserService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // Get the auth token from the service.
        console.log('avvio intercettore');
        const authToken = this.userService.getToken();
        console.log(req.url + ' ' + req.params + ' ' + authToken);
        if (authToken !== null && authToken !== undefined && authToken !== '') {
                console.log('adding token into header');
                // Clone the request and replace the original headers with
                // cloned headers, updated with the authorization.
                const authReq = req.clone({
                    headers: req.headers.set(AUTH, `Bearer ${authToken}`)
                });
                return next.handle(authReq);
            } else {
                return next.handle(req);
            }
        }
}
