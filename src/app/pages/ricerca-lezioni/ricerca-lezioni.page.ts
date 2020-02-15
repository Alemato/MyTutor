import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
// tslint:disable-next-line:max-line-length
import {PopoverRicercaLezioniDisponibiliComponent} from '../../popovers/popover-ricerca-lezioni-disponibili/popover-ricerca-lezioni-disponibili.component';
import {BehaviorSubject} from 'rxjs';
import {Planning} from '../../model/planning.model';
import {PlanningService} from '../../services/planning.service';
import {Lesson} from '../../model/lesson.model';

@Component({
    selector: 'app-ricerca-lezioni',
    templateUrl: './ricerca-lezioni.page.html',
    styleUrls: ['./ricerca-lezioni.page.scss'],
})
export class RicercaLezioniPage implements OnInit {
    itemBrutti = [{giorno: 'Lunedi', orari: [['9:00', '12:00'], ['13:00', '17:00']]}, {
        giorno: 'Martedi',
        orari: [['9:00', '12:00'], ['13:00', '17:00']]
    }, {giorno: 'Mercoledi', orari: [['9:00', '12:00'], ['13:00', '17:00']]}, {
        giorno: 'Giovedi',
        orari: [['9:00', '12:00'], ['13:00', '17:00']]
    }, {giorno: 'Venerdi', orari: [['9:00', '12:00'], ['13:00', '17:00']]}, {
        giorno: 'Sabato',
        orari: [['9:00', '12:00'], ['13:00', '17:00']]
    }, {giorno: 'Domenica', orari: [['9:00', '12:00'], ['13:00', '17:00']]}];
    itemBrutti2 = [];
    // tslint:disable-next-line:max-line-length
    weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    expanded = [];

    private planning$: BehaviorSubject<Planning[]>;
    private listOrari;
    private listLessons: Lesson[] = [];

    constructor(public popoverController: PopoverController,
                private planningService: PlanningService) {
    }

    ngOnInit() {
        this.planning$ = this.planningService.getPlannings();
        this.planning$.subscribe((plannings) => {
            this.listLessons = [];
            this.expanded = [];
            this.listOrari = [];
            let appoggioOrari = [];
            let flag = false;
            plannings.forEach((planning) => {
                if (this.listLessons.findIndex(l => l.idLesson === planning.lesson.idLesson) === -1) {
                    this.listLessons.push(planning.lesson);
                    this.expanded.push(false);
                    if (flag) {
                        this.listOrari.push(appoggioOrari);
                        appoggioOrari = [];
                        flag = false;
                    }
                    // tslint:disable-next-line:max-line-length
                    appoggioOrari.push({
                        giorno: this.weekdays[new Date(planning.date).getDay()],
                        orari: [[planning.startTime.slice(0, 5), planning.endTime.slice(0, 5)]]
                    });
                } else {
                    if (appoggioOrari.findIndex(ap => ap.giorno === this.weekdays[new Date(planning.date).getDay()]) === -1) {
                        // tslint:disable-next-line:max-line-length
                        appoggioOrari.push({
                            giorno: this.weekdays[new Date(planning.date).getDay()],
                            orari: [[planning.startTime.slice(0, 5), planning.endTime.slice(0, 5)]]
                        });
                        flag = true;
                    } else {
                        // tslint:disable-next-line:max-line-length
                        if (appoggioOrari[appoggioOrari.findIndex(ap => ap.giorno === this.weekdays[new Date(planning.date).getDay()])].orari[appoggioOrari[appoggioOrari.findIndex(ap => ap.giorno === this.weekdays[new Date(planning.date).getDay()])].orari.length - 1][1] === planning.startTime.slice(0, 5)) {
                            // tslint:disable-next-line:max-line-length
                            appoggioOrari[appoggioOrari.findIndex(ap => ap.giorno === this.weekdays[new Date(planning.date).getDay()])].orari[appoggioOrari[appoggioOrari.findIndex(ap => ap.giorno === this.weekdays[new Date(planning.date).getDay()])].orari.length - 1][1] = planning.endTime.slice(0, 5);
                        } else {
                            // tslint:disable-next-line:max-line-length
                            if (appoggioOrari[appoggioOrari.findIndex(ap => ap.giorno === this.weekdays[new Date(planning.date).getDay()])].orari[appoggioOrari[appoggioOrari.findIndex(ap => ap.giorno === this.weekdays[new Date(planning.date).getDay()])].orari.length - 1][1] < planning.startTime.slice(0, 5)) {
                                // tslint:disable-next-line:max-line-length
                                appoggioOrari[appoggioOrari.findIndex(ap => ap.giorno === this.weekdays[new Date(planning.date).getDay()])].orari.push([planning.startTime.slice(0, 5), planning.endTime.slice(0, 5)]);
                            }
                        }
                        flag = true;
                    }
                }
            });
            if (flag) {
                this.listOrari.push(appoggioOrari);
                appoggioOrari = [];
                flag = false;
            }
            console.log(this.listLessons);
            console.log(this.listOrari);
        });
    }

    ionViewWillEnter() {
        this.planningService.getRestPlannings('', '', '', '', '', '', '', '', '', '', '', '', '', '').subscribe((plannings) => {
            console.log(plannings);
        });
    }

    expandItem(i: number) {
        this.expanded[i] = !this.expanded[i];
    }

    async presentPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: PopoverRicercaLezioniDisponibiliComponent,
            event: ev,
            translucent: true,
        });
        popover.onDidDismiss().then((data) => {
            console.log(data);
            if (data.data === undefined) {
                this.planningService.getRestPlannings('', '', '', '', '', '', '', '', '', '', '', '', '', '').subscribe((plannings) => {
                    console.log(plannings);
                });
            } else {
                let lun = 0;
                let mar = 0;
                let mer = 0;
                let gio = 0;
                let ver = 0;
                let sab = 0;
                let dom = 0;
                console.log(data.data.days.length);
                if (data.data.days.length > 0) {
                    data.data.days.forEach((day) => {
                        switch (day) {
                            case 'lunedi': {
                                lun = 1;
                                break;
                            }
                            case 'martedi': {
                                mar = 1;
                                break;
                            }
                            case 'mercoledi': {
                                mer = 1;
                                break;
                            }
                            case 'giovedi': {
                                gio = 1;
                                break;
                            }
                            case 'venerdi': {
                                ver = 1;
                                break;
                            }
                            case 'sabato': {
                                sab = 1;
                                break;
                            }
                            case 'domenica': {
                                dom = 1;
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    });
                } else {
                    lun = 1;
                    mar = 1;
                    mer = 1;
                    gio = 1;
                    ver = 1;
                    sab = 1;
                    dom = 1;
                }
                // tslint:disable-next-line:max-line-length
                this.planningService.getRestPlannings(data.data.selectMateria, data.data.nomeLezione, data.data.city, data.data.selectSotto, dom.toString(), lun.toString(), mar.toString(), mer.toString(), gio.toString(), ver.toString(), sab.toString(), data.data.startHour, data.data.endHour, data.data.price).subscribe((plannings) => {
                    console.log(plannings);
                });
            }
        });
        await popover.present();
    }
}
