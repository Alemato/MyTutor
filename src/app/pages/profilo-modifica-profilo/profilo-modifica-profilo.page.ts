import {Component, OnInit} from '@angular/core';
import {ProfiloPage} from '../profilo/profilo.page';
import {ModificaProfiloPage} from '../modifica-profilo/modifica-profilo.page';
// import {UserService} from '../../services/user.service';
import {UsersService} from '../../services/users.service';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-profilo-modifica-profilo',
    templateUrl: './profilo-modifica-profilo.page.html',
    styleUrls: ['./profilo-modifica-profilo.page.scss'],
})
export class ProfiloModificaProfiloPage implements OnInit {
    constructor() {
    }

    profilo = ProfiloPage;
    modificaProfilo = ModificaProfiloPage;

    ngOnInit() {
    }

}
