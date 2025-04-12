import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CustomIconComponent } from '../../shared/custom-icon/custom-icon.component';
import { ChatService } from '../../../core/services/chat.service';
import { StorageService } from '../../../core/services/storage.service';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project/project';

@Component({
  selector: 'app-chat',
  standalone: true,
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
    MatSidenavModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  chatService = inject(ChatService);
  isUserListOpen = true;
  username = '';
  storageService = inject(StorageService);
  projectService = inject(ProjectService);
  projects: Project[] = [];
  newMessage: string = '';
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;
  @ViewChild('drawer') drawer!: any;

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((projectsResult) => {
      this.projects = projectsResult;
      console.log(this.projects);
    });

    this.username = this.storageService.getUsername() || '';
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage.trim());
      this.newMessage = '';
      // this.scrollToBottom();
    }
  }

  getProjectImage(imagePath: string | null): string {
    if (!imagePath) {
      return 'assets/noImage.jpg';
    }

    return 'https://localhost:7263/Projects/' + imagePath;
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/noImage.jpg';
  }

  selectedProjectId: string = '';
  selectedProjectName: string = '';

  selectProject(project: Project) {
    if (this.selectedProjectId === project.id) return;

    // Stop current connection if exists
    this.chatService.stopChatConnection();

    this.selectedProjectName = project.name;

    // Load history and switch project
    this.chatService.loadMessageHistory(project.id).subscribe((messages) => {
      this.chatService.setMessagesForProject(project.id, messages);

      // Create new connection
      this.chatService.createChatConnection(project.id);
      

      // Update selected project
      this.selectedProjectId = project.id;

      this.drawer.close();
    });

    
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  ngOnDestroy(): void {
    this.chatService.stopChatConnection();
  }
}
