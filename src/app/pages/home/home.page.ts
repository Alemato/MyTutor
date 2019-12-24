import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';
import {AlertController} from '@ionic/angular';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    public imgBase64 = ' ';
    private countDowns: Subscription;

    public  lezioni2 = [];

    public richiestePrenotazioni = [
        {
            nomeLezione: 'Richiesta Lezione 1',
            nomeStudent: 'Antonio Rossi',
            date: new Date(2019, 10, 27, 9, 0, 0, 0).getTime(),
        },
        {
            nomeLezione: 'Richiesta Lezione 2',
            nomeStudent: 'Antonio Rossi',
            date: new Date(2019, 11, 1, 10, 30, 0, 0).getTime(),
        },
        {
            nomeLezione: 'Richiesta Lezione 3',
            nomeStudent: 'Antonio Rossi',
            date: new Date(2019, 11, 12, 15, 30, 0, 0).getTime(),
        }
    ];

    public lezioni = [
        {
            nomeLezione: 'Nome Lezione 1',
            nomeProf: 'Mario Rossi',
            nomeStudent: 'Antonio Rossi',
            date: new Date(2019, 11, 27, 3, 16, 0, 0).getTime(),
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        {
            nomeLezione: 'Nome Lezione 2',
            nomeProf: 'Mario Rossi',
            nomeStudent: 'Antonio Rossi',
            date: new Date(2020, 11, 31, 4, 15, 0, 0).getTime(),
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        {
            nomeLezione: 'Nome Lezione 3',
            nomeProf: 'Mario Rossi',
            nomeStudent: 'Antonio Rossi',
            date: new Date(2020, 1, 1, 5, 14, 0, 0).getTime(),
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        {
            nomeLezione: 'Nome Lezione 4',
            nomeProf: 'Mario Rossi',
            nomeStudent: 'Antonio Rossi',
            date: new Date(2020, 1, 2, 6, 13, 0, 0).getTime(),
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        {
            nomeLezione: 'Nome Lezione 5',
            nomeProf: 'Mario Rossi',
            nomeStudent: 'Antonio Rossi',
            date: new Date(2020, 1, 3, 7, 12, 0, 0).getTime(),
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        {
            nomeLezione: 'Nome Lezione 6',
            nomeProf: 'Mario Rossi',
            nomeStudent: 'Antonio Rossi',
            date: new Date(2020, 1, 4, 8, 11, 0, 0).getTime(),
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        {
            nomeLezione: 'Nome Lezione 7',
            nomeProf: 'Mario Rossi',
            nomeStudent: 'Antonio Rossi',
            date: new Date(2020, 1, 5, 9, 10, 0, 0).getTime(),
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        }
    ];

    constructor(public alertController: AlertController) {
    }

    countDown() {
        this.lezioni.forEach((item) => {
            const nowDate = new Date().getTime();
            const distance = item.date - nowDate;
            item.days = Math.floor(distance / (1000 * 60 * 60 * 24));
            item.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            item.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            item.seconds = Math.floor((distance % (1000 * 60)) / 1000);
        });
    }

    ionViewWillEnter() {
        // this.countDown();
        console.log(new Date(this.lezioni[0].date));
        this.countDowns = interval(800).subscribe(x => {
            this.countDown();
        });
    }

    async presentAlert(item) {
        const alert = await this.alertController.create({
            header: 'Annullare la Lezzione',
            subHeader: 'Conferma',
            message: 'Sei sicuro di voler annullare la lezione?',
            buttons: [
                {
                    text: 'Annulla',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Annulla operazione');
                        item.close();
                    }
                }, {
                    text: 'OK',
                    handler: () => {
                        console.log('Conferma annullamento lezione');
                        item.close();
                    }
                }]
        });

        await alert.present();
    }

    addPrenotazioneLezione() {
        console.log('Vai a alla pagina per prenotare la lezione');
    }

    ionViewDidLeave() {
        this.countDowns.unsubscribe();
    }

    ngOnInit() {
        this.countDown();
    }

}
