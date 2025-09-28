import { Component, inject, signal } from '@angular/core';
import { LoginService } from './login.service';

import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private service = inject(LoginService);
  private fb = inject(FormBuilder);

  // Mode: 'login' or 'register'
  mode = signal<'login' | 'register'>('login');
  submitting = signal(false);
  error = signal<string | null>(null);
  initializing = this.service.initializing;

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  member = this.service.member;

  switchMode() {
    this.error.set(null);
    this.mode.set(this.mode() === 'login' ? 'register' : 'login');
  }

  async submit() {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);
    const { username, password } = this.form.getRawValue();
    try {
      const result =
        this.mode() === 'login'
          ? await this.service.loginWithPassword(username, password)
          : await this.service.register(username, password);
      if ('error' in result) this.error.set(result.error);
      if ('ok' in result) {
        this.form.reset();
      }
    } catch (e: any) {
      this.error.set(e?.message || 'Unexpected error');
    } finally {
      this.submitting.set(false);
    }
  }

  logout() {
    this.service.logout();
  }
}
