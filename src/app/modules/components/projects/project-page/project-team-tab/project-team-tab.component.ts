import {
  Component,
  inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Project } from '../../../../../core/models/project/project';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../../core/services/storage.service';
import { ChatService } from '../../../../../core/services/chat.service';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-project-team-tab',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    CommonModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  templateUrl: './project-team-tab.component.html',
  styleUrl: './project-team-tab.component.scss',
})
export class ProjectTeamTabComponent implements OnInit, OnDestroy {
  @Input() project!: Project;
  storageService = inject(StorageService);
  chatService = inject(ChatService);
  users = Array.from({ length: 20 }, (_, i) => ({ name: `User ${i + 1}` }));
  apiErrorMessages: string[] = [];
  newMessage: string = '';

  sendMessage() {
    if (this.newMessage.trim() !== "") {
      this.newMessage =this.newMessage.trim();

      this.chatService.sendMessage(this.newMessage);
    }
  }

  ngOnInit(): void {
    this.chatService
      .registerUser(this.storageService.getUsername() || '')
      .subscribe({
        next: () => {
          console.log('open chat');
        },
        error: (error) => {
          if (typeof error.error !== 'object') {
            this.apiErrorMessages.push(error.error);
          }
        },
      });

    this.chatService.createChatConnection();
  }

  ngOnDestroy(): void {
    this.chatService.stopChatConnection();
  }
}
