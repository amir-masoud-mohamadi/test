import { Injectable } from '@angular/core';
import {take} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AlertController} from "@ionic/angular";
import {Subject} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class loginRegister {
  recipeEvent = new Subject<boolean>();
  user;
  company(){
    return this.http.get('https://bakian.ir/sb/services/getCompanies.php').pipe(take(1));
  }
  car(id){
    return this.http.post('https://bakian.ir/sb/services/getCars.php', id, {observe: 'response'}).pipe(take(1));
  }
  getBattery(){

    return this.http.get('https://bakian.ir/wp-json/wc/v3/products?status=publish&per_page=100&_fields=id,name,price,images&attribute='+localStorage.getItem('company')+'&attribute_term='+ localStorage.getItem('car_id'), {
      observe: 'response'}).pipe(take(1));
  }
  isCart(){
    const auth = localStorage.getItem('token');
    return this.http.get('https://bakian.ir/sb/sign/isCarSet.php' , {
      observe: 'response', headers: new HttpHeaders().set('Token', auth)}).pipe(take(1));
  }
  constructor(private http: HttpClient,private alertCtrl: AlertController) { }
  generate(some) {
    const formData = new FormData();
    formData.append('user_login', some);
    return this.http.post('https://bakian.ir/wp-json/jwt/generate-code', formData, {observe: 'response'}).pipe(take(1));
  }
  getToken(some) {
    const formData = new FormData();
    formData.append('username', localStorage.getItem('phoneNumber'));
    formData.append('password', some);
    return this.http.post('https://bakian.ir/wp-json/jwt/token', formData, {observe: 'response'}).pipe(take(1));
  }
  updateUser(some) {
    let auth = 'Bearer '+ localStorage.getItem('token');



    console.log('formData');
    console.log(some);
    return this.http.post('https://bakian.ir/wp-json/wp/v2/users/'+ localStorage.getItem('id'), some, {
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));
  }
  getUser() {
    let auth = 'Bearer '+ localStorage.getItem('token');
    return this.http.get('https://bakian.ir/wp-json/wp/v2/users/me?_fields=avatar,name,first_name,last_name,id' , {
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));
  }
  getCar(id) {
    return this.http.get('https://bakian.ir/wp-json/wc/v3/products/attributes/' +id+ '/terms?hide_empty=true&per_page=100&page=1&_fields=id,name' , {
      observe: 'response'}).pipe(take(1));
  }
  getDoneHistory() {
    let auth = 'Bearer '+ localStorage.getItem('token');
    return this.http.get('https://bakian.ir/wp-json/wc/v3/orders?status=completed&customer='+ localStorage.getItem('id') + '&expand=products&_fields_products=id,name,images' , {
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));
  }
  getRunningHistory() {
    let auth = 'Bearer '+ localStorage.getItem('token');
    return this.http.get('https://bakian.ir/wp-json/wc/v3/orders?status=processing&customer='+ localStorage.getItem('id') + '&expand=products&_fields_products=id,name,images' , {
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));
  }
  getCarName() {
    return this.http.get('https://bakian.ir/wp-json/wc/v3/products/attributes/'+localStorage.getItem('company_id')+'/terms?hide_empty=false&include='+localStorage.getItem('car_id')+'&_fields=name' , {
      observe: 'response'}).pipe(take(1));
  }
  createOrder(body) {
    let auth = 'Bearer '+ localStorage.getItem('token');
    return this.http.post('https://bakian.ir/wp-json/wc/v3/orders' , body,{
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));

  }
  paymentOrder(id) {
    let auth = 'Bearer '+ localStorage.getItem('token');
    return this.http.post('https://bakian.ir/wp-json/wc/v3/process_online_payment_order' , id,{
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));
  }
  recipeEvent1() {
    this.recipeEvent.next(true);
  }
  recipeEvent2() {
    this.recipeEvent.next(false);
  }
  oneBattery() {
      return this.http.get('https://bakian.ir/wp-json/wc/v3/products?status=publish&per_page=100&&include='+ localStorage.getItem('product_id')+'&_fields=id,name,price,images&attribute='+localStorage.getItem('company')+'&attribute_term='+ localStorage.getItem('car_id'), {
        observe: 'response'}).pipe(take(1));
  }
  validToken() {
    let nin = null;
    let auth = 'Bearer '+ localStorage.getItem('token');
    return this.http.post('https://bakian.ir/wp-json/jwt/token/validate', undefined,{
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));
  }
}
