import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';
import {AlertController} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {Planning} from '../../model/planning.model';
import {LessonService} from '../../services/lesson.service';
import {Lesson} from '../../model/lesson.model';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Booking} from '../../model/booking.model';
import {Storage} from '@ionic/storage';
import {DatePipe} from '@angular/common';
import {BookingService} from '../../services/booking.service';
import {PlanningService} from '../../services/planning.service';
import {STORAGE} from '../../constants';


@Component({
    selector: 'app-lezione',
    templateUrl: './lezione.page.html',
    styleUrls: ['./lezione.page.scss'],
})
export class LezionePage implements OnInit {

    private student$: BehaviorSubject<Student>;
    private teacher$: BehaviorSubject<Teacher>;
    private plannings$: Observable<Planning[]>;
    private booking$: Observable<Booking>;
    private bookings$: Observable<Booking[]>;
    private teacher: Teacher;
    private id: string;
    private provenienza: string;
    private timeDiff: number;
    private age: number;
    private data;
    private dataBooking;
    private startTime: string;
    private endTime: string;
    private userType: string;

    private lesson: Lesson;

    private json = [
        {
            idBooking: 7,
            date: 1578092400000,
            lessonState: 0,
            createDate: 1578133436000,
            updateDate: 1578133436000,
            student: {
                idStudent: 3,
                studyGrade: 'Scuola superiore',
                idUser: 12,
                user: {
                    idUser: 12,
                    email: 'studente@prova.it',
                    name: 'Prova',
                    surname: 'Studente',
                    birthday: 662684400000,
                    language: false,
                    // tslint:disable-next-line:max-line-length
                    image: 'data:image/png;base64,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',
                    createDate: 1576842143000,
                    updateDate: 1578138985000
                }
            },
            planning: {
                idPlanning: 30,
                date: 1578351600000,
                startTime: '09:00:00',
                endTime: '10:00:00',
                lesson: {
                    idLesson: 1,
                    name: 'Lezione BellaBella',
                    price: 14.0,
                    description: 'La lezione bellissima',
                    publicationDate: 1575846000000,
                    createDate: 1575970984000,
                    updateDate: 1578149898000,
                    subject: {
                        idSubject: 1,
                        macroSubject: 'Matematica',
                        microSubject: 'Equazioni',
                        createDate: 1575970829000,
                        updateDate: 1575970829000
                    },
                    teacher: {
                        idTeacher: 3,
                        postCode: 67100,
                        City: 'L\'aquila',
                        region: 'Abruzzo',
                        street: 'via roma',
                        streetNumber: '1',
                        byography: 'Sono un bravo professore di prova.\nModificato 5',
                        user: {
                            idUser: 13,
                            email: 'teacher@prova.it',
                            roles: 2,
                            name: 'Mario',
                            surname: 'Rossi',
                            birthday: -3600000,
                            language: false,
                            // tslint:disable-next-line:max-line-length
                            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGcElEQVR4nNWdT2wUVRzHv92d3drSxS1Ls7ZCuiARYjDSiI0XaxQTiSReyqHIwRpjUjlQEkkajCFIjPXQG0ZCYqwmSDiZeCCEkAZ6IN5ADWLUpFuhSqEL7bb0D2W346G+ZXZ3ZufNvN978+Z762bml32f/b4/v/ebea0b60ub0FSJrl7E27bi3tkjZDE3nZzkum7ieBce3f7T9TpD9AvJUqKrF+v3fVH6mxIipSJBfwE7VcJb++p7SPUMBviNnKUdwEp4TLpC1AqgEzwmHSFqA9ANHpNuELUAyAuPSSeIgQP0Co9JF4iBAvQLj0kHiIEBFIXHFDTEOtM0uTIR3pU5j6jgWTU7Osy12I61PssV79HUOFBYdr1OeSYiAx6w6kTAPWOhMgGT0i4sCx5TEN1ZGUDZ8JhUQ1QCUBU8JpUQpQNUDY9JFUSpAIOCx6QCojSAQcNjkg1RCkBd4DHJhEgOUDd4TLIg1lHWRBJdvVjz4tswmlsRa9kkFKs4l8PiH1cQXdtCGm9l/j5peYDMgcx5sZYM/vnsdUx9149HU1nPcYpzOdz/4ThuffISIvVryONROzHav7PpmGgQa7eNNCRQmJnEgyvfY3b0WxRyNxF/ehuia5prxijO5TBzbghTwwew9NdPiG/YjlT3UfJ4AFCf6UA0kcLi9RHRpot3YbsxrzD9L24dfflxMh6JoqlzL5JvHarqisW5HPIXv8Ls6DDM5cXS5+kDp9H4/BtS4jHxbkDUkpADnSaMSEMCxfwdLP/98+oHponlid/KHISVYplDUCyU7o+37yi5RUY8Jgon+gboNtvGNzyH2dFhYKX4+MP/Gw4AxflpTP/4eVlDmdbvH0IsvVlqPCZRiL4A8ixVqlxjvbdnEPXtL9h+cSe3UMezSgSi51nYyzovufsgYMQd77WbEZv3HFYWzyq/s7MnB3pdJFtd43Sv9dd3cwt1vFr38op7R9pvhpHcfRB1sXqk9n7qeA3bTTbWbVQez+le3tmZC6BIehZ5IoE4Rx3CaMkg2phUHs9OXiC6joGiuW1+5BRypz9anUEdtHDjEu6cfBfT54aUx3MS75hYcwwUhbeyOIe7X38AFJaxeH0E0UQK9ZmOsmtYY1FYRuFuFo3bd8FItiqJ5yaeMdHRgRS7KvmRUzCXHpT+vnf2SJlzrI1lquUa6ng8cnOirQMp4FndYhVzTnFhpqqxABxdQx3Pi2o5scqBVPt5lW5hirfvgLFuI6KNSTRse8X2XjvXUMfzKicnlm0mUMFbWZzDzY87yhocb9+B5j2HqxL6h+PXMH1uqOrXbRs4XxrfqOOJqHIDotSFKXeSZy6cwNLvlwGsNnT9/iGkuo/a5qNGshVNnd1o3L4LhfwkCndX9/wK+Uk0dXZLiSeiqu481pc2p84MmFQqLsya2UPPmBODb5rzv170fP9S9qp5+8t3zLG+tLmUvUoej0r5y9+YY31ps27qzIBJWcOY/+UC6iLRqq7lVQ/Hr2EpexXGug2k8Z587X2hOFbNjg7DiLdtJQsIrOarRrP/GY/JSG1ENHeTPB6ljJYMIpVrKVHpXhOhEltzRvt3Nh1zWtX7URhqIqKyLtjLljGpnsFSIi2isNRE/Kgy2ynLRKicGJaaiFfZpYpVqRwVxLDURHhlBw9wyIUpIIapJuImJ3hAjd0Yitk5TDURJ9WCB7jsB4o6MWw1kUq5wQM4tvRZ4ux3dg5bTYSJBx7AWRMRgRjGmggvPMBDXdjvmBi2mogXeIDHurDXMTFsNRGv8AAfTyZ4cWKYaiJ+4AE+n43hcWKYaiJ+4QECT6i6OTEsNREReADBA5Z2GxBhqYmIwgMIHvG1685hqIlQwAMIn9JnTmRuiaW32DrETVYHtQ2cRyy9hTRefaaDDB5A/JpDqmcQ0WSb1jWRWHozGTyAGCBAtykrQws3LuHOiX1c1/KesUX+phJ1jYVKpW5LLCnvyukGkXLMq5S0tzV1gSgTHiD5feGgIcqGByh4Yz0oiCrgAYrOTFANURU8QOGpHaogqoQHKD43RjZE1fCAAM7OkgUxCHiAhxdteFfm2Q+fcr1GtFBVKRnwJo53cV0X2Cm+VBBlOY/3jK1Azw8U7c5BdVurAj/B0i9EHeABGgAEvEPUBR6gCUCAH6JO8ACNAALuEHWDB2gGEHCGqCM8QEOAAF/BXBdp+98c2DrRaMloCw8A/gNulaOybTUyAAAAAABJRU5ErkJggg==',
                            createDate: 1576939992000,
                            updateDate: 1578244558000
                        }
                    }
                }
            }
        },
        {
            idBooking: 8,
            date: 1578092400000,
            lessonState: 0,
            createDate: 1578133465000,
            updateDate: 1578133465000,
            student: {
                idStudent: 3,
                studyGrade: 'Scuola superiore',
                idUser: 12,
                user: {
                    idUser: 12,
                    email: 'studente@prova.it',
                    name: 'Prova',
                    surname: 'Studente',
                    birthday: 662684400000,
                    language: false,
                    // tslint:disable-next-line:max-line-length
                    image: 'data:image/png;base64,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',
                    createDate: 1576842143000,
                    updateDate: 1578138985000
                }
            },
            planning: {
                idPlanning: 32,
                date: 1578351600000,
                startTime: '11:00:00',
                endTime: '12:00:00',
                lesson: {
                    idLesson: 2,
                    name: 'Lezione Brutta',
                    price: 10.0,
                    description: 'La lezione bruttissima',
                    publicationDate: 1546902000000,
                    createDate: 1575971129000,
                    updateDate: 1578130046000,
                    subject: {
                        idSubject: 2,
                        macroSubject: 'Italiano',
                        microSubject: 'Poesie',
                        createDate: 1575970873000,
                        updateDate: 1575970873000
                    },
                    teacher: {
                        idTeacher: 3,
                        postCode: 67100,
                        City: 'L\'aquila',
                        region: 'Abruzzo',
                        street: 'via roma',
                        streetNumber: '1',
                        byography: 'Sono un bravo professore di prova.\nModificato 5',
                        user: {
                            idUser: 13,
                            email: 'teacher@prova.it',
                            roles: 2,
                            name: 'Mario',
                            surname: 'Rossi',
                            birthday: -3600000,
                            language: false,
                            // tslint:disable-next-line:max-line-length
                            image: 'data:image/png;base64,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',
                            createDate: 1576939992000,
                            updateDate: 1578244558000
                        }
                    }
                }
            }
        },
        {
            idBooking: 9,
            date: 1578092400000,
            lessonState: 1,
            createDate: 1578144886000,
            updateDate: 1578145205000,
            student: {
                idStudent: 3,
                studyGrade: 'Scuola superiore',
                idUser: 12,
                user: {
                    idUser: 12,
                    email: 'studente@prova.it',
                    name: 'Prova',
                    surname: 'Studente',
                    birthday: 662684400000,
                    language: false,
                    // tslint:disable-next-line:max-line-length
                    image: 'data:image/png;base64,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',
                    createDate: 1576842143000,
                    updateDate: 1578138985000
                }
            },
            planning: {
                idPlanning: 30,
                date: 1578351600000,
                startTime: '09:00:00',
                endTime: '10:00:00',
                lesson: {
                    idLesson: 1,
                    name: 'Lezione BellaBella',
                    price: 14.0,
                    description: 'La lezione bellissima',
                    publicationDate: 1575846000000,
                    createDate: 1575970984000,
                    updateDate: 1578149898000,
                    subject: {
                        idSubject: 1,
                        macroSubject: 'Matematica',
                        microSubject: 'Equazioni',
                        createDate: 1575970829000,
                        updateDate: 1575970829000
                    },
                    teacher: {
                        idTeacher: 3,
                        postCode: 67100,
                        City: 'L\'aquila',
                        region: 'Abruzzo',
                        street: 'via roma',
                        streetNumber: '1',
                        byography: 'Sono un bravo professore di prova.\nModificato 5',
                        user: {
                            idUser: 13,
                            email: 'teacher@prova.it',
                            roles: 2,
                            name: 'Mario',
                            surname: 'Rossi',
                            birthday: -3600000,
                            language: false,
                            // tslint:disable-next-line:max-line-length
                            image: 'data:image/png;base64,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',
                            createDate: 1576939992000,
                            updateDate: 1578244558000
                        }
                    }
                }
            }
        }
    ];

