import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
    selector: 'app-create-project-form',
    imports: [
        ReactiveFormsModule,
        MatInputModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
    ],
    providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'outline' },
        },
    ],
    templateUrl: './create-project-form.component.html',
    styleUrl: './create-project-form.component.scss'
})
export class CreateProjectFormComponent implements OnInit {
  private _bottomSheetRef =
    inject<MatBottomSheetRef<CreateProjectFormComponent>>(MatBottomSheetRef);
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  projectForm!: FormGroup;

  selectedFile: File | null = null;
  fileStatusMessage: string = 'Not selected file';

  ngOnInit() {
    // Initialize the form
    this.projectForm = this.fb.group({
      projectImage: [''],
      projectName: ['', Validators.required],
      projectDescription: ['', Validators.required],
      projectCategory: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(event.target.files[0]);

    if (this.selectedFile) {
      this.fileStatusMessage = this.selectedFile.name;
      this.handleFile(this.selectedFile);
    } else {
      this.fileStatusMessage = 'Not selected file';
    }
  }

  handleFile(file: File): void {
    const imageControl = this.projectForm.get('projectImage');
    if (imageControl) {
      imageControl.patchValue(file);
      imageControl.updateValueAndValidity();
    }
  }

  submitForm() {
    const formData = new FormData();

    const image = this.projectForm.get('projectImage')?.value;
    console.log(image);

    if (image) {
      formData.append('image', image, image.name);
    }
    const projectName = this.projectForm.get('projectName')?.value;
    console.log(projectName);

    formData.append('name', projectName);
    const projectCategory = this.projectForm.get('projectCategory')?.value;
    formData.append('category', projectCategory);
    const projectDescription =
      this.projectForm.get('projectDescription')?.value;
    formData.append('description', projectDescription);

    this.projectService.newProject(formData).subscribe(
      (response) => {
        console.log('Upload successful', response);
        this.projectForm.reset();
        this.selectedFile = null;
      },
      (error) => {
        console.error('Upload failed', error);
      }
    );
  }
}
