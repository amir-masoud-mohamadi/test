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
  loginEvent = new Subject<boolean>();
  timeEvent = new Subject<any>();
  levelEvent = new Subject<any>();
  userInfo = new Subject<any>();
  marker = new Subject<any>();
  user;
  company(){
    return this.http.get('https://takstart.shop/sb/services/getCompanies.php').pipe(take(1));
  }
  car(id){
    return this.http.post('https://takstart.shop/sb/services/getCars.php', id, {observe: 'response'}).pipe(take(1));
  }
  getBattery(){

    return this.http.get('https://takstart.shop/wp-json/wc/v3/products?status=publish&per_page=100&_fields=id,name,price,images&attribute='+localStorage.getItem('company')+'&attribute_term='+ localStorage.getItem('car_id'), {
      observe: 'response'}).pipe(take(1));
  }
  isCart(){
    const auth = localStorage.getItem('token');
    return this.http.get('https://takstart.shop/sb/sign/isCarSet.php' , {
      observe: 'response', headers: new HttpHeaders().set('Token', auth)}).pipe(take(1));
  }
  constructor(private http: HttpClient) { }
  generate(some) {
    const formData = new FormData();
    formData.append('user_login', some);
    return this.http.post('https://takstart.shop/wp-json/jwt/generate-code', formData, {observe: 'response'}).pipe(take(1));
  }
  getToken(some) {
    const formData = new FormData();
    formData.append('username', localStorage.getItem('phoneNumber'));
    formData.append('password', some);
    return this.http.post('https://takstart.shop/wp-json/jwt/token', formData, {observe: 'response'}).pipe(take(1));
  }
  updateUser(some) {
    let auth = 'Bearer '+ localStorage.getItem('token');



    console.log('formData');
    console.log(some);
    return this.http.post('https://takstart.shop/wp-json/wp/v2/users/'+ localStorage.getItem('id'), some, {
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));
  }
  getUser() {
    let auth = 'Bearer '+ localStorage.getItem('token');
    return this.http.get('https://takstart.shop/wp-json/wp/v2/users/me?_fields=avatar,name,first_name,last_name,id' , {
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));
  }
  getCar(id) {
    return this.http.get('https://takstart.shop/wp-json/wc/v3/products/attributes/' +id+ '/terms?hide_empty=true&per_page=100&page=1&_fields=id,name' , {
      observe: 'response'}).pipe(take(1));
  }
  getDoneHistory() {
    let auth = 'Bearer '+ localStorage.getItem('token');
    return this.http.get('https://takstart.shop/wp-json/wc/v3/orders?status=completed&customer='+ localStorage.getItem('id') + '&expand=products&_fields_products=id,name,images' , {
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));
  }
  getRunningHistory() {
    let auth = 'Bearer '+ localStorage.getItem('token');
    return this.http.get('https://takstart.shop/wp-json/wc/v3/orders?status=processing&customer='+ localStorage.getItem('id') + '&expand=products&_fields_products=id,name,images' , {
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));
  }
  getRunningHistory2() {
    let auth = 'Bearer '+ localStorage.getItem('token');
    return this.http.get('https://takstart.shop/wp-json/wc/v3/orders?status=failed&customer='+ localStorage.getItem('id') + '&expand=products&_fields_products=id,name,images' , {
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));
  }
  getCarName() {
    return this.http.get('https://takstart.shop/wp-json/wc/v3/products/attributes/'+localStorage.getItem('company_id')+'/terms?hide_empty=false&include='+localStorage.getItem('car_id')+'&_fields=name' , {
      observe: 'response'}).pipe(take(1));
  }
  createOrder(body) {
    let auth = 'Bearer '+ localStorage.getItem('token');
    return this.http.post('https://takstart.shop/wp-json/wc/v3/orders' , body,{
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));

  }
  paymentOrder(id) {
    let auth = 'Bearer '+ localStorage.getItem('token');
    return this.http.post('https://takstart.shop/wp-json/wc/v3/process_online_payment_order' , id,{
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));
  }
  recipeEvent1() {
    this.recipeEvent.next(true);
  }
  recipeEvent2() {
    this.recipeEvent.next(false);
  }
  loginEvent1() {
    this.loginEvent.next(true);
  }
  timeEvent1(time) {
    this.timeEvent.next(time);
  }
  levelEvent1(time) {
    this.levelEvent.next(time);
  }
  loginEvent2() {
    this.loginEvent.next(false);
  }
  infoEvent1(user) {
    this.userInfo.next(user);
  }
  infoEvent2() {
    this.userInfo.next(undefined);
  }
  markerEvent1(user) {
    this.marker.next(user);
  }
  markerEvent2() {
    this.marker.next(undefined);
  }
  oneBattery() {
      return this.http.get('https://takstart.shop/wp-json/wc/v3/products?status=publish&per_page=100&&include='+ localStorage.getItem('product_id')+'&_fields=id,name,price,images&attribute='+localStorage.getItem('company')+'&attribute_term='+ localStorage.getItem('car_id'), {
        observe: 'response'}).pipe(take(1));
  }
  validToken() {
    let nin = null;
    let auth = 'Bearer '+ localStorage.getItem('token');
    return this.http.post('https://takstart.shop/wp-json/jwt/token/validate', undefined,{
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));
  }
  createRequest(request) {
    return this.http.post('https://geofahm.ir/wps/createRequest', request, {
      observe: 'response'}).pipe(take(1));
  }
  deleteRequest(request) {
    return this.http.get('https://geofahm.ir/wps/delete?table=requesttbl&id='+request.id).pipe(take(1));
  }
  getNear() {
    return this.http.get('https://geofahm.ir/wps/getNearestSaba?coor='+ localStorage.getItem('long')+ ' ' + localStorage.getItem('latitude') , {
      observe: 'response'}).pipe(take(1));
  }
  getTimeNear(geo) {
    return this.http.get('https://geofahm.ir/wps/shortestPath?coor='+ localStorage.getItem('long')+ ',' + localStorage.getItem('latitude')+';'+ geo.x+','+geo.y, {
      observe: 'response'}).pipe(take(1));
  }
  checkCustomer(geo) {
    return this.http.get('https://geofahm.ir/wps/selectquery?table=center1&fields=st_astext(geom),name,phone&condition=gid='+ geo).pipe(take(1));
  }
  checkOrder(geo) {
    return this.http.get('https://geofahm.ir/wps/selectquery?table=requesttbl&fields=address,peyk,x,y,centerid,status,price,batry_name,battryid,orderid&condition=orderid='+ geo).pipe(take(1));
  }
  updateOrder(geo) {
    return this.http.get('https://geofahm.ir/wps/update?table=requesttbl&field=status&value=100&orderid='+ geo).pipe(take(1));
  }
  peykOrder(geo) {
    return this.http.get('https://geofahm.ir/wps/selectquery?table=listpeyk&fields=name,mobile,id&condition=id='+ geo).pipe(take(1));
  }
  changeStatus(body, order) {
    let auth = 'Bearer '+ localStorage.getItem('token');
    return this.http.put('https://takstart.shop/wp-json/wc/v3/orders/'+order , body,{
      observe: 'response', headers: new HttpHeaders().set('Authorization', auth)}).pipe(take(1));

  }

}
