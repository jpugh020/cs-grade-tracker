import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: `./app.component.html`,
   styleUrls: [`./app.component.less`], 
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  currentUser: { name: string; profilePicture?: string } | null = null;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    // Subscribe to authentication state changes
    this.authService.authState$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });
    
    // Check if user is already logged in
    this.authService.checkAuthStatus();
  }
  
  login() {
    this.authService.login();
  }
  
  logout() {
    this.authService.logout();
  }
  
  getUserInitials(): string {
    if (!this.currentUser?.name) return '';
    
    const nameParts = this.currentUser.name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  }
}