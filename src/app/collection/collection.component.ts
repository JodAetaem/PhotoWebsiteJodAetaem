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
        }, 1000);
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
    const pageLayout = [];
    let idImage;

    const collectionOrientation = this.collectionToHVS(collectionName);
    let leftToTreat = 0;
    console.log(collectionName);
    console.log(collectionOrientation);
    idImage = 0;
    while (idImage < collectionOrientation.length) {
      leftToTreat = collectionOrientation.length - idImage;
      if (leftToTreat <= 2) {
        if (collectionOrientation[idImage] === 'V' && collectionOrientation[idImage + 1] === 'H') {
          pageLayout.push([1, 2]);
          pageLayout.push([2, 2]);
        } else {
          pageLayout.push([2, 2]);
          pageLayout.push([1, 2]);
        }
        idImage = idImage + 2;
      }
      else if (leftToTreat === 4) {
        if (collectionOrientation[idImage] === 'V' && collectionOrientation[idImage + 1] === 'V') {
          pageLayout.push([1, 2]);
          pageLayout.push([1, 2]);
          pageLayout.push([1, 1]);
          pageLayout.push([1, 1]);
          idImage = idImage + 4;
        } else if (collectionOrientation[idImage] === 'V' && collectionOrientation[idImage + 1] === 'H'){
          pageLayout.push([1, 2]);
          pageLayout.push([2, 1]);
          pageLayout.push([1, 1]);
          pageLayout.push([1, 1]);
          idImage = idImage + 4;
        } else{
          pageLayout.push([2, 1]);
          pageLayout.push([1, 2]);
          pageLayout.push([1, 1]);
          pageLayout.push([1, 1]);
          idImage = idImage + 4;
        }
      }
      else if (leftToTreat > 11) {
        pageLayout.push([1, 1]);
        pageLayout.push([1, 1]);
        pageLayout.push([1, 1]);
        pageLayout.push([1, 1]);
        pageLayout.push([1, 1]);
        pageLayout.push([1, 1]);
        idImage = idImage + 6;
      }
      else {
        if (collectionOrientation[idImage] === 'V' && collectionOrientation[idImage + 1] === 'H'){
          pageLayout.push([1, 2]);
          pageLayout.push([2, 1]);
          pageLayout.push([2, 1]);
          idImage = idImage + 3;
        } else {
          pageLayout.push([2, 1]);
          pageLayout.push([1, 2]);
          pageLayout.push([2, 1]);
          idImage = idImage + 3;
        }
      }
    }
    console.log('pageLayout: ', pageLayout);
    return pageLayout;
  }

}
