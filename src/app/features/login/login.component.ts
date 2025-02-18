import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    MatDialogModule,
    MatCheckboxModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    @Inject(UserService) private userService: UserService
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
          console.log(user);
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
