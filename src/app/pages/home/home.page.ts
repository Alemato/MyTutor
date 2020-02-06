import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserService} from '../../services/user.service';
import {LoadingController} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {User} from '../../model/user.model';



@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    private loading;
    private user$: BehaviorSubject<User>;
    private pleaseWaitMessage: string;

    constructor(private userService: UserService,
                public loadingController: LoadingController,
                public translateService: TranslateService,   // mi serve per la lingua
    ) {
    }

    ngOnInit() {
        this.initTranslate();
        this.user$ = this.userService.getUser();
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
    }

}
