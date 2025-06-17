import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../models/employee.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent implements OnInit {
  employees: Employee[] = [];
  newEmployee: Employee = {
    id: 0,
    name: '',
    position: '',
    department: ''
  };

  editMode: boolean = false;
  editingEmployeeId: number | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  onSubmit(): void {
    if (this.editMode && this.editingEmployeeId !== null) {
      // Update existing employee
      this.employeeService.updateEmployee(this.editingEmployeeId, this.newEmployee).subscribe(() => {
        this.loadEmployees();
        this.resetForm();
      });
    } else {
      // Add new employee
      this.employeeService.addEmployee(this.newEmployee).subscribe(() => {
        this.loadEmployees();
        this.resetForm();
      });
    }
  }

  editEmployee(employee: Employee): void {
    this.editMode = true;
    this.editingEmployeeId = employee.id;
    this.newEmployee = { ...employee }; // Clone to avoid direct binding
  }

  deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe(() => {
      this.loadEmployees();
    });
  }

  resetForm(): void {
    this.newEmployee = {
      id: 0,
      name: '',
      position: '',
      department: ''
    };
    this.editMode = false;
    this.editingEmployeeId = null;
  }
}
