import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner';

@Component({
  selector: 'app-spinner',
  imports: [CommonModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
})
export class Spinner {
  constructor(
    public spinnerService: SpinnerService
  ) {}

}
