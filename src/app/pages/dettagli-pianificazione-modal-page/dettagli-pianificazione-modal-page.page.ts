import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {Planning} from '../../model/planning.model';
import {DatePipe} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-dettagli-pianificazione-modal-page',
    templateUrl: './dettagli-pianificazione-modal-page.page.html',
    styleUrls: ['./dettagli-pianificazione-modal-page.page.scss'],
})
export class DettagliPianificazioneModalPage implements OnInit {

    private planningFormModel: FormGroup;
    private planning: Planning;
    private primaDataDisp: string;
    private hoursStart = [];
    private hoursEnd = [];
    private gionoDellaSettimana = '';
    private cambioRepeat = true;

    private alert: string;
    private cancelTutorWeekMessage: string;
    private cancelButton: string;

    constructor(private formBuilder: FormBuilder,
                private modalController: ModalController,
                private navParams: NavParams,
                private alertController: AlertController,
                public datepipe: DatePipe,
                private translateService: TranslateService) {
    }

    /**
     * Prende i dati del planning dal navParams
     * se il plannig esiste allora si tratta di una modifica
     * altrimenti si tratta di una creazione
     * le date selezionabili sono quelle non occupate dai planing precedentemente creati
     */
    ngOnInit() {
        this.initTranslate();
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
        const myDate =  new Date();
        myDate.setHours(myDate.getHours() + 25);
        this.primaDataDisp = myDate.toISOString();
        if (this.planning.repeatPlanning && !this.navParams.data.gruppo) {
            this.planningFormModel.controls.repeatPlanning.disable();
        }
    }

    /**
     * Viene scaturito al cambio della Data
     * modifica le ore di inizio selezionabili in base alla data inserita
     */
    alCambioData() {
        this.planningFormModel.controls.startTime.disable();
        this.planningFormModel.controls.endTime.disable();
        this.planningFormModel.controls.startTime.reset();
        this.planningFormModel.controls.startTime.enable();
        this.planningFormModel.controls.endTime.reset();
        this.gionoDellaSettimana = this.datepipe.transform(this.planningFormModel.value.date, 'EEEE', 'GMT+1', 'it-IT');
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

    /**
     * Viene scaturito al cambio dell'ora di inzio
     * modifica le ore di fine selezionabili in base all'ora di inizio selezionata
     */
    alCambioOraInizio() {
        if (this.planningFormModel.value.startTime !== null) {
            if (this.planningFormModel.controls.endTime.disable) {
                this.planningFormModel.controls.endTime.enable();
            }
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
                    // tslint:disable-next-line:max-line-length
                    this.hoursEnd.splice(0, parseInt(new Date(this.planningFormModel.value.startTime).toLocaleTimeString().slice(0, 2), 0) + 1);
                }
                oreInizioEFine[indiceData].forEach((ora) => {
                    if (ora.startTime !== this.navParams.data.planning.startTime) {
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
                if (this.planningFormModel.value.startTime.length === 8) {
                    this.hoursEnd.splice(0, parseInt(this.planningFormModel.value.startTime.slice(0, 2), 0) + 1);
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.hoursEnd.splice(0, parseInt(new Date(this.planningFormModel.value.startTime).toLocaleTimeString().slice(0, 2), 0) + 1);
                }
            }
        }
    }

    /**
     * In caso di modifica del planning setto le ore selezionabili con quelle
     * non occupate dai planing precedentemente creati nel giorno selezionato
     */
    gestioneOre() {
        this.gionoDellaSettimana = this.datepipe.transform(this.planningFormModel.value.date, 'EEEE', 'GMT+2', 'it-IT');
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

    /**
     * Alert che scaturico alla cancellazione del planning
     */
    async presentaAlert() {
        if (this.planning.repeatPlanning && !this.planningFormModel.value.repeatPlanning && this.cambioRepeat) {
            const alert = await this.alertController.create({
                header: this.alert,
                message: this.cancelTutorWeekMessage,
                buttons: [
                    {
                        text: this.cancelButton,
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {
                            this.cambioRepeat = false;
                            this.planningFormModel.controls.repeatPlanning.setValue(true);
                        }
                    }, {
                        text: 'Ok',
                        handler: () => {
                            alert.dismiss();
                        }
                    }]
            });

            await alert.present();
        }
    }

    async salvaPlanning() {
        this.planning.date = new Date(this.datepipe.transform(this.planningFormModel.value.date, 'yyyy/MM/dd')).getTime();
        if (this.planningFormModel.value.startTime.length === 8) {
            this.planning.startTime = this.planningFormModel.value.startTime;
        } else {
            this.planning.startTime = new Date(this.planningFormModel.value.startTime).toLocaleTimeString();
        }
        if (this.planningFormModel.value.endTime.length === 8) {
            this.planning.endTime = this.planningFormModel.value.endTime;
        } else {
            this.planning.endTime = new Date(this.planningFormModel.value.endTime).toLocaleTimeString();
        }
        if (this.planning.repeatPlanning === true) {
        } else {
            this.planning.repeatPlanning = this.planningFormModel.value.repeatPlanning;
        }
        await this.modalController.dismiss(this.planning);
    }

    async cancel() {
        await this.modalController.dismiss();
    }

    private initTranslate() {
        this.translateService.get('ALERT').subscribe((data) => {
            this.alert = data;
        });
        this.translateService.get('CANCEL_TUTOR_WEEK_MESSAGE').subscribe((data) => {
            this.cancelTutorWeekMessage = data;
        });
        this.translateService.get('CANCEL_BUTTON').subscribe((data) => {
            this.cancelButton = data;
        });
    }
}
