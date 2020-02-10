import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {SuperTabsModule} from '@ionic-super-tabs/angular';
import {LoginGuard} from './guards/login.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: './pages/login/login.module#LoginPageModule',
        canActivate: [LoginGuard]
    },
    {
        path: 'home-home',
        loadChildren: './pages/home-home/home.module#HomePageModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'chat/:id',
        loadChildren: './pages/chat/chat.module#ChatPageModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'registrazione',
        loadChildren: './pages/registrazione/registrazione.module#RegistrazionePageModule'
    },
    {
        path: 'registrazione-docente-modal',
        loadChildren: './pages/registrazione-docente-modal/registrazione-docente-modal.module#RegistrazioneDocenteModalPageModule'
    },
    {
        path: 'profilo',
        loadChildren: './pages/profilo-modifica-profilo/profilo-modifica-profilo.module#ProfiloModificaProfiloPageModule',
        canActivate: [AuthGuard]
    },
    /*{
        path: 'inserimento-lezioni/:idLesson',
        loadChildren: './pages/inserimento-lezioni/inserimento-lezioni.module#InserimentoLezioniPageModule',
        canActivate: [AuthGuard]
    },*/
    // tslint:disable-next-line:max-line-length
    {
        path: 'inserimento-lezioni-modal',
        loadChildren: './pages/inserimento-lezioni-modal/inserimento-lezioni-modal.module#InserimentoLezioniModalPageModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'lista-chat',
        loadChildren: './pages/lista-chat/lista-chat.module#ListaChatPageModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'ricerca-lezioni-old',
        loadChildren: './pages/ricerca-lezioni-old/ricerca-lezioni.module#RicercaLezioniPageModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'risultati-ricerca',
        loadChildren: './pages/risultati-ricerca/risultati-ricerca.module#RisultatiRicercaPageModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'storico-lezioni',
        loadChildren: './pages/storico-lezioni/storico-lezioni.module#StoricoLezioniPageModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'lezione/:prov/:id',
        loadChildren: './pages/lezione/lezione.module#LezionePageModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'profilo-singolo/:email',
        loadChildren: './pages/profilo-singolo/profilo-singolo.module#ProfiloSingoloPageModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'lista-annunci-publicati',
        loadChildren: './pages/lista-annunci-publicati/lista-annunci-publicati.module#ListaAnnunciPublicatiPageModule',
        canActivate: [AuthGuard]
    },
    /*{
        path: 'inserimento-lezioni',
        redirectTo: 'inserimento-lezioni/null'
    },*/
    { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
        SuperTabsModule.forRoot()
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

