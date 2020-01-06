var express = require('express');
var router = express.Router();

const admin = require('firebase-admin');
const firebase = require('firebase');
const imgur = require('imgur');
// var defaultStorage = admin.storage();
// const storage = require("firebase/storage");
let serviceAccount = require('../js-418aa-firebase-adminsdk-u5x64-bd62160278.json');
// let storage = require('@google-cloud/storage')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();
// let storage = admin.storage();

/* GET home page. */
// 首頁 顯示貼文欄位
router.get('/', function (req, res, next) {
  if (req.session.memberId != undefined) {
    var docRef = db.collection("post");
    let postData = [];
    let postId = [];
    if(req.query.tag!=undefined){
      let tag = req.query.tag;
      docRef.where('tag','==',tag).orderBy('title', "desc").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          postData.push(doc.data());
          postId.push(doc.id);
        });
        res.render('index', {
          title: '首頁',
          name: req.session.name,
          password: req.session.password,
          memberId: req.session.memberId,
          data: postData,
          idData: postId
        });
      });
    }else{
      docRef.orderBy('title', "desc").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          postData.push(doc.data());
          postId.push(doc.id);
        });
        res.render('index', {
          title: '首頁',
          name: req.session.name,
          password: req.session.password,
          memberId: req.session.memberId,
          data: postData,
          idData: postId
        });
      });
    }
  } else {
    res.redirect('/login');
  }
});

// 豋入頁面
router.get('/login', function (req, res, next) {
  res.render('login', {
    title: '登入',
    name: req.session.name,
    password: req.session.password,
    memberId: req.session.memberId
  });
});
router.post('/login', function (req, res) {
  var memberRef = db.collection('member');
  memberRef.where('name', '==', req.body.name).get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      console.log(doc.data().password == req.body.password)
      console.log(doc.data().password)
      console.log(req.body.password)
      if (doc.data().password == req.body.password) {
        // req.session.id = doc.id;
        req.session.memberId = doc.id;
        req.session.name = doc.data().name;
        req.session.password = req.body.password;
        res.redirect('/')
      }
    });
  }).catch(function (e) {
    console.error(e);
  })
});

// router.post('/upload', function (req, res) {
//   var config = {
//     apiKey: "AIzaSyC73Y5K89J1kzCz4x3CS7Qr_aleL39Wo7s",
//     authDomain: "js-418aa.firebaseapp.com",
//     databaseURL: "https://js-418aa.firebaseio.com",
//     projectId: "js-418aa",
//     storageBucket: "js-418aa.appspot.com",
//     messagingSenderId: "170412983589",
//     appId: "1:170412983589:web:eb81277ff1bacd277c46cc",
//     measurementId: "G-813YM6SN0D"
//   };
//   firebase.initializeApp(config);
//   var storage = admin.storage();
//   var storageRef = admin.storage().ref('photo/asdas');
//   storageRef.put(req.body.foto).then(function(snapshot) {
//     console.log('Uploaded a blob or file!');
//     console.log(snapshot.ref.getDownloadURL());
//   }).then(function (docs){
//     console.log(docs.ref.getDownloadURL());
//     res.redirect('/');
//   })
// });
  // let ref = bbucket.upload(req.file);
  // var storageRef = firebase.storage().ref();
  // const file = document.querySelector('#photo').files[0]
  // const name = (+new Date()) + '-' + req.file.name;
  // let metadata = {
  //   contentType: file.type
  // };
  // console.log(name);
  // let task = storageRef.child(name).put(req.file, metadata);
  // task
  //   .then(snapshot => snapshot.ref.getDownloadURL())
  //   .then((url) => {
  //     console.log(url);
  //     db.collection('test').add({ 'photoURL': url, 'name': name })
  //   })
  //   .catch(console.error);
  // res.redirect('/');
// });

//細節頁面
router.get('/detail', function (req, res, next) {
  let post = req.query.post;
  var docRef = db.collection("post");
  let commentData = [];
  let commentDataId = [];
  if (req.query.post != undefined) {
    docRef.doc(post).get().then(function (querySnapshot) {
      db.collection('comment').where('post','==',post).get().then(function (snapshot) {
        snapshot.forEach(function (dow) {
          commentData.push(dow.data());
          commentDataId.push(dow.id);
          console.log(dow.data());
        });
      }).then(function (){
        res.render('detail', {
        title: '貼文', data: querySnapshot.data(), name: req.session.name, password: req.session.password,
        memberId: req.session.memberId, dataId: post, commentData:commentData, commentDataId:commentDataId
      });
      });
    });
  } else {
    res.redirect('/');
  }
});

router.post('/addComment', function (req, res, next) {
  if (req.session.memberId != undefined) {
    var docRef = db.collection("comment");
    docRef.add({
      "value": req.body.value,
      "creator": req.session.memberId,
      "creatorName": req.session.name,
      "post": req.query.post
    }).then(function () {
      res.redirect("/detail?post="+req.query.post)
    });
  } else{
    res.redirect('/login');
  }
});

