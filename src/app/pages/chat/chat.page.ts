import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Message} from '../../model/message.model';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ChatService} from '../../services/chat.service';
import {UserService} from '../../services/user.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../model/user.model';
import {MessageService} from '../../services/message.service';
import {IonContent, LoadingController} from '@ionic/angular';

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

    constructor(public formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private chatService: ChatService,
                private userService: UserService,
                private messageService: MessageService,
                private loadingController: LoadingController) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.user$ = this.userService.getUser();
            this.messages$ = this.messageService.getBehaviorMessages();
            this.messages$.next([]);
            this.idChat = parseInt(params.get('id'), 0);
            this.chatService.getCurrentChat(this.idChat).subscribe((chat) => {
                this.chtn = chat.chatName;
            });
            console.log(this.idChat);
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
    }

    inviaMessagio() {
        this.chatService.getCurrentChat(this.idChat).subscribe((chat) => {
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
            message: 'Please wait...',
            translucent: true
        });
        return await this.loading.present();
    }

    async disLoading() {
        await this.loading.dismiss();
    }
}
