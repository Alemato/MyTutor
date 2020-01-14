import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserService} from '../../services/user.service';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';

@Component({
    selector: 'app-profilo',
    templateUrl: './profilo.page.html',
    styleUrls: ['./profilo.page.scss'],
})
export class ProfiloPage implements OnInit {
    private userType: string;
    private student$: BehaviorSubject<Student>;
    private teacher$: BehaviorSubject<Teacher>;
    private timeDiff: number;
    private age: number;
    private data1;

    constructor(
        private userService: UserService,
    ) {
    }

    ngOnInit() {
        this.userType = this.userService.getTypeUser();
        if (this.userType === 'teacher') {
            this.teacher$ = this.userService.getUser();
            this.userService.getProfiloEmail(this.teacher$.value.email, true).subscribe(() => {});
            this.data1 = new Date(this.teacher$.value.birthday);
            this.timeDiff = Math.abs(Date.now() - this.data1.getTime());
            this.age = Math.floor((this.timeDiff / (1000 * 3600 * 24)) / 365.25);
        } else if (this.userType === 'student') {
            this.student$ = this.userService.getUser();
            this.userService.getProfiloEmail(this.student$.value.email, true).subscribe(() => {});
        }
    }
}
