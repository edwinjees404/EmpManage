import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms'; // Import this module

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule,HomeComponent], // Add ReactiveFormsModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Fix typo from 'styleUrl' to 'styleUrls'
})
export class AppComponent {
  title = 'employeeManagement';
}
