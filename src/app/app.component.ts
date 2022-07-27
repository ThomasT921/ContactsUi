import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'contactsFront';
  public location: Location;
  constructor(private router: Router){}

  ngOnInit(){
  console.log(window.location.href)
  this.router.navigateByUrl('')
  // this.location.assign(window.location.href)
  }
}


