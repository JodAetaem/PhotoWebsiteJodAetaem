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
  test = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      try {
        this.collection = collectionFromJson.collection[this.getCollectionIdFromName(params.get('collectionId'))];
        this.initPhotoLayout(params.get('collectionId')).then(value => {
          this.photoLayout = value;
        });

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
    return this.photoLayout[this.getCollectionIdFromName(photoName)][0];
  }

  isHorizontal(image) {
    return image.width > image.height;
  }

  isVertical(image) {
    return image.width < image.height;
  }

  async collectionToHVS(collectionName) {
    const collectionToExplore = collectionFromJson.collection[this.getCollectionIdFromName(collectionName)];
    const response = [];
    return new Promise((resolve, reject) => {
      for (const imageName of collectionToExplore.files) {
        const img = new Image;

        img.onload = () => {
          console.log(imageName + ' has been loaded');
          if (this.isHorizontal(img)) {
            response.push('H');
          } else if (this.isVertical(img)) {
            response.push('V');
          } else {
            response.push('S');
          }
          if (response.length === collectionToExplore.files.length) {
            resolve(response);
          }
        };
        img.src = '../../assets/Photos/' + collectionName + '/' + imageName;
      }
    });

  }

  initPhotoLayout(collectionName) {

    return new Promise((resolve, reject) => {

      const pageLayoutResponse = [];
      let idImage;

      this.collectionToHVS(collectionName).then((response) => {
        const collectionOrientation = [].concat(response);
        let leftToTreat = 0;
        console.log(collectionName);
        console.log(collectionOrientation);
        idImage = 0;
        while (idImage < collectionOrientation.length) {
          leftToTreat = collectionOrientation.length - idImage;
          if (leftToTreat <= 2) {
            if (collectionOrientation[idImage] === 'V' && collectionOrientation[idImage + 1] === 'H') {
              pageLayoutResponse.push([1, 2]);
              pageLayoutResponse.push([2, 2]);
            } else {
              pageLayoutResponse.push([2, 2]);
              pageLayoutResponse.push([1, 2]);
            }
            idImage = idImage + 2;
          } else if (leftToTreat === 4) {
            if (collectionOrientation[idImage] === 'V' && collectionOrientation[idImage + 1] === 'V') {
              pageLayoutResponse.push([1, 2]);
              pageLayoutResponse.push([1, 2]);
              pageLayoutResponse.push([1, 1]);
              pageLayoutResponse.push([1, 1]);
              idImage = idImage + 4;
            } else if (collectionOrientation[idImage] === 'V' && collectionOrientation[idImage + 1] === 'H') {
              pageLayoutResponse.push([1, 2]);
              pageLayoutResponse.push([2, 1]);
              pageLayoutResponse.push([1, 1]);
              pageLayoutResponse.push([1, 1]);
              idImage = idImage + 4;
            } else {
              pageLayoutResponse.push([2, 1]);
              pageLayoutResponse.push([1, 2]);
              pageLayoutResponse.push([1, 1]);
              pageLayoutResponse.push([1, 1]);
              idImage = idImage + 4;
            }
          } else if (leftToTreat > 11) {
            pageLayoutResponse.push([1, 1]);
            pageLayoutResponse.push([1, 1]);
            pageLayoutResponse.push([1, 1]);
            pageLayoutResponse.push([1, 1]);
            pageLayoutResponse.push([1, 1]);
            pageLayoutResponse.push([1, 1]);
            idImage = idImage + 6;
          } else {
            if (collectionOrientation[idImage] === 'V' && collectionOrientation[idImage + 1] === 'H') {
              pageLayoutResponse.push([1, 2]);
              pageLayoutResponse.push([2, 1]);
              pageLayoutResponse.push([2, 1]);
              idImage = idImage + 3;
            } else {
              pageLayoutResponse.push([2, 1]);
              pageLayoutResponse.push([1, 2]);
              pageLayoutResponse.push([2, 1]);
              idImage = idImage + 3;
            }
          }
        }
        resolve(pageLayoutResponse);
        console.log('photolayout fin init function', pageLayoutResponse);
      });
    });

  }

}
