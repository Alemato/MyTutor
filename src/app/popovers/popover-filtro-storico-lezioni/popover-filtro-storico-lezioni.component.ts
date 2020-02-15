import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NavParams, PopoverController} from '@ionic/angular';
import {User} from '../../model/user.model';
import {SubjectService} from '../../services/subject.service';
import {Subject} from '../../model/subject.model';

@Component({
    selector: 'app-popover-filtro-storico-lezioni',
    templateUrl: './popover-filtro-storico-lezioni.component.html',
    styleUrls: ['./popover-filtro-storico-lezioni.component.scss'],
})
export class PopoverFiltroStoricoLezioniComponent implements OnInit {
    private filtroFormModel: FormGroup;
    materia = null;
    private users: User[] = [];
    private subject: Subject[] = [];

    public materie = [];

    public sottoMaterie = [];

    constructor(public formBuilder: FormBuilder,
                public popoverController: PopoverController,
                public navParams: NavParams,
                private subjectService: SubjectService) {
        this.users = navParams.get('listU');
        console.log(this.users);
    }

    ngOnInit() {
        this.subjectService.getRestList(true).subscribe((data: Subject[]) => {
            this.subject = data;
            console.log(this.subject);
            this.materie = [];
            let n = 0;
            this.subject.forEach((item) => {
                const obj1 = {text: item.macroSubject, value: n};
                n++;
                this.materie.push(obj1);
            });
            this.sottoMaterie = [];
            let appogioSottoMaterie = [];
            this.subject.forEach((item) => {
                this.subject.forEach((item1) => {
                    if (item.macroSubject === item1.macroSubject) {
                        const obj = {
                            text: item1.microSubject,
                            value: item1.microSubject
                        };
                        appogioSottoMaterie.push(obj);
                    }
                });
                this.sottoMaterie.push(appogioSottoMaterie);
                appogioSottoMaterie = [];
            });
        });
        this.filtroFormModel = this.formBuilder.group({
            nomeLezione: [''],
            selectMateria: [''],
            selectSotto: [''],
            selectUtente: [''],
            statoLezione: [''],
            dataLezione: ['']
        });
    }

    setSotto() {
        this.filtroFormModel.controls.selectSotto.reset();
        this.materia = this.filtroFormModel.controls.selectMateria.value;
    }

    getSelectSottoMateria(): string {
        // tslint:disable-next-line:max-line-length
        if (this.filtroFormModel.controls.selectSotto.value !== '' && this.filtroFormModel.controls.selectSotto.value !== null && this.filtroFormModel.controls.selectSotto.value !== ' ') {
            return this.filtroFormModel.controls.selectSotto.value;
        } else {
            return '';
        }
    }

    getSelectMateria(): string {
        // tslint:disable-next-line:max-line-length
        if (this.filtroFormModel.controls.selectMateria.value !== '' && this.filtroFormModel.controls.selectMateria.value !== null && this.filtroFormModel.controls.selectMateria.value !== ' ') {
            return this.materie[this.filtroFormModel.controls.selectMateria.value].text;
        } else {
            return '';
        }
    }

    getDatalezione(): string {
        // tslint:disable-next-line:max-line-length
        if (this.filtroFormModel.controls.dataLezione.value !== '' && this.filtroFormModel.controls.dataLezione.value !== null && this.filtroFormModel.controls.dataLezione.value !== ' ') {
            return this.filtroFormModel.controls.dataLezione.value;
        } else {
            return '';
        }
    }

    subFiltro() {
        console.log(this.filtroFormModel.value);
        const obj = {
            nomeLezione: this.filtroFormModel.controls.nomeLezione.value,
            selectMateria: this.getSelectMateria(),
            selectSotto: this.getSelectSottoMateria(),
            selectUtente: this.filtroFormModel.controls.selectUtente.value,
            statoLezione: this.filtroFormModel.controls.statoLezione.value,
            dataLezione: this.getDatalezione()
        };
        this.popoverController.dismiss(obj, 'esegui query');
    }

    resetFiltro() {
        const obj = {
            nomeLezione: '',
            selectMateria: '',
            selectSotto: '',
            selectUtente: '',
            statoLezione: '',
            dataLezione: ''
        };
        this.popoverController.dismiss(obj, 'esegui query');
    }

}