    private jsonStorico = [
        {
            idBooking: 7,
            date: 1578092400000,
            lessonState: 1,
            createDate: 1578133436000,
            updateDate: 1578133436000,
            student: {
                idStudent: 3,
                studyGrade: 'Scuola superiore',
                idUser: 12,
                user: {
                    idUser: 12,
                    email: 'studente@prova.it',
                    name: 'Prova',
                    surname: 'Studente',
                    birthday: 662684400000,
                    language: false,
                    // tslint:disable-next-line:max-line-length
                    image: 'data:image/png;base64,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',
                    createDate: 1576842143000,
                    updateDate: 1578138985000
                }
            },
            planning: {
                idPlanning: 30,
                date: 1578351600000,
                startTime: '09:00:00',
                endTime: '10:00:00',
                lesson: {
                    idLesson: 1,
                    name: 'Lezione BellaBella',
                    price: 14.0,
                    description: 'La lezione bellissima',
                    publicationDate: 1575846000000,
                    createDate: 1575970984000,
                    updateDate: 1578149898000,
                    subject: {
                        idSubject: 1,
                        macroSubject: 'Matematica',
                        microSubject: 'Equazioni',
                        createDate: 1575970829000,
                        updateDate: 1575970829000
                    },
                    teacher: {
                        idTeacher: 3,
                        postCode: 67100,
                        City: 'L\'aquila',
                        region: 'Abruzzo',
                        street: 'via roma',
                        streetNumber: '1',
                        byography: 'Sono un bravo professore di prova.\nModificato 5',
                        user: {
                            idUser: 13,
                            email: 'teacher@prova.it',
                            roles: 2,
                            name: 'Mario',
                            surname: 'Rossi',
                            birthday: -3600000,
                            language: false,
                            // tslint:disable-next-line:max-line-length
                            image: 'data:image/png;base64,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',
                            createDate: 1576939992000,
                            updateDate: 1578244558000
                        }
                    }
                }
            }
        },
        {
            idBooking: 8,
            date: 1578092400000,
            lessonState: 2,
            createDate: 1578133465000,
            updateDate: 1578133465000,
            student: {
                idStudent: 3,
                studyGrade: 'Scuola superiore',
                idUser: 12,
                user: {
                    idUser: 12,
                    email: 'studente@prova.it',
                    name: 'Prova',
                    surname: 'Studente',
                    birthday: 662684400000,
                    language: false,
                    // tslint:disable-next-line:max-line-length
                    image: 'data:image/png;base64,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',
                    createDate: 1576842143000,
                    updateDate: 1578138985000
                }
            },
            planning: {
                idPlanning: 32,
                date: 1578351600000,
                startTime: '11:00:00',
                endTime: '12:00:00',
                lesson: {
                    idLesson: 2,
                    name: 'Lezione Brutta',
                    price: 10.0,
                    description: 'La lezione bruttissima',
                    publicationDate: 1546902000000,
                    createDate: 1575971129000,
                    updateDate: 1578130046000,
                    subject: {
                        idSubject: 2,
                        macroSubject: 'Italiano',
                        microSubject: 'Poesie',
                        createDate: 1575970873000,
                        updateDate: 1575970873000
                    },
                    teacher: {
                        idTeacher: 3,
                        postCode: 67100,
                        City: 'L\'aquila',
                        region: 'Abruzzo',
                        street: 'via roma',
                        streetNumber: '1',
                        byography: 'Sono un bravo professore di prova.\nModificato 5',
                        user: {
                            idUser: 13,
                            email: 'teacher@prova.it',
                            roles: 2,
                            name: 'Mario',
                            surname: 'Rossi',
                            birthday: -3600000,
                            language: false,
                            // tslint:disable-next-line:max-line-length
                            image: 'data:image/png;base64,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',
                            createDate: 1576939992000,
                            updateDate: 1578244558000
                        }
                    }
                }
            }
        },
        {
            idBooking: 9,
            date: 1578092400000,
            lessonState: 4,
            createDate: 1578144886000,
            updateDate: 1578145205000,
            student: {
                idStudent: 3,
                studyGrade: 'Scuola superiore',
                idUser: 12,
                user: {
                    idUser: 12,
                    email: 'studente@prova.it',
                    name: 'Prova',
                    surname: 'Studente',
                    birthday: 662684400000,
                    language: false,
                    // tslint:disable-next-line:max-line-length
                    image: 'data:image/png;base64,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',
                    createDate: 1576842143000,
                    updateDate: 1578138985000
                }
            },
            planning: {
                idPlanning: 30,
                date: 1578351600000,
                startTime: '09:00:00',
                endTime: '10:00:00',
                lesson: {
                    idLesson: 1,
                    name: 'Lezione BellaBella',
                    price: 14.0,
                    description: 'La lezione bellissima',
                    publicationDate: 1575846000000,
                    createDate: 1575970984000,
                    updateDate: 1578149898000,
                    subject: {
                        idSubject: 1,
                        macroSubject: 'Matematica',
                        microSubject: 'Equazioni',
                        createDate: 1575970829000,
                        updateDate: 1575970829000
                    },
                    teacher: {
                        idTeacher: 3,
                        postCode: 67100,
                        City: 'L\'aquila',
                        region: 'Abruzzo',
                        street: 'via roma',
                        streetNumber: '1',
                        byography: 'Sono un bravo professore di prova.\nModificato 5',
                        user: {
                            idUser: 13,
                            email: 'teacher@prova.it',
                            roles: 2,
                            name: 'Mario',
                            surname: 'Rossi',
                            birthday: -3600000,
                            language: false,
                            // tslint:disable-next-line:max-line-length
                            image: 'data:image/png;base64,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',
                            createDate: 1576939992000,
                            updateDate: 1578244558000
                        }
                    }
                }
            }
        }
    ];

