import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NavParams, PopoverController} from '@ionic/angular';
import {Subject} from '../../model/subject.model';
import {LessonService} from '../../services/lesson.service';
import {Lesson} from '../../model/lesson.model';

@Component({
    selector: 'app-popover-ricerca-lezioni-disponibili',
    templateUrl: './popover-ricerca-lezioni-disponibili.component.html',
    styleUrls: ['./popover-ricerca-lezioni-disponibili.component.scss'],
})
export class PopoverRicercaLezioniDisponibiliComponent implements OnInit {
    private cityLesson = [];
    private materie = [];
    private sottomaterie;
    private prezzi = [];
    private filtroRicerca: FormGroup;
    materia = null;
    hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    constructor(private  formBuilder: FormBuilder,
                private popoverController: PopoverController,
                private navParams: NavParams,
                private lessonService: LessonService) {
    }

    /**
     * inizializzo la form e setto le liste per le select dalla rest che torna
     * la lista delle lezioni disponibili sul server
     */
    ngOnInit() {
        this.filtroRicerca = this.formBuilder.group({
            nomeLezione: [''],
            city: [''],
            selectMateria: [''],
            selectSotto: [''],
            price: [''],
            startHour: [''],
            endHour: [''],
            days: ['']
        });
        this.lessonService.getRestLessonsForStudent().subscribe((lessons) => {
            this.settaCitta(lessons);
            this.settaMaterie(lessons);
            this.settaSottoMaterie(lessons);
            this.settaPrezzo(lessons);
        });
    }

    /**
     * Funzine che setta la lista delle citta (contiene valori unici)
     * @param lessons lista di lezioni disponibili
     */
    settaCitta(lessons: Lesson[]) {
        this.cityLesson = [];
        lessons.forEach((lesson) => {
            if (this.cityLesson.findIndex(c => c.text === lesson.teacher.city) === -1) {
                this.cityLesson.push({text: lesson.teacher.city, value: lesson.teacher.city});
            }
        });
        console.log(this.cityLesson);
    }

    /**
     * Funzine che setta la lista delle Materie (contiene valori unici)
     * @param lessons lista di lezioni disponibili
     */
    settaMaterie(lessons: Lesson[]) {
        this.materie = [];
        // n serve per il value
        let n = 0;
        lessons.forEach((lesson) => {
            if (this.materie.findIndex(s => s.text === lesson.subject.macroSubject) === -1) {
                this.materie.push({text: lesson.subject.macroSubject, value: n});
                n++;
            }
        });
    }

    /**
     * Funzine che setta la lista delle sottoMaterie (contiene valori unici)
     * @param lessons lista di lezioni disponibili
     */
    settaSottoMaterie(lessons: Lesson[]) {

        const subjects: Subject[] = [];
        lessons.forEach((lesson) => {
            if (subjects.findIndex(s => s.idSubject === lesson.subject.idSubject) === -1) {
                subjects.push(lesson.subject);
            }
        });

        this.sottomaterie = [];

        // serve per inerire tutte le sotto materie della singola Materia
        let appoggioSottoMaterie = [];

        subjects.forEach((item) => {
            subjects.forEach((subject) => {
                if (item.macroSubject === subject.macroSubject) {
                    appoggioSottoMaterie.push({text: subject.microSubject, value: subject.microSubject});
                }
            });
            this.sottomaterie.push(appoggioSottoMaterie);
            appoggioSottoMaterie = [];
        });
    }

    /**
     * Funzine che setta la lista dei prezzi (contiene valori unici)
     * @param lessons lista di lezioni disponibili
     */
    settaPrezzo(lessons: Lesson[]) {
        this.prezzi = [];
        lessons.forEach((lesson) => {
            if (this.prezzi.indexOf(lesson.price) === -1) {
                this.prezzi.push(lesson.price);
            }
        });
    }

    setSotto() {
        this.filtroRicerca.controls.selectSotto.reset();
        this.materia = this.filtroRicerca.controls.selectMateria.value;
    }

    settaFinelezione() {
        this.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        this.filtroRicerca.controls.endHour.reset();
        const oraInizio = new Date(this.filtroRicerca.controls.startHour.value);
        let e = 0;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.hours.length; i++) {
            if (this.hours[i] < oraInizio.getHours()) {
                e++;
            }
        }
        this.hours = this.hours.slice(e + 1, this.hours.length);
    }

    getSelectCity(): string {
        // tslint:disable-next-line:max-line-length
        if (this.filtroRicerca.controls.city.value !== '' && this.filtroRicerca.controls.city.value !== null && this.filtroRicerca.controls.city.value !== ' ') {
            return this.filtroRicerca.controls.city.value;
        } else {
            return '';
        }
    }

    getSelectSottoMateria(): string {
        // tslint:disable-next-line:max-line-length
        if (this.filtroRicerca.controls.selectSotto.value !== '' && this.filtroRicerca.controls.selectSotto.value !== null && this.filtroRicerca.controls.selectSotto.value !== ' ') {
            return this.filtroRicerca.controls.selectSotto.value;
        } else {
            return '';
        }
    }

    getSelectMateria(): string {
        // tslint:disable-next-line:max-line-length
        if (this.filtroRicerca.controls.selectMateria.value !== '' && this.filtroRicerca.controls.selectMateria.value !== null && this.filtroRicerca.controls.selectMateria.value !== ' ') {
            return this.materie[this.filtroRicerca.controls.selectMateria.value].text;
        } else {
            return '';
        }
    }

    getSelectPrice(): string {
        // tslint:disable-next-line:max-line-length
        if (this.filtroRicerca.controls.price.value !== '' && this.filtroRicerca.controls.price.value !== null && this.filtroRicerca.controls.price.value !== ' ') {
            return this.filtroRicerca.controls.price.value;
        } else {
            return '';
        }
    }

    getStartTime(): string {
        // tslint:disable-next-line:max-line-length
        if (this.filtroRicerca.controls.startHour.value !== '' && this.filtroRicerca.controls.startHour.value !== null && this.filtroRicerca.controls.startHour.value !== ' ') {
            return new Date(this.filtroRicerca.controls.startHour.value).getHours().toString() + ':00:00';
        } else {
            return '';
        }
    }

    getEndTime(): string {
        // tslint:disable-next-line:max-line-length
        if (this.filtroRicerca.controls.endHour.value !== '' && this.filtroRicerca.controls.endHour.value !== null && this.filtroRicerca.controls.endHour.value !== ' ') {
            return new Date(this.filtroRicerca.controls.endHour.value).getHours().toString() + ':00:00';
        } else {
            return '';
        }
    }

    /**
     * Funzione che esegue la submit della form
     */
    subFiltro() {
        console.log(this.filtroRicerca.value);
        const obj = {
            nomeLezione: this.filtroRicerca.controls.nomeLezione.value,
            city: this.getSelectCity(),
            selectMateria: this.getSelectMateria(),
            selectSotto: this.getSelectSottoMateria(),
            price: this.getSelectPrice(),
            startHour: this.getStartTime(),
            endHour: this.getEndTime(),
            days: this.filtroRicerca.controls.days.value
        };
        this.popoverController.dismiss(obj, 'esegui query');
    }

    /**
     * Funzione che esegue un submit con valori a default per il reset del filtro
     */
    resetFiltro() {
        const obj = {
            nomeLezione: '',
            city: '',
            selectMateria: '',
            selectSotto: '',
            price: '',
            startHour: '',
            endHour: '',
            days: ''
        };
        this.popoverController.dismiss(obj, 'esegui query');
    }

}
