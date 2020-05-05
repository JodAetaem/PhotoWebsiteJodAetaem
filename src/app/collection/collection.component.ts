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
    const response = [];
    const collectionToExplore = collectionFromJson.collection[this.getCollectionIdFromName(collectionName)];
    let idImage = 0;
    return new Promise((resolve, reject) => {
      for (const imageName of collectionToExplore.files) {

        let blob = null;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '../../assets/Photos/' + collectionName + '/' + imageName);
        xhr.responseType = 'blob'; // force the HTTP response, response-type header to be blob

        xhr.onload = () => {
          blob = xhr.response; // xhr.response is now a blob object
          const file = new File([blob], imageName, {type: 'image/jpg', lastModified: Date.now()});
          console.log(imageName + ' has been loaded');
          console.log('blob object ', blob);
          console.log('file object ', file);
          console.log('xhr object ', xhr);
          if (this.isHorizontal(file)) {
            response.push('H');
          } else if (this.isVertical(file)) {
            response.push('V');
          } else {
            response.push('S');
          }
          idImage++;
          if (idImage === collectionToExplore.files.length) {
            resolve(response);
          }
        };
        xhr.send();
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
