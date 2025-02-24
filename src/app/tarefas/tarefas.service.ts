import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type TarefaStatus = 'todo' | 'doing' | 'done';

export interface Tarefa {
  id: number;
  titulo: string;
  descricao?: string;
  status: TarefaStatus;
}

@Injectable({ providedIn: 'root' })
export class TarefasService {
  private tarefasSubject = new BehaviorSubject<Tarefa[]>([]);
  public tarefas$: Observable<Tarefa[]> = this.tarefasSubject.asObservable();

  private nextId = 1;

  constructor() {
    // Inicializa
    const inicial: Tarefa[] = [
      { id: this.nextId++, titulo: 'Reunião de sprint - 9h', status: 'todo' },
      { id: this.nextId++, titulo: 'Correção de bug', status: 'todo' },
      { id: this.nextId++, titulo: 'Revisão de código', status: 'todo' },
    ];
    this.tarefasSubject.next(inicial);
  }

  getTarefasValue(): Tarefa[] {
    return this.tarefasSubject.value;
  }

  adicionar(titulo: string, descricao: string) {
    const atual = this.tarefasSubject.value;
    const novaTarefa: Tarefa = {
      id: this.nextId++,
      titulo,
      descricao,
      status: 'todo',
    };
    this.tarefasSubject.next([...atual, novaTarefa]);
  }

  remover(id: number) {
    const atual = this.tarefasSubject.value;
    this.tarefasSubject.next(atual.filter(t => t.id !== id));
  }

  atualizarStatus(id: number, novoStatus: TarefaStatus) {
    const atualizado = this.tarefasSubject.value.map(t =>
      t.id === id ? { ...t, status: novoStatus } : t
    );
    this.tarefasSubject.next(atualizado);
  }
}
