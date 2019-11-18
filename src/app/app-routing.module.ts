import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule',
    // canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadChildren: './pages/chat/chat.module#ChatPageModule',
    // canActivate: [AuthGuard]
  },
  {
    path: 'chatrest',
    loadChildren: './pages/chatrest/chatrest.module#ChatrestPageModule'
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule'
  },

  {
    path: 'registrazione',
    loadChildren: './pages/registrazione/registrazione.module#RegistrazionePageModule',
    //  canActivate: [AuthGuard]
  }
 // { path: 'prova', loadChildren: './pages/prova/prova.module#ProvaPageModule' },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
