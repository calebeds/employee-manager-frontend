import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from './interfaces/employee';
import { EmployeeService } from './services/employee/employee.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public employees: Employee[] = [];
  public allEmployees: Employee[] = [];
  public selectedEmployee: Employee = {} as Employee;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService
      .getEmployees()
      .pipe()
      .subscribe(
        (response: Employee[]) => {
          this.employees = response;
          this.allEmployees = response;
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        }
      );
  }

  public onOpenModal(mode: string, employee: Employee = {} as Employee): void {
    this.selectedEmployee = employee;
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', `#${mode}EmployeeModal`);
    container?.appendChild(button);
    button.click();
    button.remove();
  }

  public onAddEmployee(addForm: NgForm): void {
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        document.getElementById('add-employee-form')?.click(); //Click to close the modal
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
  }

  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (res: void) => {
        console.log(res);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
  }

  public searchEmployees(key: string): void {
    this.employees = this.allEmployees;

    this.employees = [...this.employees].filter((employee) => {
      const matchEmployeeName =
        employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1;
      const matchEmployeeEmail =
        employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1;
      const matchEmployeePhone =
        employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1;
      const matchEmployeeJobTitle =
        employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1;

      return (
        matchEmployeeName ||
        matchEmployeeEmail ||
        matchEmployeePhone ||
        matchEmployeeJobTitle
      );
    });

    if (!key || key === '') this.getEmployees();
  }
}
