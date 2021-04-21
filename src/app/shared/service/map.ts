import { Injectable } from '@angular/core';
import {take} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class Map {
  address(code){
    return this.http.get('https://map.ir/fast-reverse?lat=' + code.lat + '&lon=' +
      code.lng + '&x-api-key=' + code.api, {observe: 'response'}).pipe(take(1));
  }
  searchAddress(body) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjE5MDQyZGM5MGVhNmFjN2U3OWU2YWU5NjJkZDViZjQ5ZmEzZjQzZDViYzQ3MThiOTk4MzdiM2QwNjBmZjgyYzg1ZDE1ODViZjE4OGJiMDhiIn0.eyJhdWQiOiIxMjExMCIsImp0aSI6IjE5MDQyZGM5MGVhNmFjN2U3OWU2YWU5NjJkZDViZjQ5ZmEzZjQzZDViYzQ3MThiOTk4MzdiM2QwNjBmZjgyYzg1ZDE1ODViZjE4OGJiMDhiIiwiaWF0IjoxNjE0MTY4NTQ3LCJuYmYiOjE2MTQxNjg1NDcsImV4cCI6MTYxNDUxNDE0Nywic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.qsSghHPPKPpcvbg-ynJ6NFgtUGJJCaaYH_UuqjxxjPUrlqmDTLNL0Z1M9phEZTwxbtL1dDQcdmjnm7RKLjUSon8LxHMYIkP9kk7Zpehh1suR_vTtjrIAkIrH1gjdmxug64knegNkmzS5uUWd4LVVbdyHuyeA9iOwjc2QoskqcTDUYk_R4qWFn7QRbTF91kbALOVBhZAgtJo1VBIj1lnBvynwMAed3KbmjuqbSV4Bdfpsoid6dEygwX1Z1CDDNe_LoCIQIWunuXnffP5Kt0R8lOrb7Lb_S9M5n2DLPc-InkyNGRxg2bcY0epZqdymKpkAvHw-BzqUhhV2VZ4oYcsMQQ',
      })
  };
    return this.http.post('https://map.ir/search/v2/autocomplete', body, httpOptions).pipe(take(1));
  }
  constructor(private http: HttpClient) { }
}
