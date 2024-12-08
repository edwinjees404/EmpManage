import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule,HttpClientModule ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // API URL
  private apiUrl = 'https://dummyjson.com/users';

  // Form and user data
  employeeForm!: FormGroup;
  users: any[] = [];
  filteredUsers: any[] = [];
  isEditMode = false;
  editUserId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.users = []; // Ensure this.users is never undefined
  this.filteredUsers = [];
    // Initialize form
    this.employeeForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z ]*'),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      age: new FormControl('', [
        Validators.required,
        Validators.pattern('\\d*'),
      ]),
      Userstatus: new FormControl('', [Validators.required]), // Ensure casing is consistent

    });

    // Fetch initial users
    this.fetchUsers();
  }

  // Fetch users from API
  fetchUsers() {
    this.getUsers().subscribe((data: any) => {
      console.log('Raw API Response:', data);
      this.users = data?.users || []; // Safely access users
      console.log('Users after assignment:', this.users);
      
      this.filteredUsers = [...this.users];
      console.log('Filtered Users after assignment:', this.filteredUsers);
    }, (error) => {
      console.error('Error fetching users:', error);
    });
    
  }

  // API Methods
  getUsers() {
    return this.http.get(`${this.apiUrl}`);
  }

  addUser(user: any) {
    return this.http.post(`${this.apiUrl}/add`, user);
  }

  updateUser(userId: number, user: any) {
    return this.http.put(`${this.apiUrl}/${userId}`, user);
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  // Form Submit Logic
  onSubmit() {
    const formData = this.employeeForm.value;
  
    if (this.isEditMode && this.editUserId !== null) {
      // Update user locally
      this.updateUser(this.editUserId, formData).subscribe(() => {
        const userIndex = this.users.findIndex((user) => user.id === this.editUserId);
        if (userIndex !== -1) {
          this.users[userIndex] = { id: this.editUserId, ...formData };
        }
        this.filteredUsers = [...this.users];
        this.resetForm();
      });
    } else {
      // Add user locally
      const newUser = { id: Date.now(), ...formData }; // Generate a temporary ID
      this.users.push(newUser);
      this.filteredUsers = [...this.users];
      this.resetForm();
    }
  }
  

  // Edit User
  editUser(user: any) {
    this.isEditMode = true;
    this.editUserId = user.id;

    // Pre-fill form with user data
    this.employeeForm.patchValue({
      username: user.username,
      email: user.email,
      age: user.age,
      Userstatus: user.Userstatus,
    });
  }

  // Delete User
  onDelete(userId: number) {
    this.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter((user) => user.id !== userId);
      this.filteredUsers = [...this.users];
    });
  }
  

  // Filter Users by Status
  filterUsers(status: string) {
    if (status) {
      this.filteredUsers = this.users.filter(
        (user) => user.Userstatus === status
      );
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  // Reset Form
  resetForm() {
    this.isEditMode = false;
    this.editUserId = null;
    this.employeeForm.reset();
  }

  onFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filterUsers(value);
  }
}
