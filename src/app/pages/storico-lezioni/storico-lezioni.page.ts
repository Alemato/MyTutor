import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {PopoverFiltroStoricoLezioniComponent} from '../../popovers/popover-filtro-storico-lezioni/popover-filtro-storico-lezioni.component';

@Component({
  selector: 'app-storico-lezioni',
  templateUrl: './storico-lezioni.page.html',
  styleUrls: ['./storico-lezioni.page.scss'],
})
export class StoricoLezioniPage implements OnInit {

  public storico = [
    {
      idLezione: 1,
      nome: 'Lezione 1',
      createDate: 1576407073000,
      updateDate: 1576755786000,
      teacher: {
        idUser: 2,
        email: 'marco',
        roles: 1,
        name: 'Marco',
        surname: 'Rossi',
        // tslint:disable-next-line:max-line-length
        image: 'data:image/png;base64,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'
      },
      student: {
        idUser: 2,
        email: 'mario',
        roles: 1,
        name: 'Mario',
        surname: 'Rossi',
        image: null
      }
    },
    {
      idLezione: 2,
      nome: 'Lezione 1',
      createDate: 1576407073000,
      updateDate: 1576755786000,
      teacher: {
        idUser: 2,
        email: 'marco',
        roles: 1,
        name: 'Marco',
        surname: 'Rossi',
        // tslint:disable-next-line:max-line-length
        image: 'data:image/png;base64,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'
      },
      student: {
        idUser: 2,
        email: 'mario',
        roles: 1,
        name: 'Mario',
        surname: 'Rossi',
        image: null
      }
    },
    {
      idLezione: 3,
      nome: 'Lezione 1',
      createDate: 1576407073000,
      updateDate: 1576755786000,
      teacher: {
        idUser: 2,
        email: 'marco',
        roles: 1,
        name: 'Marco',
        surname: 'Rossi',
        // tslint:disable-next-line:max-line-length
        image: 'data:image/png;base64,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'
      },
      student: {
        idUser: 2,
        email: 'mario',
        roles: 1,
        name: 'Mario',
        surname: 'Rossi',
        image: null
      }
    },
    {
      idLezione: 4,
      nome: 'Lezione 1',
      createDate: 1576407073000,
      updateDate: 1576755786000,
      teacher: {
        idUser: 2,
        email: 'marco',
        roles: 1,
        name: 'Marco',
        surname: 'Rossi',
        // tslint:disable-next-line:max-line-length
        image: 'data:image/png;base64,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'
      },
      student: {
        idUser: 2,
        email: 'mario',
        roles: 1,
        name: 'Mario',
        surname: 'Rossi',
        image: null
      }
    },
    {
      idLezione: 5,
      nome: 'Lezione 1',
      createDate: 1576407073000,
      updateDate: 1576755786000,
      teacher: {
        idUser: 2,
        email: 'marco',
        roles: 1,
        name: 'Marco',
        surname: 'Rossi',
        // tslint:disable-next-line:max-line-length
        image: 'data:image/png;base64,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'
      },
      student: {
        idUser: 2,
        email: 'mario',
        roles: 1,
        name: 'Mario',
        surname: 'Rossi',
        image: null
      }
    }
  ];
  constructor(public popoverController: PopoverController) { }

  ngOnInit() {
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverFiltroStoricoLezioniComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
}
