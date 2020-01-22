import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ChatService} from '../../services/chat.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../model/user.model';
import {CreatesChat} from '../../model/creates.model';
import {Message} from '../../model/message.model';
import {LoadingController} from '@ionic/angular';

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
    private agg = true;

    constructor(private userService: UserService,
                private chatService: ChatService,
                private loadingController: LoadingController) {
        this.user$ = this.userService.getUser();
        this.lastMessageFromChats$ = this.chatService.getLastMessageFromChats();
        this.creates$ = this.chatService.getCreates();
        this.chatCount$ = this.chatService.getChatCount();
    }

    ngOnInit() {
        this.chatService.getRestCountChat().subscribe((n: number) => {
            console.log('eseguo rest count chat');
            console.log(n);
            if (n !== 0) {
                this.chatService.countFromStorage().then((numb: number) => {
                    console.log('numero sullo storage è');
                    console.log(numb);
                    if (numb < n) {
                        this.chatService.getRestChatList().subscribe((chat) => {
                            console.log('eseguo rest lista chat');
                            console.log(chat);
                        });
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
            message: 'Please wait...',
            translucent: true
        });
        return await this.loading.present();
    }

    async disLoading() {
        await this.loading.dismiss();
    }

}
