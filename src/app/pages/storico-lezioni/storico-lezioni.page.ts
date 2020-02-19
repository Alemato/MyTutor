import {Component, OnInit} from '@angular/core';
import {LoadingController, PopoverController} from '@ionic/angular';
import {PopoverFiltroStoricoLezioniComponent} from '../../popovers/popover-filtro-storico-lezioni/popover-filtro-storico-lezioni.component';
import {BookingService} from '../../services/booking.service';
import {BehaviorSubject} from 'rxjs';
import {Booking} from '../../model/booking.model';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user.model';
import {TranslateService} from '@ngx-translate/core';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';

@Component({
    selector: 'app-storico-lezioni',
    templateUrl: './storico-lezioni.page.html',
    styleUrls: ['./storico-lezioni.page.scss'],
})
export class StoricoLezioniPage implements OnInit {
    private bookings$: BehaviorSubject<Booking[]> = new BehaviorSubject<Booking[]>([] as Booking[]);
    public user$: BehaviorSubject<Student | Teacher>;
    private loading = true;
    private listUser: User[] = [];
    private pleaseWaitMessage: string;

    constructor(public popoverController: PopoverController,
                private bookingService: BookingService,
                private userService: UserService,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        this.initTranslate();
        this.user$ = this.userService.getUser();
        this.bookingService.getRestHistoricalBookingFilter('', '', '', '', '', '').subscribe((bookings) => {
            this.loading = true;
            this.listaBookingFiltrati(bookings);
        });
    }

    listaBookingFiltrati(bookings: Booking[]) {
        this.bookings$.next(bookings);
        // serve per prendere la lista degli user (per il professore saranno di tipo studente e fice versa)
        this.listUser = [];
        this.bookingService.getRestUsersBooking().subscribe((users) => {
            users.forEach((user) => {
                // aggiungo univocamente gli user che hanno l'altro ruolo
                if (this.listUser.findIndex(ul => ul.idUser === user.idUser) === -1) {
                    if (user.roles !== this.user$.value.roles) {
                        this.listUser.push(user);
                    }
                }
            });
            this.loading = false;
        });
    }


    async presentPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: PopoverFiltroStoricoLezioniComponent,
            event: ev,
            translucent: true,
            componentProps: {listU: this.listUser}
        });
        popover.onDidDismiss().then((data) => {
            if (data.data !== undefined) {
                this.loading = true;
                // tslint:disable-next-line:max-line-length
                this.bookingService.getRestHistoricalBookingFilter(data.data.selectMateria, data.data.selectSotto, data.data.nomeLezione, data.data.dataLezione, data.data.selectUtente, data.data.statoLezione).subscribe((item) => {
                    this.listaBookingFiltrati(item);
                });
            }
        });
        await popover.present();
    }

    private initTranslate() {
        this.translateService.get('PLEASE_WAIT_MESSAGE').subscribe((data) => {
            this.pleaseWaitMessage = data;
        });
    }
}
