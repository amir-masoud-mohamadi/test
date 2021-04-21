export class DataModel4 {
    success: string;
  companies: [{id: string , name: string}];


  constructor(success: string, companies: [{ id: string; name: string }]) {
    this.success = success;
    this.companies = companies;
  }
}
