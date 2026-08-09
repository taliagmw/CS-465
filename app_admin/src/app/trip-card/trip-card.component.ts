import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.component.html', // Added .component
  styleUrl: './trip-card.component.css'     // Added .component
})
export class TripCardComponent implements OnInit {
    @Input() trip: any;

    constructor(private router: Router) {}


    ngOnInit(): void {

    }
    public editTrip(trip: Trip) {
      if (typeof window !== 'undefined' && window.localStorage){
        localStorage.removeItem('tripCode');
      localStorage.setItem('tripCode', trip.code);
      }else {
        console.warn('LocalStorage is unavailable in this environment.');
      }
      
      this.router.navigate(['edit-trip']);
    }
}