import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class MenuRefresh {
    private menuRefreshSource = new Subject();
    menuRefreshSource$ = this.menuRefreshSource.asObservable();

    /**
     * funzione che publica un refresh
     */
    publishMenuRefresh() {
        this.menuRefreshSource.next();
    }
}
