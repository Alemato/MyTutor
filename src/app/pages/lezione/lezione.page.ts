import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserService} from '../../services/user.service';
import {Planning} from '../../model/planning.model';
import {LessonService} from '../../services/lesson.service';
import {Lesson} from '../../model/lesson.model';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Booking} from '../../model/booking.model';
import {DatePipe} from '@angular/common';
import {BookingService} from '../../services/booking.service';
import {PlanningService} from '../../services/planning.service';
import {User} from '../../model/user.model';
import {ChatService} from '../../services/chat.service';
import {CreateService} from '../../services/create.service';
import {MessageService} from '../../services/message.service';
import {Message} from '../../model/message.model';
import {Chat} from '../../model/chat.model';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Student} from '../../model/student.model';
import {TranslateService} from '@ngx-translate/core';


@Component({
    selector: 'app-lezione',
    templateUrl: './lezione.page.html',
    styleUrls: ['./lezione.page.scss'],
})
export class LezionePage implements OnInit {
    private id: string;
    private provenienza: string;
    private nameLesson = '';
    private user$: BehaviorSubject<User>;
    private bookings$: BehaviorSubject<Booking[]>;
    private booking$: Observable<Booking>;
    private lesson$: Observable<Lesson>;
    private age = 0;
    private isBooking = false;
    private idChat = 0;
    private existsChat = false;
    private loading;

    private student$: BehaviorSubject<Student>;
    private isLesson = false;
    private plannings$: BehaviorSubject<Planning[]>;
    private plans: Planning[];
    private listaAnni: number[] = [];
    private listaMesi = [];
    private listaGiorni = [];
    private mappaStartEnd: Map<string, [string[]]> = new Map<string, [string[]]>();
    private annoClick = false;
    private meseClick = false;
    private giornoClick = false;
    private oraInizioClick = false;
    private oraFineClick = false;
    private hoursInizio = [];
    private hoursFine = [];
    public prenotazioneFormModel: FormGroup;
    private pleaseWaitMessage: string;
    private lessonBookedHeader: string;
    private lessonBookedSubHeader: string;
    private lessonBookedMessage: string;
    private book: string;
    private doneButton: string;
    private minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    private mappaGiornoMesiAnni: Map<number, Map<number, number[]>> = new Map<number, Map<number, number[]>>();
    private mappaMesiAnni: Map<number, number[]> = new Map<number, number[]>();

    constructor(
        public alertController: AlertController,
        public formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private navController: NavController,
        private userService: UserService,
        private lessonService: LessonService,
        private bookingService: BookingService,
        private planningService: PlanningService,
        private datePipe: DatePipe,
        private activatedRoute: ActivatedRoute,
        private chatService: ChatService,
        private createService: CreateService,
        private messageService: MessageService,
        private loadingController: LoadingController,
        private translateService: TranslateService
    ) {
        this.user$ = this.userService.getUser();
        const tipoU = this.userService.getTypeUser();
        console.log(tipoU);
        if (tipoU === 'student') {
            this.student$ = this.userService.getUser();
        }
    }


