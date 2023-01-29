import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Database, set, ref, update, onValue,remove } from '@angular/fire/database';
import {MatDialogRef} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Habit } from 'src/app/model/habit';
import { DataService } from 'src/app/services/data.service';



@Component({
  selector: 'app-add-habit',
  templateUrl: './add-habit.component.html',
  styleUrls: ['./add-habit.component.css']
})
export class AddHabitComponent implements OnInit {

  addForm = new FormGroup({
    habit: new FormControl('', Validators.required),
    minutes: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    start: new FormControl<Date | null>(null, Validators.required),
    end: new FormControl<Date | null>(null, Validators.required),
  })
  
  constructor(
    private authService: AuthenticationService, 
    private database: Database,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<AddHabitComponent>,
    private data: DataService
    ) {}
    
  ngOnInit(): void {
      
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  user = this.authService.userData
  uid = this.user.uid

  get habit() {
    return this.addForm.get('habit');
  }

  get minutes() {
    return this.addForm.get('minutes');
  }

  get start() {
    return this.addForm.get('start');
  }

  get end() {
    return this.addForm.get('end');
  }

  addHabit (){
    const {habit, minutes, start, end} = this.addForm.value;

    if (!this.addForm.valid || !habit || !minutes || !start || !end){
      return;
    }

    const conv_mins = Number(minutes);

    const habitObj: Habit = {
      id: '',
      minutes: conv_mins, 
      habit: habit,
      start_date: this.datePipe.transform(start, "MM-dd-yyyy"),
      end_date: this.datePipe.transform(end, "MM-dd-yyyy"),
    };

    this.data.addHabit(habitObj);
    
    this.dialogRef.close();
  }

}
