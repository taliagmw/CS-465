import { Component, OnInit, Input } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
import { Trip } from '../models/trip'; 
import { AuthenticationService } from '../services/authentication'; 

@Component({ 
  selector: 'app-trip-card', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './trip-card.component.html', 
  styleUrl: './trip-card.component.css' 
}) 
export class TripCardComponent implements OnInit { 

  @Input() trip: any; 

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService 
  ) {} 

  ngOnInit(): void { 
  } 

  public editTrip(trip: Trip) { 
    if (typeof window !== 'undefined' && window.localStorage){ 
      localStorage.removeItem('tripCode'); 
      localStorage.setItem('tripCode', trip.code); 
    } else { 
      console.warn('LocalStorage is unavailable in this environment.'); 
    } 
    this.router.navigate(['edit-trip']); 
  } 

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
}

