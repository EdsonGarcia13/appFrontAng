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
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
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
  confirmBack() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cerrar Sesión',
        message: '¿Estás seguro de que deseas cerrar la sesión?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logout();
      }
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
