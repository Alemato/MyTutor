import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {SuperTabsModule} from '@ionic-super-tabs/angular';
import {LoginGuard} from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadChildren: './pages/chat/chat.module#ChatPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'chatrest',
    loadChildren: './pages/chatrest/chatrest.module#ChatrestPageModule'
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule',
    canActivate: [LoginGuard]
  },

  {
    path: 'registrazione',
    loadChildren: './pages/registrazione/registrazione.module#RegistrazionePageModule',
  },
  // tslint:disable-next-line:max-line-length
  { path: 'registrazione-docente-modal', loadChildren: './pages/registrazione-docente-modal/registrazione-docente-modal.module#RegistrazioneDocenteModalPageModule' },
  // tslint:disable-next-line:max-line-length
  { path: 'profilo-modifica', loadChildren: () => import('./pages/profilo-modifica-profilo/profilo-modifica-profilo.module').then(m => m.ProfiloModificaProfiloPageModule) },
  { path: 'inserimento-lezioni', loadChildren: './pages/inserimento-lezioni/inserimento-lezioni.module#InserimentoLezioniPageModule' },
    // tslint:disable-next-line:max-line-length
  { path: 'inserimento-lezioni-modal', loadChildren: './pages/inserimento-lezioni-modal/inserimento-lezioni-modal.module#InserimentoLezioniModalPageModule' },
  { path: 'lista-chat', loadChildren: './pages/lista-chat/lista-chat.module#ListaChatPageModule' },
  { path: 'ricerca-lezioni', loadChildren: './pages/ricerca-lezioni/ricerca-lezioni.module#RicercaLezioniPageModule' },
  { path: 'risultati-ricerca', loadChildren: './pages/risultati-ricerca/risultati-ricerca.module#RisultatiRicercaPageModule' },
  { path: 'storico-lezioni', loadChildren: './pages/storico-lezioni/storico-lezioni.module#StoricoLezioniPageModule' },





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    SuperTabsModule.forRoot()
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
