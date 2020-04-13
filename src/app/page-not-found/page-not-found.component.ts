import {Component, OnInit} from '@angular/core';
// @ts-ignore
import collections from '../../assets/Collections.json';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  picturePath;

  constructor() {
  }

  ngOnInit(): void {
    this.picturePath = this.getRandomPictureFromCollection();
    document.getElementById('NotFoundBackGround').style.backgroundImage = 'url(' + this.picturePath + ')';

  }

  getRandomPictureFromCollection() {
    const collectionNumber = this.getRandomIdInTableMaxSize(collections.collection.length);
    const pictureNumber = this.getRandomIdInTableMaxSize(collections.collection[collectionNumber].files.length);
    return  '../../assets/Photos/' + collections.collection[collectionNumber].name
      + '/' + collections.collection[collectionNumber].files[pictureNumber];
  }

  getRandomIdInTableMaxSize(size){
    return Math.floor(Math.random() * Math.floor(size));
  }

}
