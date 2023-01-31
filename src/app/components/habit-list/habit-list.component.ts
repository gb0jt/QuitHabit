import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Database, set, ref, update, onValue, remove } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AddHabitComponent } from '../add-habit/add-habit.component';
import { DataService } from 'src/app/services/data.service';
import { Habit } from 'src/app/model/habit';
import { HotToastModule, HotToastService } from '@ngneat/hot-toast';
import { DatePipe } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';


@Component({
  selector: 'app-habit-list',
  templateUrl: './habit-list.component.html',
  styleUrls: ['./habit-list.component.css']
})
export class HabitListComponent implements OnInit{
 
  user = this.authService.userData.uid;

  habitList : Habit[] = [];

  math = Math;

  dateNow = new Date();
  

  constructor(
    private authService: AuthenticationService, 
    private dialog: MatDialog, 
    private data: DataService,
    private toast: HotToastService,
    private datePipe: DatePipe,) {

  }

  openAddDialog(){
    const dialogRef = this.dialog.open(AddHabitComponent, {
      height: '38%',
      width: '55%'
    });
  }

  ngOnInit(): void {
    this.getAllHabits();
  }

  AbstinenceTime(habit : Habit) {
    const sDate = new Date(habit.convertedDate);
    const now = new Date();

    const Time = sDate.getTime() - now.getTime();
    const absDay = Time / (1000 * 3600 * 24);
    
    return this.math.abs(this.math.trunc(absDay));
  }

  getAllHabits() {
    this.data.getHabits().subscribe(res => {
      this.habitList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      });

    }, err => {
      this.toast.observe({
        error: ({message}) => 'There was an error: ${message}'
      })
    });
  }

  deleteHabit(habit : Habit){
    this.data.deleteHabit(habit);
  }

  resetHabit(habit: Habit){
    this.data.resetDate(habit);
  }

}
