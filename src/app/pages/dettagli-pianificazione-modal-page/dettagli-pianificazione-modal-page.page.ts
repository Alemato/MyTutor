import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController, NavParams} from '@ionic/angular';
import {Planning} from '../../model/planning.model';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-dettagli-pianificazione-modal-page',
    templateUrl: './dettagli-pianificazione-modal-page.page.html',
    styleUrls: ['./dettagli-pianificazione-modal-page.page.scss'],
})
export class DettagliPianificazioneModalPage implements OnInit {

    private planningFormModel: FormGroup;
    private planning: Planning;
    private oggi: string;
    private hoursStart = [];
    private hoursEnd = [];
    private gionoDellaSettimana = '';

    constructor(private formBuilder: FormBuilder,
                private modalController: ModalController,
                private navParams: NavParams,
                public datepipe: DatePipe) {
    }

    ngOnInit() {
        this.planning = this.navParams.data.planning;
        if (this.planning.idPlanning) {
            this.planningFormModel = this.formBuilder.group({
                date: [new Date(this.planning.date).toDateString(), Validators.required],
                startTime: [this.planning.startTime, Validators.required],
                endTime: [this.planning.endTime, Validators.required],
                repeatPlanning: [this.planning.repeatPlanning]
            });
            this.gestioneOre();
        } else {
            this.planning.repeatPlanning = false;
            this.planningFormModel = this.formBuilder.group({
                date: ['', Validators.required],
                startTime: ['', Validators.required],
                endTime: ['', Validators.required],
                repeatPlanning: [this.planning.repeatPlanning]
            });
            this.planningFormModel.controls.startTime.disable();
            this.planningFormModel.controls.endTime.disable();
        }
        this.oggi = new Date().toISOString();
        if (this.planning.repeatPlanning === true) {
            this.planningFormModel.controls.repeatPlanning.disable();
        }
    }

    alCambioData() {
        this.planningFormModel.controls.startTime.enable();
        this.gionoDellaSettimana = this.datepipe.transform(this.planningFormModel.value.date, 'EEEE', 'GMT+1', 'it-IT');
        this.planningFormModel.controls.startTime.reset();
        this.planningFormModel.controls.endTime.reset();
        this.hoursStart = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
        const date: number[] = this.navParams.data.date;
        const oreInizioEFine: any[] = this.navParams.data.ore;
        const indiceData = date.findIndex(
            d => d === new Date(this.datepipe.transform(this.planningFormModel.value.date, 'yyyy/MM/dd')).getTime());
        if (indiceData !== -1) {
            oreInizioEFine[indiceData].forEach((ora) => {
                // tslint:disable-next-line:max-line-length
                const indiceOra = this.hoursStart.findIndex(o => o === parseInt(ora.startTime.slice(0, 2), 0));
                if (indiceOra !== -1) {
                    this.hoursStart.splice(indiceOra, 1);
                }
            });
        }
    }

    alCambioOraInizio() {
        this.planningFormModel.controls.endTime.enable();
        this.planningFormModel.controls.endTime.reset();
        this.hoursEnd = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        const date: number[] = this.navParams.data.date;
        const oreInizioEFine: any[] = this.navParams.data.ore;
        const indiceData = date.findIndex(
            d => d === new Date(this.datepipe.transform(this.planningFormModel.value.date, 'yyyy/MM/dd')).getTime());
        if (indiceData !== -1) {
            if (this.planningFormModel.value.startTime.length === 8) {
                this.hoursEnd.splice(0, parseInt(this.planningFormModel.value.startTime.slice(0, 2), 0) + 1);
            } else {
                this.hoursEnd.splice(0, parseInt(new Date(this.planningFormModel.value.startTime).toLocaleTimeString().slice(0, 2), 0) + 1);
            }
            oreInizioEFine[indiceData].forEach((ora) => {
                const indiceOra = this.hoursEnd.findIndex(o => o === parseInt(ora.endTime.slice(0, 2), 0));
                if (indiceOra !== -1) {
                    if (indiceOra === 0) {
                        this.hoursEnd.splice(1, 24);
                    } else {
                        this.hoursEnd.splice(indiceOra, 24);
                    }
                }
            });
        } else {
            if (this.planningFormModel.value.startTime.length === 8) {
                this.hoursEnd.splice(0, parseInt(this.planningFormModel.value.startTime.slice(0, 2), 0) + 1);
            } else {
                this.hoursEnd.splice(0, parseInt(new Date(this.planningFormModel.value.startTime).toLocaleTimeString().slice(0, 2), 0) + 1);
            }
        }
    }

