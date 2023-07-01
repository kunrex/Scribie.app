import { Injectable } from "@angular/core";

@Injectable()
export class Stopwatch {
  private hours: number = 0;
  private minutes: number = 0;
  private seconds: number = 0;

  private started: boolean = false; 

  Duration() : string {
	return (this.hours.toString().padStart(2, '0')) + ":" + (this.minutes.toString().padStart(2, '0')) + ":" + (this.seconds.toString().padStart(2, '0'));
  }

  constructor() { }

  startStopwatch() : void {
	this.clear();

	this.started = true;
	this.interate();
  }

  stopStopwatch() : void {
	this.started = false;
  }

  clear() : void {
	this.hours = this.minutes = this.seconds = 0;
  }

  private interate() {
	if(!this.started) {
	  return;
	}

	this.seconds += 1;

	if(this.seconds == 60) {
	  this.seconds = 0;
	  this.minutes += 1;
	}

	if(this.minutes == 60) {
	  this.minutes = 0;
	  this.hours += 1;
	}

	setTimeout(() => {
	  this.interate()
	}, 1000);
  }
}