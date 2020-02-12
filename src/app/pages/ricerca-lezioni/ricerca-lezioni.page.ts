import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';
// tslint:disable-next-line:max-line-length
import {PopoverRicercaLezioniDisponibiliComponent} from '../../popovers/popover-ricerca-lezioni-disponibili/popover-ricerca-lezioni-disponibili.component';

@Component({
  selector: 'app-ricerca-lezioni',
  templateUrl: './ricerca-lezioni.page.html',
  styleUrls: ['./ricerca-lezioni.page.scss'],
})
export class RicercaLezioniPage implements OnInit {

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverRicercaLezioniDisponibiliComponent,
      event: ev,
      translucent: true,
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
}
