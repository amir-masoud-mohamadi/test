export class DataModel3 {
    success: string;
    cities: [{id: string , name: string}];


  constructor(success: string, cities: [{ id: string; name: string }]) {
    this.success = success;
    this.cities = cities;
  }
}
