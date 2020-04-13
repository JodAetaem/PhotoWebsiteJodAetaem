import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 // @ts-ignore
import collections from '../../assets/Collections.json';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  collection;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.collection = collections.collection[this.getCollectionIdFromName(params.get('collectionId'))];
    });
  }

  private getCollectionIdFromName(name) {
    let id = 0;
    for (const collection of collections.collection) {
      if (collection.name === name) {
        return id;
      }
      id++;
    }
  }

  testFunction() {

  }
}
