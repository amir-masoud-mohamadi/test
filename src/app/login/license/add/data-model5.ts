export class DataModel5 {
    success: string;
    cars: [{id: string , name: string}];


  constructor(success: string, cars: [{ id: string; name: string }]) {
    this.success = success;
    this.cars = cars;
  }
}
