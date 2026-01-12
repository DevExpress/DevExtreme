import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

interface TokenData {
  headerName: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AntiForgeryTokenService {
  private BASE_PATH = 'http://localhost:5555';
  // private BASE_PATH = 'https://js.devexpress.com/Demos/NetCore';

  private tokenCache$: Observable<TokenData> | null = null;

  constructor(private http: HttpClient) {}

  getToken(): Observable<TokenData> {
    const tokenMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
    if (tokenMeta) {
      const headerName = tokenMeta.dataset.headerName || 'RequestVerificationToken';
      const token = tokenMeta.getAttribute('content') || '';
      return of({ headerName, token });
    }

    if (!this.tokenCache$) {
      this.tokenCache$ = this.fetchToken().pipe(
        map((tokenData) => {
          this.storeTokenInMeta(tokenData);
          return tokenData;
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
        catchError((error) => {
          this.tokenCache$ = null;
          return throwError(() => error);
        }),
      );
    }

    return this.tokenCache$;
  }

  private fetchToken(): Observable<TokenData> {
    return this.http.get<TokenData>(
      `${this.BASE_PATH}/api/Common/GetAntiForgeryToken`,
      {
        withCredentials: true,
      },
    ).pipe(
      catchError((error) => {
        const errorMessage = typeof error.error === 'string' ? error.error : (error.statusText || 'Unknown error');
        return throwError(() => new Error(`Failed to retrieve anti-forgery token: ${errorMessage}`));
      }),
    );
  }

  private storeTokenInMeta(tokenData: TokenData): void {
    const meta = document.createElement('meta');
    meta.name = 'csrf-token';
    meta.content = tokenData.token;
    meta.dataset.headerName = tokenData.headerName;
    document.head.appendChild(meta);
  }

  clearToken(): void {
    this.tokenCache$ = null;
    const tokenMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
    if (tokenMeta) {
      tokenMeta.remove();
    }
  }
}
