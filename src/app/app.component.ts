import { Component } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar color="primary" class="flex justify-between bg-[#10b981] text-white">
      <span class="font-semibold">App de Tarefas Pessoal</span>
    </mat-toolbar>

    <div class="p-4">
      <!-- Onde as rotas filhas são exibidas -->
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
}
