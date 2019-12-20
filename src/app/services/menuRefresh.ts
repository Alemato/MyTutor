import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class MenuRefresh {
    private menuRefreshSource = new Subject();
    menuRefreshSource$ = this.menuRefreshSource.asObservable();

    publishMenuRefresh() {
        this.menuRefreshSource.next();
    }
}
