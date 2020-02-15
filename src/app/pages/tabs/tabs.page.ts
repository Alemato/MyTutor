import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  private user$: BehaviorSubject<Student | Teacher>;
  isSearch = false;

  constructor(private userService: UserService,
              private route: Router) { }

  ngOnInit() {
    this.user$ = this.userService.getUser();
    console.log(this.route.url);
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave tabs');
  }

  isInSearch() {
    this.isSearch = ('/tabs/ricerca-lezioni' === this.route.url);
  }
}
