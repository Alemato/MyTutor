import { Component, OnInit } from '@angular/core';
import {AlertController} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {BehaviorSubject, interval, Subscription} from 'rxjs';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';

@Component({
  selector: 'app-home-accettate',
  templateUrl: './home-accettate.page.html',
  styleUrls: ['./home-accettate.page.scss'],
})
export class HomeAccettatePage implements OnInit {
  private countDowns: Subscription;
  private student$: BehaviorSubject<Student>;
  private teacher$: BehaviorSubject<Teacher>;

  private json = [
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
          name: 'Lezione Bella',
          price: 12.0,
          description: 'La lezione bellissima',
          publicationDate: 1575846000000,
          createDate: 1575970984000,
          updateDate: 1578130046000,
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
            byography: 'Sono un bravo professore di prova.',
            user: {
              idUser: 13,
              email: 'teacher@prova.it',
              roles: 2,
              name: 'Teacher',
              surname: 'Prova',
              birthday: -3600000,
              language: false,
              // tslint:disable-next-line:max-line-length
              image: 'data:image/png;base64,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',
              createDate: 1576939992000,
              updateDate: 1578131036000
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
            byography: 'Sono un bravo professore di prova.',
            user: {
              idUser: 13,
              email: 'teacher@prova.it',
              roles: 2,
              name: 'Teacher',
              surname: 'Prova',
              birthday: -3600000,
              language: false,
              // tslint:disable-next-line:max-line-length
              image: 'data:image/png;base64,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',
              createDate: 1576939992000,
              updateDate: 1578131036000
            }
          }
        }
      }
    }
  ];

  public lezioni = [];

  constructor(public alertController: AlertController, private userService: UserService) {
    this.userService.whichUserType().then((tipo) => {
      if (tipo === 'student') {
        this.student$ = this.userService.getStudent();
      } else if (tipo === 'teacher') {
        this.teacher$ = this.userService.getTeacher();
      }
    });
  }

  ngOnInit() {
    this.setArrayLezioni();
    this.countDown();
  }

  setArrayLezioni() {
    this.json.forEach((item) => {
      const lezioneSingola = {
        lessonState: 0,
        nomeLezione: '',
        nomeProf: '',
        imgProf: '',
        nomeStudent: '',
        imgStudent: '',
        date: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
      lezioneSingola.lessonState = item.lessonState;
      lezioneSingola.nomeLezione = item.planning.lesson.name;
      lezioneSingola.nomeProf = item.planning.lesson.teacher.user.name + ' ' + item.planning.lesson.teacher.user.surname;
      lezioneSingola.imgProf = item.planning.lesson.teacher.user.image;
      lezioneSingola.nomeStudent = item.student.user.name + ' ' + item.student.user.surname;
      lezioneSingola.imgStudent = item.student.user.image;
      const [h, m, s] = item.planning.startTime.split(':');
      const data = new Date(item.planning.date);
      data.setHours(+h);
      data.setMinutes(+m);
      data.setSeconds(+s);
      lezioneSingola.date = data.getTime();
      console.log(new Date(lezioneSingola.date));
      this.lezioni.push(lezioneSingola);
    });
    console.log(this.lezioni);
  }

  countDown() {
    this.lezioni.forEach((item) => {
      const nowDate = new Date().getTime();
      const distance = item.date - nowDate;
      item.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      item.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      item.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      item.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    });
  }

  ionViewWillEnter() {
    // this.countDown();
    console.log(new Date(this.lezioni[0].date));
    this.countDowns = interval(800).subscribe(x => {
        this.countDown();
    });
  }

  ionViewDidLeave() {
    this.countDowns.unsubscribe();
  }

  async presentAlert(item) {
    const alert = await this.alertController.create({
      header: 'Annullare la Lezzione',
      subHeader: 'Conferma',
      message: 'Sei sicuro di voler annullare la lezione?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Annulla operazione');
            item.close();
          }
        }, {
          text: 'OK',
          handler: () => {
            console.log('Conferma annullamento lezione');
            item.close();
          }
        }]
    });

    await alert.present();
  }

  addPrenotazioneLezione() {
    console.log('Vai a alla pagina per prenotare la lezione');
  }

}
