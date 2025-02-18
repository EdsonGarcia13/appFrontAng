import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/getTasks`;
  private apiUrlC = `${environment.apiUrl}/createTasks`;
  private apiUrlU = `${environment.apiUrl}/updateTasks`;
  private apiUrlD = `${environment.apiUrl}/deleteTasks`;


  constructor(private http: HttpClient) {}

  getTasks(userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?userId=${userId}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrlC, task);
  }

  updateTask(taskId: string, task: Partial<Task>): Observable<void> {
    return this.http.put<void>(`${this.apiUrlU}/${taskId}`, task);
  }

  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlD}/${taskId}`);
  }
}
