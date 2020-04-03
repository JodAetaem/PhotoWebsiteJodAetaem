import {Routes} from '@angular/router';
import {HomePageComponent} from './home-page/home-page.component';
import {CollectionComponent} from './collection/collection.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';


export const APP_ROUTES: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'collection/:id', component: CollectionComponent },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];