router.get('/profile', function (req, res, next) {
  if (req.session.memberId != undefined) {
    var docRef = db.collection("post");
    let postData = [];
    let postId = [];
    docRef.where('creator','==',req.session.memberId).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        postData.push(doc.data());
        postId.push(doc.id);
      });
      res.render('profile', {
        title: '個人',
        name: req.session.name,
        password: req.session.password,
        memberId: req.session.memberId,
        data: postData,
        idData: postId
      });
    })
  } else {
    res.redirect('/login');
  }
});

router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/login');
      }
    });
  }
});
router.get('/delete', function(req, res, next) {
  let post = req.query.post;
  var docRef = db.collection("post");
  if (req.query.post != undefined) {
    docRef.doc(post).delete().then(function (querySnapshot) {
      res.redirect('/profile');
    });
  } else {
    res.redirect('/profile');
  }
});

//PO文頁面
router.get('/create', function (req, res, next) {
  if (req.session.memberId != undefined) {
    res.render('create', {
      title: '新增', name: req.session.name,
      password: req.session.password,
      memberId: req.session.memberId
    });
  } else{
    res.redirect('/login');
  }
});
router.post('/create', function (req, res, next) {
  var docRef = db.collection("post");
      docRef.add({
        "title": req.body.title,
        "content": req.body.content,
        "creator": req.session.memberId,
        "creatorName": req.session.name,
        "introduction": req.body.introduction,
        "tag": req.body.tag,
        "photoUrl": req.body.pictureUrl
        // "photoURL": url
      }).then(function () {
        res.redirect("/")
      });
  // 註解掉的是廢碼可以刪掉
  // var storageRef = defaultStorage.bucket(req.body.file.name);
  // var storageRef = storage.bucket(req.body.file);
  // var storageRef = storage.ref().put();
  // let url = storageRef.getDownloadURL;
  
});

router.get('/edit', function (req, res, next) {
  let post = req.query.post;
  var docRef = db.collection("post");
  if (req.query.post != undefined) {
    docRef.doc(post).get().then(function (querySnapshot) {
      res.render('edit', {
        title: '編輯貼文', data: querySnapshot.data(), name: req.session.name, password: req.session.password,
        memberId: req.session.memberId, dataId: post
      });
    });
  }else{
    res.render('/');
  }
});
//修改資料庫
router.post('/edit', function (req, res) {
  let post = req.query.post;
  db.collection('post').doc(post).update({
        "title": req.body.title,
        "content": req.body.content,
      }).then(function () {
          res.redirect("/detail?post="+post)
      });
});

//註冊頁面
router.get('/register', function (req, res, next) {
  res.render('register', {
    title: '註冊',
    name: req.session.name,
    password: req.session.password,
    memberId: req.session.memberId
  });
});
router.post('/register', function (req, res) {
  db.collection('member').add({ 'name': req.body.name, 'password': req.body.password }).then(function () {
    var memberRef = db.collection('member');
    memberRef.where('name', '==', req.body.name).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.data().password == req.body.password)
        console.log(doc.data().password)
        console.log(req.body.password)
        if (doc.data().password == req.body.password) {
          // req.session.id = doc.id;
          req.session.memberId = doc.id;
          req.session.name = doc.data().name;
          req.session.password = req.body.password;
          res.redirect('/')
        }
      });
    }).catch(function (e) {
      console.error(e);
    })
  });
});

//以下都之前上課的不用理
// router.get('/products', function (req, res, next) {
//   let limit = parseInt(req.query.limit) || 15;
//   let at = parseInt(req.query.at);
//   var docRef = db.collection("products");
//   if (req.query.q != undefined) {
//     let productData = [];
//     docRef.where('name', '==', req.query.q).limit(limit).get().then(function (querySnapshot) {
//       querySnapshot.forEach(function (doc) {
//         productData.push(doc.data())
//       });
//       res.render('products', { title: 'Express', data: productData });
//     })
//   } else if (req.query.at != undefined) {
//     let productData = [];
//     docRef.where('price', '==', at).limit(limit).get().then(function (querySnapshot) {
//       querySnapshot.forEach(function (doc) {
//         productData.push(doc.data())
//       });
//       res.render('products', { title: 'Express', data: productData });
//     })
//   } else {
//     let productData = [];
//     docRef.orderBy('price', "desc").get().then(function (querySnapshot) {
//       querySnapshot.forEach(function (doc) {
//         productData.push(doc.data())
//       });
//       res.render('products', { title: 'Express', data: productData });
//     })
//   }
// });

// router.post('/addProduct', function (req, res, next) {
//   // 傳入資料為req.body
//   console.log(req.body);

//   var docRef = db.collection("products");
//   docRef.add({
//     "name": req.body.name,
//     "price": parseInt(req.body.price)
//   }).then(function () {
//     res.redirect("/products")
//   })
// });

// router.get('/messageList', function (req, res, next) {
//   var docRef = db.collection("message");
//   let messageData = [];
//   docRef.get().then(function (querySnapshot) {
//     querySnapshot.forEach(function (doc) {
//       messageData.push(doc.data())
//     });
//     res.render('messageList', { title: 'messageList', data: messageData });
//   })
// });

// router.post('/messageCreate', function (req, res, next) {
//   var docRef = db.collection("message");
//   // var now = Date
//   docRef.add({
//     "value": req.body.value,
//     // "time": Date.now
//   }).then(function () {
//     res.redirect("/messageList")
//   })
// });


module.exports = router;
