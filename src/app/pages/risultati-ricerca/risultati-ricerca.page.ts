import {Component, OnInit} from '@angular/core';
import {LoadingController, PopoverController} from '@ionic/angular';
import {PopoverRisultatiRicercaComponent} from '../../popovers/popover-risultati-ricerca/popover-risultati-ricerca.component';
import {BehaviorSubject} from 'rxjs';
import {Planning} from '../../model/planning.model';
import {PlanningService} from '../../services/planning.service';
import {Lesson} from '../../model/lesson.model';

@Component({
    selector: 'app-risultati-ricerca',
    templateUrl: './risultati-ricerca.page.html',
    styleUrls: ['./risultati-ricerca.page.scss'],
})
export class RisultatiRicercaPage implements OnInit {
    public planning$: BehaviorSubject<Planning[]>;
    public lessons: Lesson[] = [];
    public lessonList: Lesson[] = [];
    private loading;
    private arrayMappe = [];
    public listaChiaveMappa = [];
    public listaValoriMappa = [];
    public listaChiaveMappaFin = [];
    public listaValoriMappaFin = [];
    public vuotaLista = false;

    constructor(public popoverController: PopoverController,
                private planningService: PlanningService,
                public loadingController: LoadingController) {
    }

    ngOnInit() {
        this.planning$ = this.planningService.getPlannings();
        this.loadingPresent().then(() => {
            this.planning$.subscribe((pianificazioni: Planning[]) => {

                pianificazioni.forEach((item) => {
                    this.lessons.push(item.lesson);
                });
                this.lessonList = [];
                for (let i = 0; i < this.lessons.length; i++) {
                    let flag = false;
                    for (let j = i + 1; j < this.lessons.length; j++) {
                        if (this.lessons[i].idLesson === this.lessons[j].idLesson) {
                            flag = false;
                            break;
                        } else {
                            flag = true;
                        }
                    }
                    if (flag) {
                        this.lessonList.push(this.lessons[i]);
                    }
                }
                this.lessonList.push(this.lessons[this.lessons.length - 1]);
                if (this.lessonList[0] !== undefined) {
                    this.vuotaLista = true;
                }
                console.log(this.lessonList[0]);
                console.log(this.lessonList.length);


                if (pianificazioni.length > 0) {
                    let contIF = 0;
                    let contELSE = 0;
                    let contGenerale = 0;
                    const pnanningList1 = [];
                    this.lessonList.forEach((les, index) => {
                        const planningArray = [];
                        this.arrayMappe.push(new Map<number, [[string, string]]>());
                        pianificazioni.forEach((plen) => {
                            if (plen.lesson.idLesson === les.idLesson) {
                                planningArray.push(plen);
                                if (this.arrayMappe[index].get(plen.date) !== undefined) {
                                    contGenerale++;
                                    contIF++;
                                    const arrayValue = this.arrayMappe[index].get(plen.date);
                                    const list = [plen.startTime];
                                    list.push(plen.endTime);
                                    arrayValue.push(list);
                                    this.arrayMappe[index].set(plen.date, arrayValue);
                                } else {
                                    contGenerale++;
                                    contELSE++;
                                    const list = [plen.startTime];
                                    list.push(plen.endTime);
                                    const arrayValue = [list];
                                    this.arrayMappe[index].set(plen.date, arrayValue);

                                }
                            }
                        });
                        pnanningList1.push(planningArray);
                    });
                    console.log('contIF');
                    console.log(contIF);
                    console.log('contELSE');
                    console.log(contELSE);
                    console.log('this.arrayMappe');
                    console.log(this.arrayMappe);
                    console.log('this.lessonList');
                    console.log(this.lessonList);

                    this.arrayMappe.forEach((mappa: Map<number, [[string, string]]>) => {
                        const listaChiaveperLez = [];
                        const listaValoreperLez = [];
                        mappa.forEach((value: [[string, string]], key: number) => {
                            // console.log(key, value);
                            listaChiaveperLez.push(new Date(key).getDay());
                            listaValoreperLez.push(value);
                        });

                        this.listaChiaveMappa.push(listaChiaveperLez);
                        this.listaValoriMappa.push(listaValoreperLez);
                    });

                    this.listaChiaveMappa.forEach((lista1) => {
                        const lista2 = [];
                        for (let i = 0; i < lista1.length; i++) {
                            let flag = false;
                            for (let j = i + 1; j < lista1.length; j++) {
                                if (lista1[i] === lista1[j]) {
                                    flag = false;
                                    break;
                                } else {
                                    flag = true;
                                }
                            }
                            if (flag) {
                                lista2.push(lista1[i]);
                            }
                        }
                        lista2.push(lista1[lista1.length - 1]);
                        this.listaChiaveMappaFin.push(lista2);
                    });
                    console.log('this.listaChiaveMappaFin');
                    console.log(this.listaChiaveMappaFin);
                    console.log(this.listaChiaveMappaFin[0][0]);

                    this.listaValoriMappa.forEach((lista1) => {
                        const lista2 = [];
                        for (let i = 0; i < lista1.length; i++) {
                            let flag = false;
                            for (let j = i + 1; j < lista1.length; j++) {
                                if (lista1[i][0][0] === lista1[j][0][0] && lista1[i][0][1] === lista1[j][0][1]) {
                                    flag = false;
                                    break;
                                } else {
                                    flag = true;
                                }
                            }
                            if (flag) {
                                lista2.push(lista1[i]);
                            }
                        }
                        lista2.push(lista1[lista1.length - 1]);
                        this.listaValoriMappaFin.push(lista2);
                    });
                    console.log('this.listaValoriMappaFin');
                    console.log(this.listaValoriMappaFin);
                    console.log(this.listaValoriMappaFin[0][0]);




                    console.log('this.listaValoriMappa');
                    // this.listaValoriMappa.reverse();
                    console.log(this.listaValoriMappa);
                    console.log('this.listaChiaveMappa');
                    // this.listaChiaveMappa.reverse();
                    console.log(this.listaChiaveMappa);
                }
                this.disLoading();
            });
        });
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

    async presentPopover(ev: any, data: any, day: number) {
        const popover = await this.popoverController.create({
            component: PopoverRisultatiRicercaComponent,
            event: ev,
            translucent: true,
            componentProps: {giorno: day, dati: data}
        });
        return await popover.present();
    }

}
