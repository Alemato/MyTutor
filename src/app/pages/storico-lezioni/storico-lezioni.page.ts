import {Component, OnInit} from '@angular/core';
import {LoadingController, PopoverController} from '@ionic/angular';
import {PopoverFiltroStoricoLezioniComponent} from '../../popovers/popover-filtro-storico-lezioni/popover-filtro-storico-lezioni.component';
import {BookingService} from '../../services/booking.service';
import {BehaviorSubject} from 'rxjs';
import {Booking} from '../../model/booking.model';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user.model';

@Component({
    selector: 'app-storico-lezioni',
    templateUrl: './storico-lezioni.page.html',
    styleUrls: ['./storico-lezioni.page.scss'],
})
export class StoricoLezioniPage implements OnInit {
    private bookings$: BehaviorSubject<Booking[]>;
    public user$: BehaviorSubject<any>;
    private storico: Booking[];
    private loading;
    private listUser: User[];

    constructor(public popoverController: PopoverController,
                private bookingService: BookingService,
                private userService: UserService,
                private loadingController: LoadingController) {
    }

    ngOnInit() {
        this.loadingPresent();
        this.storico = [];
        this.user$ = this.userService.getUser();
        this.bookings$ = this.bookingService.getBookings();
        this.user$.subscribe((io: User) => {
            this.bookingService.getRestUsersBooking().subscribe((list) => {
                const users = [];
                list.forEach((item) => {
                    if (item.roles !== io.roles) {
                        users.push(item);
                    }
                });
                this.listUser = users;
                console.log(this.listUser);
                this.bookingService.getRestBooking().subscribe();
                console.log('subscribe');
                this.disLoading();
            });
        });
        this.bookings$.subscribe((data) => {
            this.storico = data;
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
            this.loadingPresent();
            // tslint:disable-next-line:max-line-length
            this.bookingService.getRestHistoricalBookingFilter(data.data.selectMateria, data.data.selectSotto, data.data.nomeLezione, data.data.dataLezione, data.data.selectUtente, data.data.statoLezione).subscribe((item) => {
                console.log(item);
                this.disLoading();
            });
        });
        await popover.present();
    }

    async loadingPresent() {
        this.loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true
        });
        return await this.loading.present();
    }

    async disLoading() {
        await this.loading.dismiss();
    }
}