    constructor(
        private storage: Storage,
        private route: ActivatedRoute,
        public alertController: AlertController,
        private userService: UserService,
        private lessonService: LessonService,
        private bookingService: BookingService,
        private planningService: PlanningService,
        private datePipe: DatePipe,
        private activatedRoute: ActivatedRoute
    ) {
        this.userType = this.userService.getTypeUser();
        if (this.userType === 'student') {
            this.student$ = this.userService.getUser();
        } else if (this.userType === 'teacher') {
            this.teacher$ = this.userService.getUser();
        }
    }


    ngOnInit() {
        // this.storage.set(STORAGE.BOOKING, this.jsonStorico).then((ciao) => {
        //     if (ciao) {
        //         this.controlloProvenienzaForfettario();
        //     }
        // });
        // this.controlloProvenienzaForfettario();
        this.controlloProvenienza();
    }

    controlloProvenienzaForfettario() {
        this.provenienza = 'history';
        this.id = '8';
        // this.getPlanningsFromRest();
        // this.getBookingFromStorage(STORAGE.BOOKING);
        this.getBookingFromStorage(STORAGE.HISTORY);
    }

    controlloProvenienza() {
        // this.id = this.activatedRoute.snapshot.paramMap.get('id');

        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.provenienza = params.get('prov');
            this.id = params.get('idPlanning');
            if (params.get('prov') === 'booking') {
                console.log('booking');
                this.getBookingFromStorage(STORAGE.BOOKING);
            } else if (params.get('prov') === 'history') {
                console.log('history');
                this.getBookingFromStorage(STORAGE.HISTORY);
            } else if (params.get('prov') === 'risric') {
                console.log('risultati ricerca');
                this.getPlanningsFromRest();
            }
        });
    }

    getPlanningsFromRest() {
        this.plannings$ = this.planningService.getRestPlanningByIdLesson(this.id);
        this.plannings$.subscribe((plannings1) => {
            this.lesson = plannings1.find(x => x !== undefined).lesson;
            this.teacher = this.lesson.teacher;
        });
    }

    getBookingFromStorage(storageKey: string) {
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
    }

    /*  }
      getPlanningsFromRest() {
        this.lessonService.getRestLesson().subscribe((planningList) => {
          this.plannings$ = planningList;
          this.lesson = this.plannings.get(0).lesson;
        });
      }*/
}
