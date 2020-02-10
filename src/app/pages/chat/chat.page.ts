import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Message} from '../../model/message.model';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ChatService} from '../../services/chat.service';
import {UserService} from '../../services/user.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../model/user.model';
import {MessageService} from '../../services/message.service';
import {IonContent, LoadingController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'page-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
    @ViewChild(IonContent, {static: true}) content: IonContent;
    private chtn = 'Chat';
    private sendStatus = '';
    private scritturaMessaggio: FormGroup;
    private messaggio: Message;
    private idChat: number;
    private loading;
    private user$: BehaviorSubject<User>;
    private messages$: BehaviorSubject<Message[]>;
    private pleaseWaitMessage: string;

    constructor(public formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private chatService: ChatService,
                private userService: UserService,
                private messageService: MessageService,
                private loadingController: LoadingController,
                public translateService: TranslateService) {
    }

    ngOnInit() {
        this.initTranslate();
        this.scritturaMessaggio = this.formBuilder.group({
            text: ['', Validators.required]
        });
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.idChat = parseInt(params.get('id'), 0);
            this.user$ = this.userService.getUser();
            this.messages$ = this.messageService.getBehaviorMessages(this.idChat);
            this.messageService.startPeriodicGetMessageForChat(this.idChat);
        });
    }

    inviaMessagio() {
        this.sendStatus = 'pending';
        this.messaggio = new Message();
        this.messaggio.idMessage = 0;
        this.messaggio.text = this.scritturaMessaggio.controls.text.value;
        this.scritturaMessaggio.reset();
        this.messaggio.sendDate = new Date().getTime();
        this.messaggio.chat = this.messages$.value[0].chat;
        this.messaggio.user = this.user$.value;
        this.messageService.createRestMessage(this.messaggio).subscribe(() => {
            // tslint:disable-next-line:max-line-length
            this.messageService.getLastMessageOfChat(this.idChat, this.messages$.value[this.messages$.value.length - 1].idMessage).subscribe(() => {
                this.sendStatus = '';
            });
        });
    }

    scrolla() {
        this.content.scrollToBottom();
    }

    ionViewDidLeave() {
        console.log('ionViewDidLeave chat');
        this.messageService.stopPeriodicGetMessageForChat();
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
