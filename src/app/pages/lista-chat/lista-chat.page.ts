import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ChatService} from '../../services/chat.service';
import {BehaviorSubject} from 'rxjs';
import {Message} from '../../model/message.model';
import {LoadingController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {Student} from '../../model/student.model';
import {Teacher} from '../../model/teacher.model';

@Component({
    selector: 'app-lista-chat',
    templateUrl: './lista-chat.page.html',
    styleUrls: ['./lista-chat.page.scss'],
})
export class ListaChatPage implements OnInit {
    private user$: BehaviorSubject<Student | Teacher>;
    private lastMessageFromChats$: BehaviorSubject<Message[]>;
    private chatCount$: BehaviorSubject<number>;
    private loading = true;
    private pleaseWaitMessage: string;

    constructor(private userService: UserService,
                private chatService: ChatService,
                private loadingController: LoadingController,
                private translateService: TranslateService) {
        this.user$ = this.userService.getUser();
        this.lastMessageFromChats$ = this.chatService.getLastMessageFromChats();
        this.chatCount$ = this.chatService.getChatCount();
    }

    ngOnInit() {
        this.loading = true;
        this.initTranslate();
        this.chatService.getRestChatList().subscribe(() => {
            this.loading = false;
        });
    }

    ionViewWillEnter() {
        this.loading = true;
        this.chatService.getRestChatList().subscribe(() => {
            this.loading = false;
        });
    }

    private initTranslate() {
        this.translateService.get('PLEASE_WAIT_MESSAGE').subscribe((data) => {
            this.pleaseWaitMessage = data;
        });
    }
}
