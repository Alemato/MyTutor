import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
    selector: 'app-profilo-singolo',
    templateUrl: './profilo-singolo.page.html',
    styleUrls: ['./profilo-singolo.page.scss'],
})
export class ProfiloSingoloPage implements OnInit {
    private student$: BehaviorSubject<Student>;
    private teacher$: BehaviorSubject<Teacher>;
    private timeDiff: number;
    private age: number;
    private data;

    constructor(private route: ActivatedRoute,
                private userService: UserService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.userService.getProfiloEmail(params.get('email'), false).subscribe((data) => {
                console.log(data);
                if (data.roles === 2) {
                    this.student$ = null;
                    this.teacher$ = new BehaviorSubject<Teacher>({} as Teacher);
                    this.teacher$.next(data);
                    this.data = new Date(this.teacher$.value.birthday);
                    this.timeDiff = Math.abs(Date.now() - this.data.getTime());
                    this.age = Math.floor((this.timeDiff / (1000 * 3600 * 24)) / 365.25);
                } else if (data.roles === 1) {
                    this.teacher$ = null;
                    this.student$ = new BehaviorSubject<Student>({} as Student);
                    this.student$.next(data);
                }
            });
        });
    }

}