    gestioneOre() {
        this.gionoDellaSettimana = this.datepipe.transform(this.planningFormModel.value.date, 'EEEE', 'GMT+1', 'it-IT');
        this.hoursStart = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
        const date: number[] = this.navParams.data.date;
        const oreInizioEFine: any[] = this.navParams.data.ore;
        const indiceData = date.findIndex(
            d => d === new Date(this.datepipe.transform(this.planningFormModel.value.date, 'yyyy/MM/dd')).getTime());
        if (indiceData !== -1) {
            oreInizioEFine[indiceData].forEach((ora) => {
                // tslint:disable-next-line:max-line-length
                if (new Date(this.datepipe.transform(this.planningFormModel.value.date, 'yyyy/MM/dd')).getTime() === new Date(this.planning.date).getTime()) {
                    if (ora.startTime !== this.planning.startTime) {
                        const indiceOra = this.hoursStart.findIndex(o => o === parseInt(ora.startTime.slice(0, 2), 0));
                        if (indiceOra !== -1) {
                            this.hoursStart.splice(indiceOra, 1);
                        }
                    }
                } else {
                    const indiceOra = this.hoursStart.findIndex(o => o === parseInt(ora.startTime.slice(0, 2), 0));
                    if (indiceOra !== -1) {
                        this.hoursStart.splice(indiceOra, 1);
                    }
                }
            });
        }

        this.hoursEnd = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        if (indiceData !== -1) {
            this.hoursEnd.splice(0, parseInt(this.planningFormModel.value.startTime.slice(0, 2), 0) + 1);
            oreInizioEFine[indiceData].forEach((ora) => {
                // tslint:disable-next-line:max-line-length
                if (new Date(this.datepipe.transform(this.planningFormModel.value.date, 'yyyy/MM/dd')).getTime() === new Date(this.planning.date).getTime()) {
                    if (ora.endTime !== this.planning.endTime) {
                        const indiceOra = this.hoursEnd.findIndex(o => o === parseInt(ora.endTime.slice(0, 2), 0));
                        if (indiceOra !== -1) {
                            if (indiceOra === 0) {
                                this.hoursEnd.splice(1, 24);
                            } else {
                                this.hoursEnd.splice(indiceOra, 24);
                            }
                        }
                    }
                } else {
                    const indiceOra = this.hoursEnd.findIndex(o => o === parseInt(ora.endTime.slice(0, 2), 0));
                    if (indiceOra !== -1) {
                        if (indiceOra === 0) {
                            this.hoursEnd.splice(1, 24);
                        } else {
                            this.hoursEnd.splice(indiceOra, 24);
                        }
                    }
                }
            });
        } else {
            this.hoursEnd.splice(0, parseInt(new Date(this.planningFormModel.value.startTime).toLocaleTimeString().slice(0, 2), 0) + 1);
        }
    }

    async salvaPlanning() {
        this.planning.date = new Date(new Date(this.datepipe.transform(this.planningFormModel.value.date, 'yyyy/MM/dd')).getTime());
        this.planning.startTime = new Date(this.planningFormModel.value.startTime).toLocaleTimeString();
        this.planning.endTime = new Date(this.planningFormModel.value.endTime).toLocaleTimeString();
        this.planning.repeatPlanning = this.planningFormModel.value.repeatPlanning;
        await this.modalController.dismiss(this.planning);
    }

    async cancel() {
        await this.modalController.dismiss();
    }
}
