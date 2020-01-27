import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ChatService} from '../../services/chat.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../model/user.model';
import {CreatesChat} from '../../model/creates.model';
import {Message} from '../../model/message.model';
import {LoadingController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-lista-chat',
    templateUrl: './lista-chat.page.html',
    styleUrls: ['./lista-chat.page.scss'],
})
export class ListaChatPage implements OnInit {
    private user$: BehaviorSubject<User>;
    private creates$: BehaviorSubject<CreatesChat[]>;
    private lastMessageFromChats$: BehaviorSubject<Message[]>;
    private chatCount$: BehaviorSubject<number>;
    private loading;
    private pleaseWaitMessage: string;

    constructor(private userService: UserService,
                private chatService: ChatService,
                private loadingController: LoadingController,
                private translateService: TranslateService) {
        this.user$ = this.userService.getUser();
        this.lastMessageFromChats$ = this.chatService.getLastMessageFromChats();
        this.creates$ = this.chatService.getCreates();
        this.chatCount$ = this.chatService.getChatCount();
    }

    ngOnInit() {
        this.initTranslate();
        this.chatService.getRestCountChat().subscribe((n: number) => {
            if (n !== 0) {
                this.chatService.countFromStorage().then((numb: number) => {
                    if (numb < n) {
                        this.chatService.getRestChatList().subscribe(() => {});
                    }
                });
            }
        });
        this.lastMessageFromChats$.subscribe();
        this.creates$.subscribe();
    }

    ionViewWillEnter() {
        this.loadingPresent().then(() => {
            this.chatService.getRestChatList().subscribe(() => {
                this.disLoading();
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
    }
}
