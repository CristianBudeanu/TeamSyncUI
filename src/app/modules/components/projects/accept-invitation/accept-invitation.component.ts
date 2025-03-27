import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { InvitationService } from '../../../../core/services/invitation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-accept-invitation',
  standalone: true,
  imports: [],
  templateUrl: './accept-invitation.component.html',
  styleUrl: './accept-invitation.component.scss'
})
export class AcceptInvitationComponent implements OnInit{
  router = inject(Router);
  route = inject(ActivatedRoute);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  invitationService = inject(InvitationService);

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('invitationToken');

    if (!token) {
      this.snackBar.open('Invalid invitation link', 'Close');
      return;
    }

    if (!this.authService.isLoggedIn()) {
      localStorage.setItem('pendingInvitationToken', token);
      this.router.navigate(['/login']);
      return;
    }

    this.acceptInvitation(token);
  }

  acceptInvitation(token: string) {
    this.invitationService.acceptInvitationLink(token).subscribe({
      next: () => {
        this.snackBar.open('Invitation accepted!', 'Close');
        this.router.navigate(['/projects']);
      },
      error: () => {
        this.snackBar.open('Failed to accept invitation.', 'Close');
      }
    });
  }
}
