import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {BehaviorSubject} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {User} from '../../model/user.model';
import {Teacher} from '../../model/teacher.model';
import {Student} from '../../model/student.model';

@Component({
    selector: 'app-profilo-singolo',
    templateUrl: './profilo-singolo.page.html',
    styleUrls: ['./profilo-singolo.page.scss'],
})
export class ProfiloSingoloPage implements OnInit {
    private user$: BehaviorSubject<Student|Teacher> = new BehaviorSubject<Student|Teacher>({} as Student | Teacher);
    private timeDiff: number;
    private age: number;
    private data;

    constructor(private route: ActivatedRoute,
                private userService: UserService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.userService.getProfilobyID(parseInt(params.get('id'), 0)).subscribe((user) => {
                this.user$.next(user);
                if (user.roles === 2) {
                    this.data = new Date(user.birthday);
                    this.timeDiff = Math.abs(Date.now() - this.data.getTime());
                    this.age = Math.floor((this.timeDiff / (1000 * 3600 * 24)) / 365.25);
                }
            });
        });
    }

}
