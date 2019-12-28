import {Component, OnInit} from '@angular/core';
import {PickerController} from '@ionic/angular';
import {PickerOptions} from '@ionic/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {forEach} from '@angular-devkit/schematics';

@Component({
    selector: 'app-ricerca-lezioni',
    templateUrl: './ricerca-lezioni.page.html',
    styleUrls: ['./ricerca-lezioni.page.scss'],
})
export class RicercaLezioniPage implements OnInit {
    private ricercaFormModel: FormGroup;
    uscitaText = '';
    uscitaValue = null;
    minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

    public Materie = [
        {text: 'Matteria 1', value: 0},
        {text: 'Matteria 2', value: 1},
        {text: 'Matteria 3', value: 2},
        {text: 'Matteria 4', value: 3},
        {text: 'Matteria 5', value: 4}
    ];

    public SottoMaterie = [
        [
            {text: 'Sotto Materia 1.1', value: '1.1'},
            {text: 'Sotto Materia 1.2', value: '1.2'},
            {text: 'Sotto Materia 1.3', value: '1.3'},
            {text: 'Sotto Materia 1.4', value: '1.4'}
        ],
        [
            {text: 'Sotto Materia 2.1', value: '2.1'},
            {text: 'Sotto Materia 2.2', value: '2.2'},
            {text: 'Sotto Materia 2.3', value: '2.3'},
            {text: 'Sotto Materia 2.4', value: '2.4'}
        ],
        [
            {text: 'Sotto Materia 3.1', value: '3.1'},
            {text: 'Sotto Materia 3.2', value: '3.2'},
            {text: 'Sotto Materia 3.3', value: '3.3'},
            {text: 'Sotto Materia 3.4', value: '3.4'}
        ],
        [
            {text: 'Sotto Materia 4.1', value: '4.1'},
            {text: 'Sotto Materia 4.2', value: '4.2'},
            {text: 'Sotto Materia 4.3', value: '4.3'},
            {text: 'Sotto Materia 4.4', value: '4.4'}
        ],
        [
            {text: 'Sotto Materia 5.1', value: '5.1'},
            {text: 'Sotto Materia 5.2', value: '5.2'},
            {text: 'Sotto Materia 5.3', value: '5.3'},
            {text: 'Sotto Materia 5.4', value: '5.4'}
        ]
    ];

    constructor(private pickerCtrl: PickerController,
                public formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.ricercaFormModel = this.formBuilder.group({
            select: ['', Validators.required],
            nomeLezione: [''],
            nomeCitta: [''],
            inizio: [''],
            fine: [''],
            giorni: [['1', '2', '3', '4', '5', '6', '7']]
        });
    }

    changeInizioLezione() {
        this.minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        this.hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
        this.ricercaFormModel.controls.fine.reset();
        console.log('cambio o setto orario lezione');
        const oraInizio = new Date(this.ricercaFormModel.controls.inizio.value);
        console.log(oraInizio);
        let i;
        let e = 0;
        for (i = 0; i < this.hours.length; i++) {
            if (this.hours[i] < oraInizio.getHours()) {
                e++;
            }
        }
        this.hours = this.hours.slice(e + 1, this.hours.length);
        e = 0;
        for (i = 0; i < this.minutes.length; i++) {
            if (this.minutes[i] < oraInizio.getMinutes()) {
                e++;
            }
        }
        this.minutes = this.minutes.slice(e, this.minutes.length);
    }

    changeSelectElents() {
        console.log('cambio');
        this.ricercaFormModel.controls.select.reset();
    }

    predi() {
        console.log(this.ricercaFormModel.value);
    }

    async showPicker() {
        const opts: PickerOptions = {
            buttons: [
                {
                    text: 'cancella',
                    role: 'cancell'
                },
                {
                    text: 'done'
                }
            ],
            columns: [{
                name: 'prova',
                options: this.Materie
            }]
        };
        const picker = await this.pickerCtrl.create(opts);
        picker.present();
        picker.onDidDismiss().then(async data => {
            const col = await picker.getColumn('prova');
            console.log(col);
            this.uscitaText = col.options[col.selectedIndex].text;
            this.uscitaValue = col.options[col.selectedIndex].value;
        });
        this.changeSelectElents();
    }
}
