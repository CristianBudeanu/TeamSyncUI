import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { TaskItemCreateDto, TaskItemDto } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private taskController = environment.apiUrl + '/task';
  constructor() {}

  createTaskItem(projectId: string, dto: TaskItemCreateDto) {
    return this.http.post(`${this.taskController}/CreateTaskItem/${projectId}`, dto);
  }

  updateTaskItemStatus(taskItemId: string, taksItemStatus: string){
    const url = `${this.taskController}/UpdateTaskItemStatus?taskItemId=${taskItemId}&taskItemStatus=${taksItemStatus}`;
    return this.http.post<void>(url, {});
  }

  getAllUserTasks(){
    return this.http.get<TaskItemDto[]>(`${this.taskController}/GetAllUserTasks`);
  }
}
