const admin = require('firebase-admin');
let serviceAccount = require('./js-418aa-firebase-adminsdk-u5x64-bd62160278.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

console.log(db);
console.log('hi');

db.collection("students").add({
  no: 111,
  name: "3332"
}).then(function (docRef) {
    res.render('list', { title: 'Express',id:docRef.id });
  })
  .catch(function (error) {
    console.error("新增失敗原因： ", error);
  });

// var db = firebase.firestore();
// var docRef=db.collection("product");
// console.log(db);

// let price = document.querySelector('.price');
// let product = document.querySelector('.product');
// let btn = document.querySelector('.btn');
// let list = document.querySelector('.list');

// if (btn) {
//     btn.addEventListener('click', function () {
//         console.log('ok');
//         let obj = { "name": product.value ,"price": price.value};
//         docRef.add(obj).then(function(snapshot){
//           console.log('新增成功');
//           displayList();
//         })
//     });
// }

// function displayList(){
//   let data = [];
//   docRef.get().then(function(querySnapshot){
//     querySnapshot.forEach(function(doc){
//       data.push(doc.data());
//     });
//     console.log(data.length);
//     console.log(data[0]);
    
//     let str='';
//     for(let i =0; i<data.length;i++){
//       str += '<li>'+data[i].name + '- $' +data[i].price +'</li>';
//     }
//     list.innerHTML = str;
//   });
// }

// displayList();


// // var db = firebase.firestore();
// // console.log(db);

// // let data = [];

// // let txt = document.querySelector('.txt');
// // let btn = document.querySelector('.btn');
// // let list = document.querySelector('.list');

// // if (btn) {
// //     btn.addEventListener('click', function () {
// //         console.log('ok');
// //         let obj = { "text": txt.value };
// //         data.push(obj);
// //         let str = '';
// //         for (let i = 0; data.length > i; i++) {
// //             str += '<li>' + data[i].text + '</li>';
// //         }
// //         list.innerHTML = str;
// //     });
// // }

// // // var citiesRef = db.collection("cities");

// // // // citiesRef.doc("SF").set({
// // // //     name: "San Francisco", state: "CA", country: "USA",
// // // //     capital: false, population: 860000,
// // // //     regions: ["west_coast", "norcal"] });
// // // // citiesRef.doc("LA").set({
// // // //     name: "Los Angeles", state: "CA", country: "USA",
// // // //     capital: false, population: 3900000,
// // // //     regions: ["west_coast", "socal"] });
// // // // citiesRef.doc("DC").set({
// // // //     name: "Washington, D.C.", state: null, country: "USA",
// // // //     capital: true, population: 680000,
// // // //     regions: ["east_coast"] });
// // // // citiesRef.doc("TOK").set({
// // // //     name: "Tokyo", state: null, country: "Japan",
// // // //     capital: true, population: 9000000,
// // // //     regions: ["kanto", "honshu"] });
// // // // citiesRef.doc("BJ").set({
// // // //     name: "Beijing", state: null, country: "China",
// // // //     capital: true, population: 21500000,
// // // //     regions: ["jingjinji", "hebei"] });

// // // //     var citiesRef = db.collection("cities");

// // // citiesRef.orderBy("population", "desc").get().then(function(querySnapshot) {
// // //     querySnapshot.forEach(function(doc) {
// // //         console.log(doc.data());
// // //     });
// // // })
