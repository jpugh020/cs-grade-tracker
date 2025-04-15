import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Authentication endpoints
  private readonly AUTH_API = '/api/auth';
  private readonly SKYWARD_AUTH_URL = `${this.AUTH_API}/skyward`;
  private readonly SCHOOLOGY_AUTH_URL = `${this.AUTH_API}/schoology`;

  // Token storage keys
  private readonly TOKEN_KEY = 'cs_grade_tracker_token';
  private readonly REFRESH_TOKEN_KEY = 'cs_grade_tracker_refresh_token';
  private readonly USER_KEY = 'cs_grade_tracker_user';
  
  // BehaviorSubject to track and broadcast authentication state
  private authStateSubject = new BehaviorSubject<User | null>(null);
  
  // Observable that components can subscribe to
  authState$: Observable<User | null> = this.authStateSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
  
  /**
   * Initializes the authentication state from local storage
   */
  checkAuthStatus(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    const token = localStorage.getItem(this.TOKEN_KEY);
    
    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser) as User;
        this.authStateSubject.next(user);
        
        // Verify token validity with server
        this.validateToken().subscribe({
          error: () => this.handleInvalidToken()
        });
      } catch (e) {
        this.handleInvalidToken();
      }
    }
  }
  
  /**
   * Validates the current token with the server
   */
  private validateToken(): Observable<boolean> {
    return this.http.post<{valid: boolean}>(`${this.AUTH_API}/validate`, {}).pipe(
      map(response => response.valid),
      catchError(error => {
        console.error('Token validation error:', error);
        return throwError(() => new Error('Invalid token'));
      })
    );
  }
  
  /**
   * Handles invalid or expired tokens by logging the user out
   */
  private handleInvalidToken(): void {
    this.logout();
    // Optional: Show a notification that session expired
  }
  
  /**
   * Initiates the login process, redirecting to the login page
   */
  login(): void {
    // In a real implementation, this might redirect to an OAuth flow
    // For this example, we'll simulate a login page redirect
    this.router.navigate(['/login']);
  }
  
  /**
   * Authenticates with Skyward using credentials
   * @param username User's Skyward username
   * @param password User's Skyward password
   */
  loginWithSkyward(username: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(this.SKYWARD_AUTH_URL, { username, password }).pipe(
      tap(response => this.handleAuthResponse(response)),
      map(response => response.user),
      catchError(error => {
        console.error('Skyward login error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to login with Skyward'));
      })
    );
  }
  
  /**
   * Authenticates with Schoology using credentials
   * @param username User's Schoology username
   * @param password User's Schoology password
   */
  loginWithSchoology(username: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(this.SCHOOLOGY_AUTH_URL, { username, password }).pipe(
      tap(response => this.handleAuthResponse(response)),
      map(response => response.user),
      catchError(error => {
        console.error('Schoology login error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to login with Schoology'));
      })
    );
  }
  
  /**
   * Handles the successful authentication response
   * @param response The authentication response containing tokens and user data
   */
  private handleAuthResponse(response: AuthResponse): void {
    // Store tokens and user data
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    
    // Update the auth state
    this.authStateSubject.next(response.user);
  }
  
  /**
   * Logs the user out by clearing tokens and state
   */
  logout(): void {
    // Clear local storage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    // Update auth state
    this.authStateSubject.next(null);
    
    // Navigate to home/login
    this.router.navigate(['/login']);
  }
  
  /**
   * Gets the current user
   */
  getCurrentUser(): User | null {
    return this.authStateSubject.value;
  }
  
  /**
   * Checks if the user is currently authenticated
   */
  isAuthenticated(): boolean {
    return !!this.authStateSubject.value && !!localStorage.getItem(this.TOKEN_KEY);
  }
  
  /**
   * Gets the current authentication token for API requests
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  /**
   * Refreshes the authentication token using the refresh token
   */
  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    
    return this.http.post<{token: string, refreshToken: string}>(`${this.AUTH_API}/refresh`, { refreshToken }).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
      }),
      map(response => response.token),
      catchError(error => {
        console.error('Token refresh error:', error);
        this.logout();
        return throwError(() => new Error('Failed to refresh token'));
      })
    );
  }
  
  /**
   * Links a Skyward account to the current user account
   */
  linkSkywardAccount(username: string, password: string): Observable<boolean> {
    return this.http.post<{success: boolean}>(`${this.AUTH_API}/link/skyward`, { username, password }).pipe(
      map(response => response.success),
      catchError(error => {
        console.error('Error linking Skyward account:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to link Skyward account'));
      })
    );
  }
  
  /**
   * Links a Schoology account to the current user account
   */
  linkSchoologyAccount(username: string, password: string): Observable<boolean> {
    return this.http.post<{success: boolean}>(`${this.AUTH_API}/link/schoology`, { username, password }).pipe(
      map(response => response.success),
      catchError(error => {
        console.error('Error linking Schoology account:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to link Schoology account'));
      })
    );
  }
  
  /**
   * Checks if the current user has linked their Skyward account
   */
  hasSkywardLinked(): Observable<boolean> {
    return this.http.get<{linked: boolean}>(`${this.AUTH_API}/status/skyward`).pipe(
      map(response => response.linked),
      catchError(() => of(false))
    );
  }
  
  /**
   * Checks if the current user has linked their Schoology account
   */
  hasSchoologyLinked(): Observable<boolean> {
    return this.http.get<{linked: boolean}>(`${this.AUTH_API}/status/schoology`).pipe(
      map(response => response.linked),
      catchError(() => of(false))
    );
  }
}

/**
 * Interface for authentication responses
 */
interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}