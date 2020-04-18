import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
// @ts-ignore
import collectionFromJson from '../../assets/Collections.json';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  collection;
  photoLayout = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      try {
        this.collection = collectionFromJson.collection[this.getCollectionIdFromName(params.get('collectionId'))];
        setTimeout(() => {
          this.photoLayout = this.initPhotoLayout(params.get('collectionId'));
        }, 300);
      } catch (e) {
        this.router.navigate(['/pageNotFound']);
      }
    });

  }

  private getCollectionIdFromName(name) {
    let id = 0;
    for (const collection of collectionFromJson.collection) {
      if (collection.name === name) {
        return id;
      }
      id++;
    }
    throw new Error(
      'No collection found. The URL is probably wrong'
    );
  }

  getLayoutFromPhotoName(photoName) {
    return this.photoLayout[this.getCollectionIdFromName(photoName)];
  }

  isHorizontal(image) {
    return image.width > image.height;
  }

  isVertical(image) {
    return image.width < image.height;
  }

  collectionToHVS(collectionName) {
    const response = [];
    let image;
    const collectionToExplore = collectionFromJson.collection[this.getCollectionIdFromName(collectionName)];
    for (const imageName of collectionToExplore.files) {
      image = new Image();
      image.src = '../../assets/Photos/' + collectionName + '/' + imageName;
      if (this.isHorizontal(image)) {
        response.push('H');
      } else if (this.isVertical(image)) {
        response.push('V');
      } else {
        response.push('S');
      }
    }
    return response;
  }

  initPhotoLayout(collectionName) {
    const pageLayout = {};
    let collectioName: string;
    let idImage;

    // for (const allCollection of collectionFromJson.collection) {
    //   collectionName = allCollection.name;
    const val = this.collectionToHVS(collectionName);
    console.log(collectionName);
    console.log(val);
    idImage = 0;
    // for (const picture of allCollection.files) {
    //   imageRestante = allCollection.files.length - idImage;
    //   img = new Image();
    //   img.src = '../../assets/Photos/' + collectioName + '/' + picture;
    //   if (this.isHorizontal(img)) {
    //     if (imageRestante === 2 && (allCollection.files.length % 2) === 0) {
    //     }
    //   }
    //   idImage++;
    // }
    pageLayout[collectioName] = [[2, 1], [1, 1]];
    // }
    return pageLayout;
  }

}
