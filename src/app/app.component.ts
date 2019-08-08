import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent implements OnInit {

 events: object;
 eventsConfig: EventConfig;
 eventsCounter: number = 0;
 currentEvent: number = 0;
 currentbg: string = "./../assets/quiet.jpg";
 
 constructor( private http: HttpClient)
 {

   
 }

ngOnInit()
{
  this.InitializeScreen();

 }


 showNextEvent()
 {
   if(this.eventsCounter == 0)
   {
      this.currentbg = this.eventsConfig.defaultBg;
   }
   else
   {
     this.currentEvent = (this.currentEvent + 1) % this.eventsCounter;
     this.currentbg = this.events[this.currentEvent].currentTemplate.background
    }
    
  }
  
  getEventsOfTheDay()
  {
    
    this.http.get<object[]>("https://localhost:44340/api/events").subscribe(posts =>{
      this.events = posts;
      this.eventsCounter = posts.length;
      this.showNextEvent();

      
      
    })
  }
  
  getEventConfig()
  {
    
    
    this.http.get<EventConfig>("https://localhost:44340/api/events/eventconfig").subscribe(posts =>{
      this.eventsConfig = posts;
      setInterval(() => this.showNextEvent() , this.eventsConfig.ms);
      
    })
    
  }
  
  InitializeScreen()
  {
    this.getEventConfig()
    
    this.getEventsOfTheDay();
    
    setInterval(() => this.getEventsOfTheDay() , 20000);
    
 }


  
  
 }

 class EventConfig {

   ms : number;
   defaultBg: string;


   constructor(ms : number, defaultBg: string) {
     this.ms = ms;
     this.defaultBg = defaultBg;
   }
 }
