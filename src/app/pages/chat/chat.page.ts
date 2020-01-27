import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Message} from '../../model/message.model';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ChatService} from '../../services/chat.service';
import {UserService} from '../../services/user.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../model/user.model';
import {MessageService} from '../../services/message.service';
import {IonContent, LoadingController} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {CreateService} from '../../services/create.service';
import {CreatesChat} from '../../model/creates.model';

@Component({
    selector: 'page-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
    // @ts-ignore
    @ViewChild(IonContent) content: IonContent;
    private chtn = 'Chat';
    private sendStatus = '';
    private isStardted = false;
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
                private createService: CreateService,
                private userService: UserService,
                private messageService: MessageService,
                private loadingController: LoadingController,
                public translateService: TranslateService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.user$ = this.userService.getUser();
            this.messages$ = this.messageService.getBehaviorMessages();
            this.messages$.next([]);
            this.idChat = parseInt(params.get('id'), 0);
            console.log(this.idChat);
            this.createService.getListCreates(this.user$.value.idUser).subscribe((creates) => {
                console.log(creates);
                const c = creates.find(x => x.chat.idChat === this.idChat);
                const usr2 = c.userListser.find(x => x.idUser !== this.user$.value.idUser);
                this.chtn = usr2.name + ' ' + usr2.surname;
                console.log(this.chtn);
            });
            this.scritturaMessaggio = this.formBuilder.group({
                text: ['', Validators.required]
            });
            this.messageService.ifEmpty(this.idChat).subscribe((condition) => {
                this.loadingPresent().then(() => {
                    console.log(condition);
                    if (condition) {
                        console.log('è vuoto');
                        this.messageService.getRestMessageOfChat(this.idChat).subscribe((messages) => {
                            console.log(messages);
                            this.disLoading();
                        });
                        this.messages$.subscribe((value) => {
                            if (value[value.length - 1] !== undefined) {
                                if (!this.isStardted) {
                                    // tslint:disable-next-line:max-line-length
                                    this.messageService.startPeriodicGetMessageForChat(this.idChat);
                                    this.isStardted = true;
                                }
                            }
                        });
                    } else {
                        console.log('esiste');
                        this.messageService.getStorageMessagesOfChat(this.idChat);
                        this.messageService.getCountMessageFromStorage(this.idChat).subscribe((countMessageStorage) => {
                            this.messageService.getRestCountMessage(this.idChat).subscribe((countMessageRest) => {
                                if (countMessageStorage < countMessageRest) {
                                    console.log('inferiore storage' + countMessageStorage.toString() + ' ' + countMessageRest.toString());
                                    // tslint:disable-next-line:max-line-length
                                    this.messageService.getLastMessageOfChat(this.idChat, this.messages$.value[this.messages$.value.length - 1].idMessage).subscribe((newmessages) => {
                                        console.log(newmessages);
                                    });
                                    this.messages$ = this.messageService.getBehaviorMessages();
                                    if (!this.isStardted) {
                                        // tslint:disable-next-line:max-line-length
                                        this.messageService.startPeriodicGetMessageForChat(this.idChat);
                                        this.isStardted = true;
                                    }
                                } else {
                                    console.log('uguale storage' + countMessageStorage.toString() + ' ' + countMessageRest.toString());
                                    if (!this.isStardted) {
                                        // tslint:disable-next-line:max-line-length
                                        this.messageService.startPeriodicGetMessageForChat(this.idChat);
                                        this.isStardted = true;
                                    }
                                }
                            });
                        });
                        this.disLoading();
                    }
                });
            });
        });
        this.initTranslate();
    }

    inviaMessagio() {
        this.chatService.getCurrentChat(this.idChat).subscribe((chat) => {
            if (chat) {
                this.sendStatus = 'pending';
                this.messaggio = new Message(undefined, undefined, undefined);
                this.messaggio.text = this.scritturaMessaggio.controls.text.value;
                this.scritturaMessaggio.reset();
                this.messaggio.chat = chat;
                this.messaggio.user = this.user$.value;
                console.log(this.messaggio);
                this.messageService.createRestMessage(this.messaggio).subscribe((data) => {
                    console.log(data);
                    // tslint:disable-next-line:max-line-length
                    this.messageService.getLastMessageOfChat(this.idChat, this.messages$.value[this.messages$.value.length - 1].idMessage).subscribe(() => this.sendStatus = '');
                });
            } else {
                this.chatService.getRestChatList().subscribe((resp) => {
                    console.log(resp);
                    const creates: CreatesChat[] = resp[1];
                    console.log(creates);
                    console.log(this.idChat);
                    const newChat = creates.find(x => x.chat.idChat === this.idChat).chat;
                    this.sendStatus = 'pending';
                    this.messaggio = new Message(undefined, undefined, undefined);
                    this.messaggio.text = this.scritturaMessaggio.controls.text.value;
                    this.scritturaMessaggio.reset();
                    this.messaggio.chat = newChat;
                    this.messaggio.user = this.user$.value;
                    console.log(this.messaggio);
                    this.messageService.createRestMessage(this.messaggio).subscribe((data) => {
                        console.log(data);
                        // tslint:disable-next-line:max-line-length
                        this.messageService.getLastMessageOfChat(this.idChat, this.messages$.value[this.messages$.value.length - 1].idMessage).subscribe(() => this.sendStatus = '');
                    });
                });
            }
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
