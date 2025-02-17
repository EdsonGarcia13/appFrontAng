import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UserService } from '../../core/services/user.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component.ts.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <mat-card class="p-6 w-full max-w-md">
        <mat-card-header>
          <mat-card-title>Iniciar Sesión</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-4">
            <mat-form-field class="w-full">
              <mat-label>Correo electrónico</mat-label>
              <input matInput type="email" formControlName="email" required>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit"
                    [disabled]="!loginForm.valid" class="w-full mt-4">
              Ingresar
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;

      this.userService.getUser(email).subscribe({
        next: (user) => {
          localStorage.setItem('userId', user.id!);
          localStorage.setItem('userEmail', user.email);
          this.router.navigate(['/tasks']);
        },
        error: () => {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Usuario no encontrado',
              message: '¿Deseas crear una nueva cuenta con este correo?'
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.userService.createUser(email).subscribe(newUser => {
                localStorage.setItem('userId', newUser.id!);
                localStorage.setItem('userEmail', newUser.email);
                this.router.navigate(['/tasks']);
              });
            }
          });
        }
      });
    }
  }
}
