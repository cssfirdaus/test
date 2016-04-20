angular.module('starter.controllers', ['ionic','ngCordova'])

.controller('AppCtrl', function($cordovaFileTransfer,$ionicLoading,$cordovaDatePicker,$http,$ionicPopup,$scope, $ionicModal, $timeout,$location, $cordovaCamera, $cordovaFile,$window) {
$scope.images = [];
$scope.images_upload = [];
$scope.showspin=0;
$scope.formData={};
$scope.loginform={};

//console.log("controller lalalala");


$scope.upload=function(id){

 

angular.forEach($scope.images, function(value){
   var options = {
    fileName: value,
    filekey:"file",
    params : {'insertid':id}
  };
  console.log("file to upload="+value);
    $cordovaFileTransfer.upload("http://cloone.my/demo/sh_subsidy/API/upload.php", value, options)
      .then(function(result) {
        console.log("upload done "+result);
      }, function(err) {
       console.log("upload error");
      }, function (progress) {
        // constant progress updates
      })
});

//$window.location.reload();

}

$scope.datepicker=function(){

  var options = {
    date: new Date(),
    mode: 'date', // or 'time'
    //minDate: new Date() - 10000,
    allowOldDates: true,
    allowFutureDates: true,
    doneButtonLabel: 'DONE',
    doneButtonColor: '#000000',
    cancelButtonLabel: 'CANCEL',
    cancelButtonColor: '#000000'
  };

    $cordovaDatePicker.show(options).then(function(date){
      //  alert(date);

    //  var dateFormat = require('YYYY-MM-DD');
     // dateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
var d=date.getDate();
var m=date.getMonth()+1;
var y=date.getFullYear();

     
if(d.length==1){
  d="0"+d;
}

if(m.length==1){
  m="0"+m;
}

var datestr=y+"-"+m+"-"+d;
      $scope.formData.date=datestr;
    });


}


 $scope.valert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Error',
     template: 'All Field Is Mandatory!'
   });

   return false;
}

//alert(Camera.DestinationType.DATA_URL);

$scope.urlForImage = function(imageName) {
  var name = imageName.substr(imageName.lastIndexOf('/') + 1);
  var trueOrigin = cordova.file.dataDirectory + name;
  //$scope.images_upload.push(trueOrigin);
  return trueOrigin;
}


$scope.addImage = function(type) {

  if(type=='camera'){
    var source=Camera.PictureSourceType.CAMERA;
  }
  else{
     var source=Camera.PictureSourceType.PHOTOLIBRARY;
  }
  // 2
  var options = {
    destinationType : Camera.DestinationType.FILE_URI,
    sourceType : source, // Camera.PictureSourceType.PHOTOLIBRARY,Camera.PictureSourceType.CAMERA
    allowEdit : true,
    encodingType: Camera.EncodingType.JPEG,
  
  };
  
  // 3
  $cordovaCamera.getPicture(options).then(function(imageData) {
 
    // 4
    onImageSuccess(imageData);
 
    function onImageSuccess(fileURI) {
      createFileEntry(fileURI);
    }
 
    function createFileEntry(fileURI) {
      window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
    }
 
    // 5
    function copyFile(fileEntry) {
      var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
      var newName = makeid() + name;
 
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
        fileEntry.copyTo(
          fileSystem2,
          newName,
          onCopySuccess,
          fail
        );
      },
      fail);
    }
    
    // 6
    function onCopySuccess(entry) {
      $scope.$apply(function () {
        $scope.images.push(entry.nativeURL);
      });
    }
 
    function fail(error) {
      console.log("fail: " + error.code);
    }
 
    function makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
      for (var i=0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }
 
  }, function(err) {
    console.log(err);
  });


 }
 

$scope.logout=function(){


 window.localStorage['efuser']="";
       window.localStorage['ucode']="";
      window.localStorage['efusername']="";

      $location.path("/userlogin");

}


$scope.pushdata=function(){

   // $ionicLoading.show({
   //    template: '<ion-spinner icon="android"></ion-spinner><br>Loading...',
   //  hideOnStageChange: true
   //  })
console.log("pushdata fn");
console.log($scope.formData);
console.log($scope.images);


if($scope.formData.sdcode==null || $scope.formData.sdcode==""){

 $scope.valert();
}
else{

// $scope.upload();

$http({
  method  : 'POST',
  dataType: 'json',
  url     : 'http://cloone.my/demo/sh_subsidy/API/eform_API.php',
  data    : 'post_appeal=post_appeal&stafcode='+window.localStorage['ucode']+'&sdcode='+$scope.formData.sdcode+'&ssono='+$scope.formData.ssono+'&date='+$scope.formData.date+'&type='+$scope.formData.type+'&brand='+$scope.formData.brand+'&model='+$scope.formData.model+'&serial='+$scope.formData.serial+'&comm'+$scope.formData.comm+'&images='+$scope.images,
  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
 })
  .success(function(data) {
       $ionicLoading.hide();
      console.log("appeal posted="+data);
       
       //$scope.formData="";
       var quotpopuo = $ionicPopup.alert({
              title: 'Message',
              template: 'eForm Submitted'
               });
     // $scope.uploadimg();

     $scope.upload(data.insertid)

     //$window.location.reload();

     })
  .error(function(err){

$ionicLoading.hide();

  });



}



}









  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

$scope.amLogin=function(){
//   console.log($scope.loginform);
 $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner><br>Loading...',
    hideOnStageChange: true
    })

  $http({
  method  : 'POST',
  dataType: 'json',
  url     : 'http://cloone.my/demo/sh_subsidy/API/eform_API.php',
  data    : 'amlogin=amlogin&username='+$scope.loginform.username+'&password='+$scope.loginform.password,
  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
 })
  .success(function(data) {
     $ionicLoading.hide();
      console.log("login ajax");
       console.log(data);
     // $scope.uploadimg();
     if(data.success==1){
      console.log("login success");
      window.localStorage['efuser']=data.userid;
       window.localStorage['ucode']=data.ucode;
      window.localStorage['efusername']=data.userid;

      $location.path("app/form");

     }
     else{
       var quotpopuo = $ionicPopup.alert({
              title: 'Message',
              template: 'Invalid username/password'
               });
     }

     }).error(function(err){
       $ionicLoading.hide();
 var quotpopuo = $ionicPopup.alert({
              title: 'Message',
              template: 'Error to connect to server'
               });


     })







//$location.url("app/form");


}


})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})




.controller('PlaylistCtrl', function($scope, $stateParams) {
});
