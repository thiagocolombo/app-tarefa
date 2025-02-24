import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

// angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

// cdk
import { DragDropModule, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

import { TarefasService, Tarefa } from './tarefas.service';
import { Observable } from 'rxjs';

// pdfmake
import pdfMake from './pdfmake-setup';

@Component({
  selector: 'app-tarefas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    DragDropModule
  ],
  templateUrl: './tarefas.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TarefasComponent implements OnInit {
  // observável da lista de tarefas
  tarefas$!: Observable<Tarefa[]>;

  // arrays para as colunas
  tarefasTodo: Tarefa[] = [];
  tarefasDoing: Tarefa[] = [];
  tarefasDone: Tarefa[] = [];

  // form 
  formNovaTarefa = new FormGroup({
    titulo: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    descricao: new FormControl<string>('')
  });

  constructor(private tarefasService: TarefasService) {}

  ngOnInit(): void {
    // subscrição ao BehaviorSubject
    // para atualização imediata dos status
    this.tarefas$ = this.tarefasService.tarefas$;
    this.tarefas$.subscribe(tarefas => {
      this.tarefasTodo = tarefas.filter(t => t.status === 'todo');
      this.tarefasDoing = tarefas.filter(t => t.status === 'doing');
      this.tarefasDone = tarefas.filter(t => t.status === 'done');
    });
  }

  adicionarTarefa() {
    if (this.formNovaTarefa.valid) {
      const { titulo, descricao } = this.formNovaTarefa.value;
      this.tarefasService.adicionar(titulo || '', descricao || '');
      this.formNovaTarefa.reset();
    }
  }

  removerTarefa(tarefa: Tarefa) {
    this.tarefasService.remover(tarefa.id);
  }

  drop(event: CdkDragDrop<Tarefa[]>) {
    if (event.previousContainer !== event.container) {
      const item = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // ajusta status
      const novoStatus = this.mapStatus(event.container.id);
      if (novoStatus) {
        this.tarefasService.atualizarStatus(item.id, novoStatus);
      }
    }
  }

  // mapeia container ID
  mapStatus(id: string): 'todo' | 'doing' | 'done' | null {
    switch (id) {
      case 'todo-list': return 'todo';
      case 'doing-list': return 'doing';
      case 'done-list': return 'done';
    }
    return null;
  }

  // exportar pdf
  exportarPdf() {
    const tarefas = this.tarefasService.getTarefasValue();
    const docDefinition = {
      content: [
        { text: 'Lista de Tarefas', style: 'header' },
        {
          ul: tarefas.map(t => {
            let linha = `${t.titulo} [${t.status}]`;
            if (t.descricao) {
              linha += `\nDescrição: ${t.descricao}`;
            }
            return linha;
          })
        }
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 10] as [number, number, number, number]
        }
      }
    };
    pdfMake.createPdf(docDefinition).download('tarefas.pdf');
  }
}
