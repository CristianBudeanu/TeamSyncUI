import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Project } from '../../../../core/models/project/project';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TaskItemCreateDto } from '../../../../core/models/task';
import { TaskService } from '../../../../core/services/task.service';
import { TaskPriority } from '../../../../core/enums/task.priority';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-task-create-dialog',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    NgFor
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './task-create-dialog.component.html',
  styleUrl: './task-create-dialog.component.scss',
})
export class TaskCreateDialogComponent {
  fb = inject(FormBuilder);
  data = inject(MAT_DIALOG_DATA) as Project;
  private taskService = inject(TaskService);
  dialogRef = inject(MatDialogRef<TaskCreateDialogComponent>);
  priorities = Object.values(TaskPriority);

  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    priority: [TaskPriority.Low, Validators.required],
    assignedTo: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value;

    const taskDto: TaskItemCreateDto = {
      title: formValue.title || '',
      description: formValue.description || '',
      priority: formValue.priority || TaskPriority.Low,
      assignedTo: formValue.assignedTo || '',
      startDate: formValue.startDate || '',
      endDate: formValue.endDate || '',
    };

    this.taskService.createTaskItem(this.data.id, taskDto).subscribe({
      next: () => {
        this.dialogRef.close(true); // optionally pass `true` to indicate success
      },
      error: (err) => {
        console.error('Failed to create task', err);
        // Optionally show an error message here
      },
    });
  }
}
