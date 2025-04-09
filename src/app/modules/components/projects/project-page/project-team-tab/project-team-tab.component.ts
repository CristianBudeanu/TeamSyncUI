import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Project } from '../../../../../core/models/project/project';
import { ChatService } from '../../../../../core/services/chat.service';
import { StorageService } from '../../../../../core/services/storage.service';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CustomIconComponent } from '../../../../shared/custom-icon/custom-icon.component';
import { MatSidenavModule } from '@angular/material/sidenav';

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
    CustomIconComponent,
    MatSidenavModule
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
export class ProjectTeamTabComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  username = '';
  showFiller = false;
  isUserListOpen = false;
  newMessage: string = '';
  @Input() project!: Project;
  apiErrorMessages: string[] = [];
  chatService = inject(ChatService);
  storageService = inject(StorageService);
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;

  ngOnInit(): void {
    this.username = this.storageService.getUsername() || '';
    const projectId = this.project.id;

    this.chatService.registerUser(this.username).subscribe({
      next: () => {
        // 1. Load existing chat history
        this.chatService.loadMessageHistory(projectId).subscribe({
          next: (messages) => {
            this.chatService.setMessagesForProject(projectId, messages);
            this.scrollToBottom();
            // 2. Then connect to SignalR
            this.chatService.createChatConnection(projectId);
          },
          error: (err) => {
            console.error('Failed to load messages:', err);
          },
        });
      },
      error: (err) => {
        if (typeof err.error !== 'object') {
          this.apiErrorMessages.push(err.error);
        }
      },
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage.trim());
      this.newMessage = '';
    }
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  toggleUserList() {
    this.isUserListOpen = !this.isUserListOpen;
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.chatService.stopChatConnection();
  }
}
