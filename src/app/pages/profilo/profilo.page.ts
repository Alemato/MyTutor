import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Utente} from '../../model/old/utente.model';
import {Events} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.page.html',
  styleUrls: ['./profilo.page.scss'],
})
export class ProfiloPage implements OnInit {
  private students$: BehaviorSubject<Utente> = new BehaviorSubject<Utente>({} as Utente);
  private timeDiff: number;
  private age: number;
  private data1;

  constructor(
      private storage: Storage,
      public event: Events,
  ) {
    this.event.subscribe('aggiorna', mario => {
      this.storage.get('ute').then((value) => {
        this.students$.next(value);
        });
    });
  }
  ngOnInit() {
    this.storage.get('ute').then((value) => {
      this.students$.next(value);
      this.data1 = new Date(Date.parse(this.students$.value.datanascita));
      this.timeDiff = Math.abs(Date.now() - this.data1.getTime());
      this.age = Math.floor((this.timeDiff / (1000 * 3600 * 24)) / 365.25);
    });
  }
}
