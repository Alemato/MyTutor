import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserService} from '../../services/user.service';
import {Planning} from '../../model/planning.model';
import {LessonService} from '../../services/lesson.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {DatePipe} from '@angular/common';
import {BookingService} from '../../services/booking.service';
import {PlanningService} from '../../services/planning.service';
import {ChatService} from '../../services/chat.service';
import {MessageService} from '../../services/message.service';
import {AlertController, NavController} from '@ionic/angular';
import {FormBuilder} from '@angular/forms';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';
import {Message} from '../../model/message.model';
import {Chat} from '../../model/chat.model';


@Component({
    selector: 'app-lezione',
    templateUrl: './lezione.page.html',
    styleUrls: ['./lezione.page.scss'],
})
export class LezionePage implements OnInit {
    private planning$: Observable<Planning>;
    private user$: BehaviorSubject<Student | Teacher>;
    private age = 0;
    private noPlanningDisp = false;
    private planning: Planning;

    constructor(
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private navController: NavController,
        private userService: UserService,
        private lessonService: LessonService,
        private bookingService: BookingService,
        private planningService: PlanningService,
        private datePipe: DatePipe,
        private activatedRoute: ActivatedRoute,
        private chatService: ChatService,
        private messageService: MessageService
    ) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.user$ = this.userService.getUser();
            this.planning$ = this.planningService.getRestPlanningById(params.get('idPlanning'));
            this.planning$.subscribe((planning) => {
                this.planningService.planningsByIdL(planning.lesson.idLesson).subscribe((plannings) => {
                    if (plannings.length > 0) {
                        this.noPlanningDisp = true;
                    }
                    this.planning = planning;
                    this.calcolaDataTeacher(planning);
                });
            });
        });
    }

    ionViewWillEnter() {
        this.noPlanningDisp = false;
    }

    calcolaDataTeacher(planning: Planning) {
        const data = new Date(planning.lesson.teacher.birthday);
        const timeDiff = Math.abs(Date.now() - data.getTime());
        this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    }

    /**
     * Controllo dell'esistenza scaturito alla pressione del bottone della chat.
     * Se la chat tra i due utenti (Professore e Studente e viceversa) si viene reindirizzati alla chat
     * altrimenti si passa al metodo creaChat()
     */
    controlloChat() {
        if (this.user$.value.roles === 1) {
            this.chatService.getRestCountChatUser2(this.planning.lesson.teacher.idUser).subscribe((numberChat) => {
                if (numberChat === 1) {
                    this.chatService.getRestChatList().subscribe((messages: Message[]) => {
                        const chat = messages.find(x => x.chat.userListser[1].idUser === this.planning.lesson.teacher.idUser).chat;
                        this.navController.navigateForward('/chat/' + chat.idChat);
                    });
                } else if (numberChat < 1) {
                    this.creaChat(this.planning.lesson.teacher);
                }
            });
        } else {
            this.bookingService.getRestBookingPlanning(this.planning.idPlanning.toString()).subscribe((booking) => {
                this.chatService.getRestCountChatUser2(booking.student.idUser).subscribe((data) => {
                    if (data === 1) {
                        this.chatService.getRestChatList().subscribe((messages: Message[]) => {
                            const chat = messages.find(x => x.chat.userListser[0].idUser === booking.student.idUser).chat;
                            this.navController.navigateForward('/chat/' + chat.idChat);
                        });
                    } else if (data < 1) {
                        this.creaChat(booking.student);
                    }
                });
            });
        }
    }

    /**
     * Per chreare una nuova chat, una volta creata la chat si viene reindirizzati in quella chat
     * @param utente può essere sia di tipo Student che di tipo Teacher
     */
    creaChat(utente: Student | Teacher) {
        const chat = new Chat();
        if (this.user$.value.roles === 1) {
            chat.userListser = [this.user$.value as Student, utente as Teacher];
        } else {
            chat.userListser = [utente as Student, this.user$.value as Teacher];
        }
        this.chatService.createRestChat(chat).subscribe((url) => {
            this.chatService.getRestChatByUrl(url).subscribe((chatDalServer) => {
                const message = new Message();
                message.idMessage = 0;
                message.user = this.user$.value;
                message.chat = chatDalServer;
                message.sendDate = new Date().getTime();
                message.text = 'System: ' + this.user$.value.name + ' ' +
                    this.user$.value.surname + ' ha aggiunto ' + utente.name + ' ' +
                    utente.surname + ' alla chat';
                this.messageService.createRestMessage(message).subscribe(() => {
                    this.navController.navigateForward('/chat/' + chatDalServer.idChat.toString());
                });
            });
        });
    }
}
