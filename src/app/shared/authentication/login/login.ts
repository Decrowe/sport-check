import { Component, inject } from '@angular/core';
import { LoginService } from './login.service';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private service = inject(LoginService);
  name: string = this.service.user()?.name ?? '';

  onLogin() {
    if (this.name.trim()) {
      this.service.login({ name: this.name.trim() });
    }
  }
}
