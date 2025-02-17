import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/models/task.model';
import { TaskFormComponent } from '../../shared/components/task-form/task-form.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component.ts.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  template: `
    <div class="container mx-auto p-4">
      <mat-toolbar color="primary">
        <span>Mis Tareas</span>
        <span class="flex-1"></span>
        <button mat-icon-button (click)="logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <div class="mt-4">
        <button mat-raised-button color="primary" (click)="openTaskForm()">
          Nueva Tarea
        </button>
      </div>

      <div class="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <mat-card *ngFor="let task of tasks">
          <mat-card-header>
            <mat-card-title>{{ task.title }}</mat-card-title>
            <mat-card-subtitle>
              {{ task.createdAt | date:'medium' }}
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <p>{{ task.description }}</p>
          </mat-card-content>

          <mat-card-actions>
            <mat-checkbox
              [checked]="task.completed"
              (change)="toggleTaskStatus(task)">
              Completada
            </mat-checkbox>

            <button mat-icon-button (click)="openTaskForm(task)">
              <mat-icon>edit</mat-icon>
            </button>

            <button mat-icon-button color="warn" (click)="deleteTask(task)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  userId = localStorage.getItem('userId')!;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks(this.userId).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  openTaskForm(task?: Task) {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (task) {
          this.taskService.updateTask(task.id!, result).subscribe(() => {
            this.loadTasks();
          });
        } else {
          const newTask: Task = {
            ...result,
            userId: this.userId,
            completed: false,
            createdAt: new Date()
          };
          this.taskService.createTask(newTask).subscribe(() => {
            this.loadTasks();
          });
        }
      }
    });
  }

  toggleTaskStatus(task: Task) {
    this.taskService.updateTask(task.id!, {
      completed: !task.completed
    }).subscribe(() => {
      this.loadTasks();
    });
  }

  deleteTask(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Tarea',
        message: '¿Estás seguro de que deseas eliminar esta tarea?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(task.id!).subscribe(() => {
          this.loadTasks();
        });
      }
    });
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }
}
