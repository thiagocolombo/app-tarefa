import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Route } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';

const routes: Route[] = [
  {
    path: '',
    redirectTo: 'tarefas', 
    pathMatch: 'full'
  },
  {
    path: 'tarefas',
    loadComponent: () =>
      import('./app/tarefas/tarefas.components').then(m => m.TarefasComponent)
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
  ],
})
.catch(err => console.error(err));