    ngOnInit() {
        this.initTranslate();
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.provenienza = params.get('prov');
            this.id = params.get('id');
            if (params.get('prov') === 'booking') {
                this.isBooking = true;
                this.isLesson = false;
                this.loadingPresent().then(() => {
                    this.bookings$ = this.bookingService.getBookings();
                    this.bookings$.subscribe((bookings) => {
                        this.booking$ = new Observable<Booking>(subscriber => {
                            subscriber.next(bookings.find(x => x.planning.idPlanning === +this.id));
                        });
                        this.lesson$ = new Observable<Lesson>(subscriber => {
                            subscriber.next(bookings.find(x => x.planning.idPlanning === +this.id).planning.lesson);
                        });
                    });
                    this.lesson$.subscribe((lesson) => {
                        this.nameLesson = lesson.name;
                        this.calcolaDataTeacher(lesson);
                    });
                    this.booking$.subscribe((booking) => {
                        console.log(booking);
                        if (this.user$.value.roles === 2) {
                            this.chatService.getRestCountChatUser2(booking.student.idUser).subscribe((data) => {
                                console.log(data);
                                if (data === 1) {
                                    console.log('esiste chat');
                                    this.existsChat = true;
                                    this.createService.getListCreates(booking.planning.lesson.teacher.idUser).subscribe((creates) => {
                                        console.log(creates);
                                        this.idChat = creates.find(x => x.userListser[0].idUser === booking.student.idUser).chat.idChat;
                                        this.disLoading();
                                    });
                                } else if (data < 1) {
                                    this.disLoading();
                                    this.existsChat = false;
                                }
                            });
                        } else if (this.user$.value.roles === 1) {
                            this.chatService.getRestCountChatUser2(booking.planning.lesson.teacher.idUser).subscribe((data) => {
                                console.log(data);
                                if (data === 1) {
                                    console.log('esiste chat');
                                    this.existsChat = true;
                                    this.createService.getListCreates(booking.student.idUser).subscribe((creates) => {
                                        console.log(creates);
                                        // tslint:disable-next-line:max-line-length
                                        this.idChat = creates.find(x => x.userListser[1].idUser === booking.planning.lesson.teacher.idUser).chat.idChat;
                                        this.disLoading();
                                    });
                                } else {
                                    this.disLoading();
                                    this.existsChat = false;
                                }
                            });
                        }
                    });
                });
            } else if (params.get('prov') === 'lesson') {
                console.log('da lesson');
                // Aggiungere logica del form model PRIMA DI SETTARE I BOOLEANI
                this.prenotazioneFormModel = this.formBuilder.group({
                    giornoDataLezione: ['', Validators.required],
                    meseDataLezione: ['', Validators.required],
                    annoDataLezione: ['', Validators.required],
                    oraInizio: ['', Validators.required],
                    oraFine: ['', Validators.required],
                });
                this.loadingPresent().then(() => {
                    this.prenotazioneFormModel.controls.meseDataLezione.disable();
                    this.prenotazioneFormModel.controls.annoDataLezione.disable();
                    this.prenotazioneFormModel.controls.oraInizio.disable();
                    this.prenotazioneFormModel.controls.oraFine.disable();
                    this.isBooking = false;
                    this.isLesson = true;
                    this.plannings$ = this.planningService.getPlannings();
                    this.planningService.getRestPlanningByIdLesson(this.id).subscribe((plannings) => {
                        console.log(plannings);
                        this.plannings$.next(plannings);
                        this.lesson$ = new Observable<Lesson>(subscriber => {
                            if (plannings[0] !== undefined) {
                                subscriber.next(plannings[0].lesson);
                            } else {
                                this.lessonService.getRestLessons().subscribe((l) => {
                                    subscriber.next(l.find(x => x.idLesson === parseInt(this.id, 0)));
                                    console.log('l.find(x => x.idLesson === parseInt(this.id, 0))');
                                    console.log(l.find(x => x.idLesson === parseInt(this.id, 0)));

                                });
                            }
                        });
                        this.lesson$.subscribe((lesson) => {
                            this.nameLesson = lesson.name;
                            this.calcolaDataTeacher(lesson);
                            if (this.user$.value.roles === 1) {
                                this.chatService.getRestCountChatUser2(lesson.teacher.idUser).subscribe((data) => {
                                    console.log(data);
                                    if (data === 1) {
                                        console.log('esiste chat');
                                        this.existsChat = true;
                                        this.createService.getListCreates(this.user$.value.idUser).subscribe((creates) => {
                                            console.log(creates);
                                            // tslint:disable-next-line:max-line-length
                                            this.idChat = creates.find(x => x.userListser[1].idUser === lesson.teacher.idUser).chat.idChat;
                                        });
                                    } else {
                                        this.existsChat = false;
                                    }
                                });
                                console.log('eseguire codice student');
                                this.plans = plannings;
                                const listaDateAppo: string[] = [];
                                plannings.forEach((pianificazione) => {
                                    const datAppo = new Date(pianificazione.date).getTime() + (1000 * 60 * 60);
                                    const dataAppo1 = new Date(datAppo).toLocaleDateString();
                                    listaDateAppo.push(dataAppo1);
                                });
                                const uniqueDateSet = new Set(listaDateAppo);
                                const listaDate = Array.from(uniqueDateSet);
                                listaDate.forEach((date) => {
                                    let inizioFine: [string[]] = [[]];
                                    plannings.forEach((pianificazione) => {
                                        const datAppo = new Date(pianificazione.date).getTime() + (1000 * 60 * 60);
                                        const dataAppo1 = new Date(datAppo).toLocaleDateString();
                                        if (dataAppo1 === date) {
                                            const startAndEnd = [];
                                            startAndEnd[0] = pianificazione.startTime;
                                            startAndEnd[1] = pianificazione.endTime;
                                            inizioFine.push(startAndEnd);
                                        }
                                    });
                                    inizioFine.splice(0, 1);
                                    this.mappaStartEnd.set(date, inizioFine);
                                    inizioFine = [[]];
                                });
                                const listaGiorni1: number[] = [];
                                plannings.forEach((pianificazione) => {
                                    const datAppo1 = new Date(pianificazione.date).getTime() + (1000 * 60 * 60);
                                    const dataAppo11 = new Date(datAppo1).toLocaleString();
                                    const dataAppoArray1 = dataAppo11.split('/');

                                    listaGiorni1.push(parseInt(dataAppoArray1[0], 0));
                                });
                                const uniqueSetGiorni = new Set(listaGiorni1);
                                const listaGiorniPer1 = Array.from(uniqueSetGiorni);
                                const listaGiorniPer1Sorted = listaGiorniPer1.sort((n1, n2) => n1 - n2);
                                console.log('listaGiorniPer1Sorted');
                                console.log(listaGiorniPer1Sorted);

                                listaGiorniPer1Sorted.forEach((giorno) => {
                                    const listaMesiPerGiornoAppo: number[] = [];
                                    plannings.forEach((pianificazione) => {
                                        const datAppo = new Date(pianificazione.date).getTime() + (1000 * 60 * 60);
                                        const dataAppo1 = new Date(datAppo).toLocaleString();
                                        const dataAppoArray = dataAppo1.split('/');
                                        if (parseInt(dataAppoArray[0], 0) === giorno) {
                                            listaMesiPerGiornoAppo.push(parseInt(dataAppoArray[1], 0));
                                        }
                                    });
                                    const uniqueSetMesi = new Set(listaMesiPerGiornoAppo);
                                    const listaMesiPerGiorno = Array.from(uniqueSetMesi);
                                    const listaMesiPerGiornoSorted = listaMesiPerGiorno.sort((n1, n2) => n1 - n2);
                                    console.log('listaMesiPerGiornoSorted');
                                    console.log(listaMesiPerGiornoSorted);
                                    listaMesiPerGiornoSorted.forEach((mese) => {
                                        const listaAnniPerMeseAppo: number[] = [];
                                        plannings.forEach((pianificazione) => {
                                            const datAppo = new Date(pianificazione.date).getTime() + (1000 * 60 * 60);
                                            const dataAppo1 = new Date(datAppo).toLocaleString();
                                            const dataAppoArray = dataAppo1.split('/');
                                            // tslint:disable-next-line:max-line-length
                                            if (parseInt(dataAppoArray[0], 0) === giorno && parseInt(dataAppoArray[1], 0) === mese) {
                                                listaAnniPerMeseAppo.push(new Date(pianificazione.date).getFullYear());
                                            }
                                        });
                                        const uniqueSetAnni = new Set(listaAnniPerMeseAppo);
                                        const listaAnniPerMese = Array.from(uniqueSetAnni);
                                        const listaAnniPerMeseSorted = listaAnniPerMese.sort((n1, n2) => n1 - n2);
                                        console.log('listaAnniPerMeseSorted');
                                        console.log(listaAnniPerMeseSorted);
                                        this.mappaMesiAnni.set(mese, listaAnniPerMeseSorted);
                                    });
                                    this.mappaGiornoMesiAnni.set(giorno, this.mappaMesiAnni);
                                    console.log('this.mappaGiornoMesiAnni');
                                    console.log(this.mappaGiornoMesiAnni);
                                    this.mappaMesiAnni = new Map<number, number[]>();
                                });
                                this.listaGiorni = Array.from(this.mappaGiornoMesiAnni.keys());
                                this.disLoading();
                            }
                            this.disLoading();
                        });
                    });
                });
            }
        });
    }


    clickAnno() {
        this.annoClick = true;
        this.meseClick = false;
        this.giornoClick = false;
        this.oraInizioClick = false;
        this.oraFineClick = false;
    }

    clickMese() {
        this.annoClick = false;
        this.meseClick = true;
        this.giornoClick = false;
        this.oraInizioClick = false;
        this.oraFineClick = false;
    }

    clickGiorno() {
        this.annoClick = false;
        this.meseClick = false;
        this.giornoClick = true;
        this.oraInizioClick = false;
        this.oraFineClick = false;
    }

    clickOraInizio() {
        this.annoClick = false;
        this.meseClick = false;
        this.giornoClick = false;
        this.oraInizioClick = true;
        this.oraFineClick = false;
    }

    clickOraFine() {
        this.annoClick = false;
        this.meseClick = false;
        this.giornoClick = false;
        this.oraInizioClick = false;
        this.oraFineClick = true;
    }


    cambioGiorno() {
        if (this.giornoClick) {
            this.prenotazioneFormModel.controls.annoDataLezione.reset();
            this.prenotazioneFormModel.controls.meseDataLezione.reset();
            this.prenotazioneFormModel.controls.oraInizio.reset();
            this.prenotazioneFormModel.controls.oraFine.reset();
            this.prenotazioneFormModel.controls.meseDataLezione.enable();
            const ritornoGiorno: number = parseInt(this.prenotazioneFormModel.controls.giornoDataLezione.value.slice(8, 10), 0);
            const mappaRitorno: Map<number, number[]> = this.mappaGiornoMesiAnni.get(ritornoGiorno);
            this.listaMesi = Array.from(mappaRitorno.keys());
        }
    }

    cambioMese() {
        if (this.meseClick) {
            this.prenotazioneFormModel.controls.annoDataLezione.reset();
            this.prenotazioneFormModel.controls.oraInizio.reset();
            this.prenotazioneFormModel.controls.oraFine.reset();
            this.prenotazioneFormModel.controls.annoDataLezione.enable();
            const ritorno: string = this.prenotazioneFormModel.controls.meseDataLezione.value.slice(5, 7);
            // tslint:disable-next-line:max-line-length
            const mappaRitorno: Map<number, number[]> = this.mappaGiornoMesiAnni.get(parseInt(this.prenotazioneFormModel.controls.giornoDataLezione.value.slice(8, 10), 0));
            this.listaAnni = mappaRitorno.get(parseInt(ritorno, 0));
        }
    }

    cambioAnno() {
        if (this.annoClick) {
            this.hoursInizio = [];
            this.prenotazioneFormModel.controls.oraInizio.reset();
            this.prenotazioneFormModel.controls.oraFine.reset();
            this.prenotazioneFormModel.controls.oraInizio.enable();
            const ritornoGiorno: number = parseInt(this.prenotazioneFormModel.controls.giornoDataLezione.value.slice(8, 10), 0);
            const ritornoMese: number = parseInt(this.prenotazioneFormModel.controls.meseDataLezione.value.slice(5, 7), 0);
            const ritornoAnno: number = parseInt(this.prenotazioneFormModel.controls.annoDataLezione.value.slice(0, 4), 0);
            const listaInizioEFine = this.mappaStartEnd.get(ritornoGiorno + '/' + ritornoMese + '/' + ritornoAnno);
            listaInizioEFine.forEach((oraIn) => {
                this.hoursInizio.push(oraIn[0]);
            });
        }
    }

    cambioDataInizio() {
        if (this.oraInizioClick) {
            const oraInizio = new Date(this.prenotazioneFormModel.controls.oraInizio.value);
            let i;
            let e = 0;
            for (i = 0; i < this.minutes.length; i++) {
                if (this.minutes[i] < oraInizio.getMinutes()) {
                    e++;
                }
            }
            this.minutes = this.minutes.slice(e, this.minutes.length);

            this.hoursFine = [];
            this.prenotazioneFormModel.controls.oraFine.reset();
            this.prenotazioneFormModel.controls.oraFine.enable();
            const ritornoAnno: number = parseInt(this.prenotazioneFormModel.controls.annoDataLezione.value.slice(0, 4), 0);
            const ritornoMese: number = parseInt(this.prenotazioneFormModel.controls.meseDataLezione.value.slice(5, 7), 0);
            const ritornoGiorno: number = parseInt(this.prenotazioneFormModel.controls.giornoDataLezione.value.slice(8, 10), 0);
            const listaInizioEFine = this.mappaStartEnd.get(ritornoGiorno + '/' + ritornoMese + '/' + ritornoAnno);
            listaInizioEFine.forEach((ora) => {
                const dataAppoggio = new Date(this.prenotazioneFormModel.controls.oraInizio.value);
                if (ora[0].slice(0, 2) === dataAppoggio.getHours().toString()) {
                    let oraAddOne = parseInt(ora[0].slice(0, 2), 0) + 1;
                    for (let h = 0; h < 24; h++) {
                        let controllo = false;
                        oraAddOne = parseInt(ora[0].slice(0, 2), 0) + h;
                        listaInizioEFine.forEach((hourAddOne) => {
                            if (hourAddOne[0].slice(0, 2) === oraAddOne.toString()) {
                                this.hoursFine.push(hourAddOne[1]);
                                controllo = true;
                            }
                        });
                        if (!controllo) {
                            break;
                        }
                    }
                }
            });
        }
    }


    caricaPrenotazione() {
        const ritornoAnno: number = parseInt(this.prenotazioneFormModel.controls.annoDataLezione.value.slice(0, 4), 0);
        const ritornoMese: number = parseInt(this.prenotazioneFormModel.controls.meseDataLezione.value.slice(5, 7), 0);
        const ritornoGiorno: number = parseInt(this.prenotazioneFormModel.controls.giornoDataLezione.value.slice(8, 10), 0);
        const pren = ritornoMese + '/' + ritornoGiorno + '/' + ritornoAnno;
        const dataPren = new Date(pren);
        const dataAttuale = new Date();
        const prenotazione = {
            idBooking: undefined,
            date: dataAttuale.getTime(),
            lessonState: 1
        };
        this.loadingPresent().then(() => {
            let bookList: Booking[];
            let pAppoggio: Planning;
            this.plans.forEach((p: Planning) => {
                // tslint:disable-next-line:max-line-length
                if (new Date(p.date).getTime() === dataPren.getTime() && (this.prenotazioneFormModel.controls.oraInizio.value.toString().slice(11, 16) + ':00') === p.startTime) {
                    pAppoggio = p;
                    const bookingDaInviare = new Booking(prenotazione, this.student$.value, pAppoggio);
                    bookList = [bookingDaInviare];
                }
            });
            console.log('bookList');
            this.bookingService.createRestBooking(bookList).subscribe(() => {
                this.disLoading();
                this.presentAlertAccettaLezione();
            });
        });
    }

    async presentAlertAccettaLezione() {
        const alert = await this.alertController.create({
            header: this.lessonBookedHeader,
            subHeader: this.lessonBookedSubHeader,
            message: this.lessonBookedMessage,
            buttons: [
                {
                    text: this.book,
                    handler: () => {
                        this.navController.navigateRoot('/ricerca-lezioni');
                        // this.resetta();
                    }
                }, {
                    text: this.doneButton,
                    handler: () => {
                        this.navController.navigateRoot('home');
                    }
                }]
        });

        await alert.present();
    }

    calcolaDataTeacher(lesson: Lesson) {
        console.log(lesson);
        const data = new Date(lesson.teacher.birthday);
        const timeDiff = Math.abs(Date.now() - data.getTime());
        this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    }

    creaChatTeacher() {
        this.loadingPresent().then(() => {
            this.booking$.subscribe((booking) => {
                console.log('secondo sub');
                console.log(booking);
                // tslint:disable-next-line:max-line-length
                this.createService.postSigleCreates(booking.student.idUser, booking.planning.lesson.teacher.name + ' ' + booking.planning.lesson.teacher.surname)
                    .subscribe((resp) => {
                        console.log('creato');
                        console.log(resp);
                        this.createService.getListCreates(booking.planning.lesson.teacher.idUser).subscribe((creates) => {
                            console.log(creates);
                            let chat = new Chat(undefined);
                            chat = creates.find(x => x.userListser[0].idUser === booking.student.idUser).chat;
                            const message = new Message(undefined, chat, this.user$.value);
                            // tslint:disable-next-line:max-line-length
                            message.text = 'System: ' + booking.planning.lesson.teacher.name + ' ' + booking.planning.lesson.teacher.surname + ' ha aggiunto ' + booking.student.name + ' ' + booking.student.surname + ' alla chat';
                            this.messageService.createRestMessage(message).subscribe((respMes) => {
                                console.log(respMes);
                                this.messageService.getLastMessageOfChat(chat.idChat, 0).subscribe((lastMes) => {
                                    console.log(lastMes);
                                    this.disLoading();
                                    const url = '/chat/' + chat.idChat.toString();
                                    this.navController.navigateForward(url);
                                });
                            });
                        });
                    });
            });
        });
    }

    creaChatStudent() {
        this.loadingPresent().then(() => {
            this.booking$.subscribe((booking) => {
                console.log(booking);
                // tslint:disable-next-line:max-line-length
                this.createService.postSigleCreates(booking.planning.lesson.teacher.idUser, booking.student.name + ' ' + booking.student.surname)
                    .subscribe((resp) => {
                        console.log('creato');
                        console.log(resp);
                        this.createService.getListCreates(booking.student.idUser).subscribe((creates) => {
                            console.log(creates);
                            let chat = new Chat(undefined);
                            chat = creates.find(x => x.userListser[1].idUser === booking.planning.lesson.teacher.idUser).chat;
                            const message = new Message(undefined, chat, this.user$.value);
                            // tslint:disable-next-line:max-line-length
                            message.text = 'System: ' + booking.student.name + ' ' + booking.student.surname + ' ha aggiunto ' + booking.planning.lesson.teacher.name + ' ' + booking.planning.lesson.teacher.surname + ' alla chat';
                            this.messageService.createRestMessage(message).subscribe((respMes) => {
                                console.log(respMes);
                                this.messageService.getLastMessageOfChat(chat.idChat, 0).subscribe((lastMes) => {
                                    console.log(lastMes);
                                    this.disLoading();
                                    const url = '/chat/' + chat.idChat.toString();
                                    this.navController.navigateForward(url);
                                });
                            });
                        });
                    });
            });
        });
    }

    creaChatStudentLesson() {
        this.loadingPresent().then(() => {
            this.lesson$.subscribe((lesson) => {
                console.log(lesson);
                this.createService.postSigleCreates(lesson.teacher.idUser, this.user$.value.name + ' ' + this.user$.value.name)
                    .subscribe((resp) => {
                        console.log('creato');
                        console.log(resp);
                        this.createService.getListCreates(this.user$.value.idUser).subscribe((creates) => {
                            console.log(creates);
                            let chat = new Chat(undefined);
                            chat = creates.find(x => x.userListser[1].idUser === lesson.teacher.idUser).chat;
                            const message = new Message(undefined, chat, this.user$.value);
                            // tslint:disable-next-line:max-line-length
                            message.text = 'System: ' + this.user$.value.name + ' ' + this.user$.value.surname + ' ha aggiunto ' + lesson.teacher.name + ' ' + lesson.teacher.surname + ' alla chat';
                            this.messageService.createRestMessage(message).subscribe((respMes) => {
                                console.log(respMes);
                                this.messageService.getLastMessageOfChat(chat.idChat, 0).subscribe((lastMes) => {
                                    console.log(lastMes);
                                    this.disLoading();
                                    const url = '/chat/' + chat.idChat.toString();
                                    this.navController.navigateForward(url);
                                });
                            });
                        });
                    });
            });
        });
    }

    async loadingPresent() {
        this.loading = await this.loadingController.create({
            message: this.pleaseWaitMessage,
            translucent: true
        });
        return await this.loading.present();
    }

    async disLoading() {
        await this.loading.dismiss();
    }

    private initTranslate() {
        this.translateService.get('PLEASE_WAIT_MESSAGE').subscribe((data) => {
            this.pleaseWaitMessage = data;
        });
        this.translateService.get('LESSON_BOOKED_HEADER').subscribe((data) => {
            this.lessonBookedHeader = data;
        });
        this.translateService.get('LESSON_BOOKED_SUBHEADER').subscribe((data) => {
            this.lessonBookedSubHeader = data;
        });
        this.translateService.get('LESSON_BOOKED_MESSAGE').subscribe((data) => {
            this.lessonBookedMessage = data;
        });
        this.translateService.get('BOOK').subscribe((data) => {
            this.book = data;
        });
        this.translateService.get('DONE_BUTTON').subscribe((data) => {
            this.doneButton = data;
        });
    }
}
