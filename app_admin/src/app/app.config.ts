import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // 1. Crucial update

import { routes } from './app.component.routes'; // or './app.routes' based on your previous rename
import { authInterceptorProvider } from './utils/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    
    // 3. Configure the HTTP Client to support Dependency Injection (DI) Interceptors
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    
    // 4. Register the custom bearer token interceptor provider
    authInterceptorProvider
  ]
};

