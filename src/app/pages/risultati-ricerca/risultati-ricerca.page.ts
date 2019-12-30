import {Component, OnInit} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import {PopoverRisultatiRicercaComponent} from '../../popovers/popover-risultati-ricerca/popover-risultati-ricerca.component';

@Component({
    selector: 'app-risultati-ricerca',
    templateUrl: './risultati-ricerca.page.html',
    styleUrls: ['./risultati-ricerca.page.scss'],
})
export class RisultatiRicercaPage implements OnInit {
    public slot = [
        {
            lunedi: [{inizio: '11:00', fine: '12:00'}, {inizio: '12:00', fine: '13:00'}],
            martedi: [{inizio: '11:00', fine: '12:00'}, {inizio: '12:00', fine: '13:00'}],
            mercoledi: [{inizio: '11:00', fine: '12:00'}, {inizio: '12:00', fine: '13:00'}]
        },
        {
            lunedi: [{inizio: '11:00', fine: '12:00'}, {inizio: '12:00', fine: '13:00'}],
            martedi: [{inizio: '11:00', fine: '12:00'}, {inizio: '12:00', fine: '13:00'}],
            mercoledi: [{inizio: '11:00', fine: '12:00'}, {inizio: '12:00', fine: '13:00'}],
            giovedi: [{inizio: '11:00', fine: '12:00'}, {inizio: '12:00', fine: '13:00'}],
            venerdi: [{inizio: '11:00', fine: '12:00'}, {inizio: '12:00', fine: '13:00'}],
            sabato: [{inizio: '11:00', fine: '12:00'}, {inizio: '12:00', fine: '13:00'}],
            domenica: [{inizio: '11:00', fine: '12:00'}, {inizio: '12:00', fine: '13:00'}]
        }
        ];

    constructor(public popoverController: PopoverController) {
    }

    ngOnInit() {
    }

    stampaNumero(slot) {
        console.log(slot);
    }

    async presentPopover(ev: any, data: any, day: string) {
        const popover = await this.popoverController.create({
            component: PopoverRisultatiRicercaComponent,
            event: ev,
            translucent: true,
            componentProps: { giorno: day,  dati : data}
        });
        return await popover.present();
    }

}
