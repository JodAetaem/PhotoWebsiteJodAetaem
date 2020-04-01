import {Component, OnInit} from '@angular/core';
// @ts-ignore
import collections from '../../assets/Collections.json';


@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  allCollection = collections.collection;


  constructor() {
  }

  ngOnInit(): void {
  }

}
