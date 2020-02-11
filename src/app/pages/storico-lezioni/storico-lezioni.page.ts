import {Component, OnInit} from '@angular/core';
import {LoadingController, PopoverController} from '@ionic/angular';
import {PopoverFiltroStoricoLezioniComponent} from '../../popovers/popover-filtro-storico-lezioni/popover-filtro-storico-lezioni.component';
import {BookingService} from '../../services/booking.service';
import {BehaviorSubject} from 'rxjs';
import {Booking} from '../../model/booking.model';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-storico-lezioni',
    templateUrl: './storico-lezioni.page.html',
    styleUrls: ['./storico-lezioni.page.scss'],
})
export class StoricoLezioniPage implements OnInit {
    private bookings$: BehaviorSubject<Booking[]> = new BehaviorSubject<Booking[]>([] as Booking[]);
    public user$: BehaviorSubject<User>;
    private loading;
    private listUser: User[] = [];
    private pleaseWaitMessage: string;

    constructor(public popoverController: PopoverController,
                private bookingService: BookingService,
                private userService: UserService,
                private loadingController: LoadingController,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        this.initTranslate();
        this.user$ = this.userService.getUser();
        this.bookingService.getRestHistoricalBookingFilter('', '', '', '', '', '').subscribe((bookings) => {
            console.log(bookings);
            this.bookings$.next(bookings);
            this.bookingService.getRestUsersBooking().subscribe((users) => {
                users.forEach((user) => {
                    if (this.user$.value.roles !== user.roles) {
                        this.listUser.push(user);
                    }
                });
            });
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
            console.log(data);
            if (data.data !== undefined) {
                // tslint:disable-next-line:max-line-length
                /*this.bookingService.getRestHistoricalBookingFilter(data.data.selectMateria, data.data.selectSotto, data.data.nomeLezione, data.data.dataLezione, data.data.selectUtente, data.data.statoLezione).subscribe((item) => {
                    console.log(item);
                });*/
            }
        });
        await popover.present();
    }

    async loadingPresent() {
        this.loading = await this.loadingController.create({
            message: this.pleaseWaitMessage,
            translucent: true
        });
        return await this.loading.present();
    }

    async disLoading() {
        await this.loading.dismiss();
    }

    private initTranslate() {
        this.translateService.get('PLEASE_WAIT_MESSAGE').subscribe((data) => {
            this.pleaseWaitMessage = data;
        });
    }
}
