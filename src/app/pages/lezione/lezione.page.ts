import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Teacher} from '../../model/teacher.model';
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
import {LoadingController, NavController} from '@ionic/angular';


@Component({
    selector: 'app-lezione',
    templateUrl: './lezione.page.html',
    styleUrls: ['./lezione.page.scss'],
})
export class LezionePage implements OnInit {
    private user$: BehaviorSubject<User>;
    private bookings$: BehaviorSubject<Booking[]>;
    private booking$: Observable<Booking>;
    private lesson$: Observable<Lesson>;
    private age = 0;
    private isBooking = false;
    private idChat = 0;
    private existsChat = false;
    private loading;

    private isLesson = false;
    private plannings$: BehaviorSubject<Planning[]>;

    private teacher: Teacher;
    private id: string;
    private provenienza: string;
    private dataBooking;
    private startTime: string;
    private endTime: string;
    private userType: string;

    constructor(
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
        private loadingController: LoadingController
    ) {
        this.user$ = this.userService.getUser();
    }


    ngOnInit() {
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
                this.isBooking = false;
                this.isLesson = true;
                this.plannings$ = this.planningService.getPlannings();
                this.planningService.getRestPlanningByIdLesson(this.id).subscribe((plannings) => {
                    console.log(plannings);
                    this.lesson$ = new Observable<Lesson>(subscriber => {
                        subscriber.next(plannings[0].lesson);
                    });
                    this.lesson$.subscribe((lesson) => {
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
                            // Aggiungere logica per spedire i booking creati
                        }
                    });
                });
            }
        });
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

    /*controlloProvenienzaForfettario() {
        this.provenienza = 'history';
        this.id = '8';
        // this.getPlanningsFromRest();
        // this.getBookingFromStorage(STORAGE.BOOKING);
        // this.getBookingFromStorage(STORAGE.HISTORY);
    }*/

    controlloProvenienza() {
        // this.id = this.activatedRoute.snapshot.paramMap.get('id');
    }

    /*getPlanningsFromRest() {
        this.plannings$ = this.planningService.getRestPlanningByIdLesson(this.id);
        this.plannings$.subscribe((plannings1) => {
            this.lesson = plannings1.find(x => x !== undefined).lesson;
            this.teacher = this.lesson.teacher;
        });
    }*/

    /*getBookingFromStorage(storageKey: string) {
        this.booking$ = this.bookingService.getStorageBookingById(parseInt((this.id), 0), storageKey);
        this.booking$.subscribe((booking) => {
            this.lesson = booking.planning.lesson;

            this.data = new Date(this.lesson.teacher.birthday);
            this.timeDiff = Math.abs(Date.now() - this.data.getTime());
            this.age = Math.floor((this.timeDiff / (1000 * 3600 * 24)) / 365.25);

            this.dataBooking = this.datePipe.transform(new Date(booking.planning.date), 'dd-MM-yyyy');
            this.startTime = booking.planning.startTime.substring(0, 5);
            this.endTime = booking.planning.endTime.substring(0, 5);
            console.log(this.lesson);
        });
    }*/

    /*  }
      getPlanningsFromRest() {
        this.lessonService.getRestLesson().subscribe((planningList) => {
          this.plannings$ = planningList;
          this.lesson = this.plannings.get(0).lesson;
        });
      }*/
}
