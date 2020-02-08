import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../model/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  private user$: BehaviorSubject<User>;
  isSearch = false;

  constructor(private userService: UserService,
              private route: Router) { }

  ngOnInit() {
    this.user$ = this.userService.getUser();
    console.log(this.route.url);
  }

  isInSearch() {
    this.isSearch = ('/tabs/ricerca-lezioni' === this.route.url);
  }
}
