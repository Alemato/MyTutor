import {Component, OnInit} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';

@Component({
    selector: 'app-popover-risultati-ricerca',
    templateUrl: './popover-risultati-ricerca.component.html',
    styleUrls: ['./popover-risultati-ricerca.component.scss'],
})
export class PopoverRisultatiRicercaComponent implements OnInit {

    slot;
    day;

    constructor(public popoverController: PopoverController,
                private navParams: NavParams) {
    }

    ngOnInit() {
        this.slot = this.navParams.get('dati');

        if (this.navParams.get('giorno') === 1) {
            this.day = 'lunedi';
        }
        if (this.navParams.get('giorno') === 2) {
            this.day = 'martedi';
        }
        if (this.navParams.get('giorno') === 3) {
            this.day = 'mercoledi';
        }
        if (this.navParams.get('giorno') === 4) {
            this.day = 'giovedi';
        }
        if (this.navParams.get('giorno') === 5) {
            this.day = 'venerdi';
        }
        if (this.navParams.get('giorno') === 6) {
            this.day = 'sabato';
        }
        if (this.navParams.get('giorno') === 0) {
            this.day = 'domenica';
        }
    }

    close() {
        this.popoverController.dismiss();
    }
}
