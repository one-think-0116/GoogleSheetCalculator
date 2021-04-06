/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 'use strict';
//  google.load("search", "1");
 // Signs-in Friendly Chat.
 var realTimeData = {A5:null,A6:null,B5:null,B6:null,D5:null,D6:null,F5:null,F6:null,J12:null,J13:null,R3:null,T11:null};
 var realCalcData = {email:null,C5:null,C6:null,C7:null,C8:null,C9:null,C10:null,C11:null,C12:null,C13:null,C14:null,C15:null,C16:null,C17:null,F5:null,F7:null,F8:null,F9:null,F10:null};
 var calcData = {C5:null,C6:null,C7:null,C8:null,C9:null,C10:null,C11:null,C12:null,C13:null,C14:null,C15:null,C16:null,C17:null,F5:null};
 var userEmail;
 var authFlag = false;
 function signIn() {
   // Sign into Firebase using popup auth & Google as the identity provider.
   var provider = new firebase.auth.GoogleAuthProvider();
   firebase.auth().signInWithPopup(provider).then(result => {
       if(!!result)
       {
          // core();
         localStorage.setItem("auth",firebase.auth().currentUser.email);
         userEmail = firebase.auth().currentUser.email;
         $('.maincontent').show();

         initial();
         if(firebase.auth().currentUser.email == "onethink0116@gmail.com" || firebase.auth().currentUser.email == "rsefrioui40@gmail.com"){
          authFlag = !authFlag;
          $('a[href="#calculator"]').removeClass('is-active');
          $('#calculator').removeClass('is-active');
          $('a[href="#formulas"]').addClass('is-active');
          $('#formulas').addClass('is-active');
            core();
        }else{
          $('a[href="#formulas"]').hide();
          $('a[href="#users"]').hide();
        }
       }
   });

 }
 
 // Signs-out of Friendly Chat.
 function signOut() {
   // TODO 2: Sign out of Firebase.
   // Sign out of Firebase.
  firebase.auth().signOut();
  localStorage.removeItem("auth");
  $('.maincontent').hide();
  location.reload();
 }
 
 // Initiate firebase auth.
 function initFirebaseAuth() {
   // TODO 3: Initialize Firebase.
   firebase.auth().onAuthStateChanged(authStateObserver);
 }
 
 // Returns the signed-in user's profile Pic URL.
 function getProfilePicUrl() {
   // TODO 4: Return the user's profile pic URL.
   return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
 }
 
 // Returns the signed-in user's display name.
 function getUserName() {
   // TODO 5: Return the user's display name.
   return firebase.auth().currentUser.displayName;
 }
 
 // Returns true if a user is signed-in.
 function isUserSignedIn() {
   // TODO 6: Return true if a user is signed-in.
   return !!firebase.auth().currentUser;
 }
  
 // Triggers when the auth state change for instance when the user signs-in or signs-out.
 function authStateObserver(user) {
   if (user) { // User is signed in!
     // Get the signed-in user's profile pic and name.
     
     var profilePicUrl = getProfilePicUrl();
     var userName = getUserName();
 
     // Set the user's profile pic and name.
     userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
     userNameElement.textContent = userName;
 
     // Show user's profile and sign-out button.
     userNameElement.removeAttribute('hidden');
     userPicElement.removeAttribute('hidden');
     signOutButtonElement.removeAttribute('hidden');
 
     // Hide sign-in button.
     signInButtonElement.setAttribute('hidden', 'true');

    //  grid();
     // We save the Firebase Messaging Device token and enable notifications.
   } else { // User is signed out!
     // Hide user's profile and sign-out button.
     userNameElement.setAttribute('hidden', 'true');
     userPicElement.setAttribute('hidden', 'true');
     signOutButtonElement.setAttribute('hidden', 'true');
 
     // Show sign-in button.
     signInButtonElement.removeAttribute('hidden');
   }
 }
 
 
 // Adds a size to Google Profile pics URLs.
 function addSizeToGoogleProfilePic(url) {
   if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
     return url + '?sz=150';
   }
   return url;
 }
 
 
 // Checks that the Firebase SDK has been correctly setup and configured.
 function checkSetup() {
   if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
     window.alert('You have not configured and imported the Firebase SDK. ' +
         'Make sure you go through the codelab setup instructions and make ' +
         'sure you are running the codelab using `firebase serve`');
   }
 }
 
 // Checks that Firebase has been imported.
 checkSetup();
 
 // Shortcuts to DOM Elements.
 var userPicElement = document.getElementById('user-pic');
 var userNameElement = document.getElementById('user-name');
 var signInButtonElement = document.getElementById('sign-in');
 var signOutButtonElement = document.getElementById('sign-out');
 var signInSnackbarElement = document.getElementById('must-signin-snackbar');
 
 signOutButtonElement.addEventListener('click', signOut);
 signInButtonElement.addEventListener('click', signIn);
 
//  // initialize Firebase
 initFirebaseAuth();
 
//  // TODO: Enable Firebase Performance Monitoring.
 
//  // We load currently existing chat messages and listen to new ones.
//  loadMessages();
if(localStorage.getItem("auth"))
{
    userEmail = localStorage.getItem("auth");
    $('.maincontent').show();
    initial();
    if(userEmail == "onethink0116@gmail.com" || userEmail == "rsefrioui40@gmail.com")
    {
      authFlag = !authFlag;
      $('a[href="#calculator"]').removeClass('is-active');
      $('#calculator').removeClass('is-active');
      $('a[href="#formulas"]').addClass('is-active');
      $('#formulas').addClass('is-active');
      core();
    }else{
      $('a[href="#formulas"]').hide();
      $('a[href="#users"]').hide(); 
    }
}
function core(){
  // console.log("core function")
  firebase.firestore().collection("CALCULATOR").where("email","==",userEmail)
            .get()
            .then((querySnapshot) => {
                var docs = querySnapshot.docs;
                if(docs.length > 0) //update documentation
                {
                  querySnapshot.forEach((doc) => {
                    calcData.C5 = doc.data().C5;
                    calcData.C6 = doc.data().C6;
                    calcData.C7 = doc.data().C7;
                    calcData.C8 = doc.data().C8;
                    calcData.C9 = doc.data().C9;
                    calcData.C10 = doc.data().C10;
                    calcData.C11 = doc.data().C11;
                    calcData.C12 = doc.data().C12;
                    calcData.C13 = doc.data().C13;
                    calcData.C14 = doc.data().C14;
                    calcData.C15 = doc.data().C15;
                    calcData.C16 = doc.data().C16;
                    calcData.C17 = doc.data().C17;
                    calcData.F5 = doc.data().F5;
                    // $("#grid").html();
                    // $("#grid").off("cellendedit");
                    grid(calcData);
                  })
                }
                else //add documentation
                {
                  grid(null);
                }
            })
           
}
function grid(internalcalcData){
      // prepare the data
      // console.log("grid function")
      var data = new Array();
      var flag = false;
      firebase.firestore().collection("FORMULAS")
      .get()
      .then((querySnapshot) => {
          var docs = querySnapshot.docs;
          if(docs.length > 0) //update documentation
          {
            querySnapshot.forEach((doc) => {
              var length = 20;
              for(var i = 0;i < length;i++)
              {
                data[i] = doc.data()[i];
              }
              flag = true;
            })
          }
          else //add documentation
          {
            row = {};
            row.no = i + 1;
            for(var j = 0;j < 26;j++)
            {
              var key = String.fromCharCode(65 + j);
              row[key] = "";
            }
            data.push(row);
          }
          
        var datafields = [{ name: 'no', type:"number"}];
        var datafieldTemp = {};
        for(var i = 0; i < 26; i++)
        {
          datafieldTemp = {};
          datafieldTemp.name = String.fromCharCode(65 + i);
          datafieldTemp.type = "string";
          datafields.push(datafieldTemp);
        }
        // prepare the data
        var source =
        {
            localdata: data,
            datafields: datafields,
            datatype: "array",
            updaterow: function (rowid, rowdata, commit) {
              commit(true);
          },
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
  
        var columns = [{ text: '', datafield: 'no', width: 50 ,pinned: true,cellsalign: 'center',align: 'center'}];
        var columnsTemp = {};
        for(var i = 0; i < 26; i++)
        {
          columnsTemp = {};
          columnsTemp.align = "center";
          columnsTemp.cellsalign = "center";
          if(i == 1) columnsTemp.width = 250;
          else if(i == 2) columnsTemp.width = 200;
          else if(i == 21) columnsTemp.width = 125;
          else if(i == 17) columnsTemp.width = 125;
          else if(i == 7) columnsTemp.width = 125;
          else columnsTemp.width = 100;
          columnsTemp.text = String.fromCharCode(65 + i);
          columnsTemp.datafield = String.fromCharCode(65 + i);
          columns.push(columnsTemp);
        }
        $("#grid").jqxGrid(
          {
              width: getWidth('Grid'),
              source: dataAdapter,
              sortable: false,
              pageable: false,
              autoheight: false,
              editable: true,
              height: document.body.clientHeight-85,
              width: document.body.clientWidth,
              editmode: "dblclick",
              columnsresize: true,
              columns: columns
          });
          // if(flag) calc(null,calcData,null,authFlag)
      })
      $("#grid").on('cellendedit', function (event) {
          var args = event.args;
          // console.log("args.datafield",args.datafield);
          // console.log("Row:",(1 + args.rowindex));
          // console.log("Value",args.value);
          var cData;
          if(internalcalcData == null) cData = calcData;
          else cData = internalcalcData;
          calc(args,cData,null,authFlag);
          var totalData = {};
          for(var i = 0;i < 20;i++){
            var rowData = $('#grid').jqxGrid('getrowdata', i);
            var saveData = rowData;
            if(i == args.rowindex)
            saveData[args.datafield] = args.value;
            totalData[i] = saveData;
          }
          
          firebase.firestore().collection("FORMULAS")
            .get()
            .then((querySnapshot) => {
              var docs = querySnapshot.docs;
              if(docs.length > 0) //update documentation
              {
                firebase.firestore().collection("FORMULAS").doc(docs[0].id).update(totalData).then(() => {
                    // console.log("FORMULAS Document successfully update!");
                })
              }
              else //add documentation
              {
                return firebase.firestore().collection('FORMULAS').add(totalData);
              }
          })
          
          var cellRef = args.datafield + (1 + args.rowindex).toString();
          if(realTimeData.hasOwnProperty(cellRef)){
            var obj = {};
            obj[cellRef] = args.value;
              var formulascRef = firebase.database().ref('MINIFORMULAS');
              formulascRef.update(obj);
          }
      });
}
function calc(args,calcData,formulasData,authFlag)
{
  // console.log("calc function")
  // console.log("authFlag",authFlag)
  var A5,A6,B5,B6,D5,D6,F5,F6,J12,J13,R3,T11;
  if(authFlag)
  {
    A5 = parseFloat($('#grid').jqxGrid('getcellvalue', 4, "A").split("$")[1]);
    A6 = parseFloat($('#grid').jqxGrid('getcellvalue', 5, "A").split("$")[1]);
    B5 = parseFloat($('#grid').jqxGrid('getcellvalue', 4, "B").split("$")[1]);
    B6 = parseFloat($('#grid').jqxGrid('getcellvalue', 5, "B").split("$")[1]);
    D5 = parseFloat($('#grid').jqxGrid('getcellvalue', 4, "D").split("$")[1]);
    D6 = parseFloat($('#grid').jqxGrid('getcellvalue', 5, "D").split("$")[1]);
    F5 = $('#grid').jqxGrid('getcellvalue', 4, "F");
    F6 = $('#grid').jqxGrid('getcellvalue', 5, "F");
    J12 = parseFloat($('#grid').jqxGrid('getcellvalue', 11, "J").split("$")[1]);
    J13 = parseFloat($('#grid').jqxGrid('getcellvalue', 12, "J").split("$")[1]);
    R3 = parseFloat($('#grid').jqxGrid('getcellvalue', 2, "J").split("%")[0]);
    T11 = parseFloat($('#grid').jqxGrid('getcellvalue', 10, "T").split("%")[0]);
    if(args)
    {
      if(args.datafield == "A")
      {
        if(1 + args.rowindex == 5) A5 = parseFloat(args.value.split("$")[1]);
        else if(1 + args.rowindex == 6) A6 = parseFloat(args.value.split("$")[1]);
      }
      if(args.datafield == "B")
      {
        if(1 + args.rowindex == 5) B5 = parseFloat(args.value.split("$")[1]);
        else if(1 + args.rowindex == 6) B6 = parseFloat(args.value.split("$")[1]);
      }
      if(args.datafield == "D")
      {
        if(1 + args.rowindex == 5) D5 = parseFloat(args.value.split("$")[1]);
        else if(1 + args.rowindex == 6) D6 = parseFloat(args.value.split("$")[1]);
      }
      if(args.datafield == "F")
      {
        if(1 + args.rowindex == 5) F5 = args.value;
        else if(1 + args.rowindex == 6) F6 = args.value;
      }
      if(args.datafield == "J")
      {
        if(1 + args.rowindex == 12) J12 = parseFloat(args.value.split("$")[1]);
        else if(1 + args.rowindex == 13) J13 = parseFloat(args.value.split("$")[1]);
      }
      if(args.datafield == "R")
      {
        if(1 + args.rowindex == 3) R3 = parseFloat(args.value.split("%")[0]);
      }
      if(args.datafield == "T")
      {
        if(1 + args.rowindex == 11) T11 = parseFloat(args.value.split("%")[0]);
      }
    }
  }else{
    // console.log(formulasData.A5);
    A5 = parseFloat(formulasData.A5.split("$")[1]);
    A6 = parseFloat(formulasData.A6.split("$")[1]);
    B5 = parseFloat(formulasData.B5.split("$")[1]);
    B6 = parseFloat(formulasData.B6.split("$")[1]);
    D5 = parseFloat(formulasData.D5.split("$")[1]);
    D6 = parseFloat(formulasData.D6.split("$")[1]);
    F5 = formulasData.F5;
    F6 = formulasData.F6;
    J12 = parseFloat(formulasData.J12.split("$")[1]);
    J13 = parseFloat(formulasData.J13.split("$")[1]);
    R3 = parseFloat(formulasData.R3.split("%")[0]);
    T11 = parseFloat(formulasData.T11.split("%")[0]);
  }
 
  //C5,C6
  var C5,dip_C5;
  C5 = B5 / A5 * 100;
  dip_C5 = Math.round((B5 / A5*1000))/10
  var C6,dip_C6;
  C6 = B6 / A6 * 100;
  dip_C6 = Math.round((B6 / A6*1000))/10
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "C", dip_C5.toString() + "%");
    $("#grid").jqxGrid('setcellvalue', 5, "C", dip_C6.toString() + "%");
  }

  //E5,E6
  var E5,dip_E5;
  E5 = (D5+B5)/((A5/0.8)) * 100;
  dip_E5 = Math.round(((D5+B5)/((A5/0.8))*1000))/10;
  var E6,dip_E6;
  E6 = (D6+B6)/((A6/0.8)) * 100
  dip_E6 = Math.round((  (D6+B6)/((A6/0.8))  *1000))/10;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "E", dip_E5.toString() + "%");
    $("#grid").jqxGrid('setcellvalue', 5, "E", dip_E6.toString() + "%");
  }

  //I5,I6
  var I5 = A5;
  var I6 = A6;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "I", "$"+A5.toString());
    $("#grid").jqxGrid('setcellvalue', 5, "I", "$"+A6.toString());
  }

  //H5,H6
  // console.log("calcData",calcData)
  var H5 = calcData.C9;
  var H6 = calcData.C9;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "H", H5.toString());
    $("#grid").jqxGrid('setcellvalue', 5, "H", H6.toString());
  }

  //I7,I8      
  var I7,dip_I7;
  I7 = I5/(1-calcData.C11);
  dip_I7 = Math.round((  I5/(1-calcData.C11)  *100))/100;
  var I8,dip_I8;
  I8 = I6/(1-calcData.C11);
  dip_I8 = Math.round((  I6/(1-calcData.C11)  *100))/100;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 6, "I", "$"+dip_I7.toString());
    $("#grid").jqxGrid('setcellvalue', 7, "I", "$"+dip_I8.toString());
  }

  //J3
  var J3;
  if(calcData.F5 == 0) J3 = 0;
  else if(calcData.F5 == 1000) J3 = 12;
  else if(calcData.F5 == 2000) J3 = 22.5;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 2, "J", J3.toString()+"%");
  }

  //J5,J6,J7,J8
  var J5,dip_J5,J6,dip_J6,J7,dip_J7,J8,dip_J8;
  if(J3 == 0) {
    if((calcData.C16/calcData.C9) < J12){
      J5 = calcData.C16/calcData.C9;
    }
    else J5 = J12;
  }
  else {
    J5 = I5/(1-J3/100);
  }
  dip_J5 = Math.round(J5 *100)/100;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "J", "$"+dip_J5.toString());
  }

  if(J3 == 0) {
    if((calcData.C16/calcData.C9) < J13){
      J6 = calcData.C16/calcData.C9;
    }
    else J6 = J13;
  }
  else {
    J6 = I6/(1-J3/100);
  }
  dip_J6 = Math.round(J6 *100)/100;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 5, "J", "$"+dip_J6.toString());
  }

  J7 = J5/(1-calcData.C11);
  dip_J7 = Math.round(J5/(1-calcData.C11)*100)/100;
  J8 = J6/(1-calcData.C11);
  dip_J8 = Math.round(J6/(1-calcData.C11)*100)/100;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 6, "J", "$"+dip_J7.toString());
    $("#grid").jqxGrid('setcellvalue', 7, "J", "$"+dip_J8.toString());
  }

  //K5,K6
  var K5,K6;
  K5=I5*H5;
  K6=I6*H6;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "K", "$"+K5.toString());
    $("#grid").jqxGrid('setcellvalue', 5, "K", "$"+K6.toString());
  }

  //L5.L6
  var L5,L6;
  L5=J5*H5;
  L6=J6*H6;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "L", "$"+Math.round(L5).toString());
    $("#grid").jqxGrid('setcellvalue', 5, "L", "$"+Math.round(L6).toString());
  }

  //M5,M6
  var M5,M6;
  if(L5-K5 > 0) M5 = L5-K5;
  else M5 = 0;
  if(L6-K6 > 0) M6 = L6-K6;
  else M6 = 0;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "M", "$"+Math.round(M5).toString());
    $("#grid").jqxGrid('setcellvalue', 5, "M", "$"+Math.round(M6).toString());
  }

  //N5,N6
  var N5,N6;
  if(J5 >= I5) N5 = B5 * H5;
  else N5 = 0;
  if(J6 >= I6) N6 = B6 * H6;
  else N6 = 0;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "N", "$"+Math.round(N5).toString());
    $("#grid").jqxGrid('setcellvalue', 5, "N", "$"+Math.round(N6).toString());
  }

  //O3 =IF(CALCULATOR!C6="Self","Y","N")
  var O3;
  if(calcData.C6 == "Self") O3 = "Y"
  else O3 = "N"
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 2, "O", O3);
  }
 
  //O5,O6 =IF(+J5>=I5,IF($O$3="Y",D5*H5,0),0)
  var O5,O6;
  if(J5>=I5){
    if(O3 == "Y") O5 = D5*H5;
    else O5 = 0;
  }else{
    O5 = 0;
  }
  if(J6>=I6){
    if(O3 == "Y") O6 = D6*H6;
    else O6 = 0;
  }else{
    O6 = 0;
  }
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "O", "$"+Math.round(O5).toString());
    $("#grid").jqxGrid('setcellvalue', 5, "O", "$"+Math.round(O6).toString());
  }

  //P5,P6
  var P5,P6,P8,dip_P8,P9,dip_P9;
  P5 = N5+O5;
  P6 = N6+O6;
  P8 = P5/H5;
  dip_P8 = Math.round(P8*100)/100;
  P9 = P6/H6;
  dip_P9 = Math.round(P9*100)/100;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "P", "$"+Math.round(P5).toString());
    $("#grid").jqxGrid('setcellvalue', 5, "P", "$"+Math.round(P6).toString());
    $("#grid").jqxGrid('setcellvalue', 7, "P", "$"+dip_P8.toString());
    $("#grid").jqxGrid('setcellvalue', 8, "P", "$"+dip_P9.toString());
  }

  //Q5,Q6
  var Q5,dip_Q5,Q6,dip_Q6;
  Q5 = P5/K5 *100;
  dip_Q5 = Math.round(Q5*10)/10;
  Q6 = P6/K6 *100;
  dip_Q6 = Math.round(Q6*10)/10;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "Q", dip_Q5.toString()+"%");
    $("#grid").jqxGrid('setcellvalue', 5, "Q", dip_Q6.toString()+"%");
  }
 
  //R5,R6 IF($J$3=0%,0,IF($J$3=12%,"$1000","$2000"))
  var R5,R6;
  if(J3 == 0) {R5 = 0;R6 = 0;}
  else{
    if(J3 == 12) {R5 = 1000;R6 = 1000;}
    else {R5 = 2000;R6 = 2000;}
  }
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "R", "$"+R5.toString());
    $("#grid").jqxGrid('setcellvalue', 5, "R", "$"+R6.toString());
  }

  //T3 =IF(CALCULATOR!$C$5="Bronze",70%,IF(CALCULATOR!$C$5="Silver",60%,50%))
  var T3;
  if(calcData.C5 == "Bronze") T3 = 70;
  else{
    if(calcData.C5 == "Silver") T3 = 60;
    else T3 = 50;
  }
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 2, "T", T3.toString()+"%");
  }

  //T12,T13 =$T$11*$M$5
  var T12,dip_T12,T13,dip_T13;
  T12 = T11/100*M5;
  dip_T12 = Math.round(T12*100)/100;
  T13 = T11/100*M6;
  dip_T13 = Math.round(T13*100)/100;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 11, "T", "$"+dip_T12.toString());
    $("#grid").jqxGrid('setcellvalue', 12, "T", "$"+dip_T13.toString());
  }

  // S5,S6 =IF(R5=0,IF(M5-R5>=T12,M5-T12,0),M5-R5)
  var S5,S6;
  if(R5 == 0){
    if(M5-R5 >= T12) S5 = M5-T12;
    else S5 = 0;
  }else{
    S5 = M5 - R5;
  }
  if(R6 == 0){
    if(M6-R6 >= T13) S6 = M6-T13;
    else S6 = 0;
  }else{
    S6 = M6 - R6;
  }
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "S", "$"+Math.round(S5).toString());
    $("#grid").jqxGrid('setcellvalue', 5, "S", "$"+Math.round(S6).toString());
  }

  //T5,T6,T8,,T9,,T15,,T16,;
  var T5,T6,T8,dip_T8,T9,dip_T9,T15,dip_T15,T16,dip_T16;
  T5 =S5*T3/100;
  T6 =S6*T3/100;
  T8=T5/H5;
  dip_T8 = Math.round(T8*100)/100;
  T9=T6/H6;
  dip_T9 = Math.round(T9*100)/100;
  T15=T5/M5;
  dip_T15 = Math.round(T15*10000)/100
  T16=T6/M6;
  dip_T16 = Math.round(T16*10000)/100
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "T", "$"+Math.round(T5).toString());
    $("#grid").jqxGrid('setcellvalue', 5, "T", "$"+Math.round(T6).toString());
    $("#grid").jqxGrid('setcellvalue', 7, "T", "$"+dip_T8.toString());
    $("#grid").jqxGrid('setcellvalue', 8, "T", "$"+dip_T9.toString());
    $("#grid").jqxGrid('setcellvalue', 14, "T", dip_T15.toString()+"%");
    $("#grid").jqxGrid('setcellvalue', 15, "T", dip_T16.toString()+"%");
  }

  //U3,U5,U6,U15,U16
  var U3,U5,U6,U15,dip_U15,U16,dip_U16;
  U3 = 100 - T3;
  U5 = S5 - T5;
  U6 = S6*(1-T3/100);
  U15 = U5/M5;
  dip_U15 = Math.round(U15*10000)/100;
  U16 = U6/M6;
  dip_U16 = Math.round(U16*10000)/100;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 2, "U", U3.toString()+"%");
    $("#grid").jqxGrid('setcellvalue', 4, "U", "$"+Math.round(U5).toString());
    $("#grid").jqxGrid('setcellvalue', 5, "U", "$"+Math.round(U6).toString());
    $("#grid").jqxGrid('setcellvalue', 14, "U", dip_U15.toString()+"%");
    $("#grid").jqxGrid('setcellvalue', 15, "U", dip_U16.toString()+"%");
  }

  //V3,V5,V6
  var V3,dip_V3,V5,V6;
  V3=0.3+(H5-5100)*0.00001
  dip_V3 = Math.round(V3*100)/100;
  V5 = V3*H5+T5;
  V6 = V3*H6+T6;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 2, "V", "$"+dip_V3.toString());
    $("#grid").jqxGrid('setcellvalue', 4, "V", "$"+Math.round(V5).toString());
    $("#grid").jqxGrid('setcellvalue', 5, "V", "$"+Math.round(V6).toString());
  }

  //W5,W6
  var W5,W6;
  W5=V5/(L5-R5) * 100;
  W6=V6/(L6-R6) * 100;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "W", Math.round(W5).toString()+"%");
    $("#grid").jqxGrid('setcellvalue', 5, "W", Math.round(W6).toString()+"%");
  }

  //X5,X6
  var X5,X6,X8,dip_X8,X9,dip_X9;
  X5 = P5+U5;
  X6 = P6+U6;
  X8 = X5/H5;
  dip_X8 = Math.round(X8*100)/100;
  X9 = X6/H6;
  dip_X9 = Math.round(X9*100)/100;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "X", "$"+Math.round(X5).toString());
    $("#grid").jqxGrid('setcellvalue', 5, "X", "$"+Math.round(X6).toString());
    $("#grid").jqxGrid('setcellvalue', 7, "X", "$"+dip_X8.toString());
    $("#grid").jqxGrid('setcellvalue', 8, "X", "$"+dip_X9.toString());
  }

  //Y5,Y6
  var Y5,Y6,dip_Y5,dip_Y6;
  Y5=(P5+U5)/(L5-R5);
  Y6=(P6+U6)/(L6-R6);
  dip_Y5 = Math.round(Y5*1000)/10;
  dip_Y6 = Math.round(Y6*1000)/10;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "Y", dip_Y5.toString()+"%");
    $("#grid").jqxGrid('setcellvalue', 5, "Y", dip_Y6.toString()+"%");
  }

  //Z5,Z6
  var Z5,Z6;
  Z5=X5/V5*100;
  Z6=X6/V6*100;
  if(authFlag){
    $("#grid").jqxGrid('setcellvalue', 4, "Z", Math.round(Z5).toString()+"%");
    $("#grid").jqxGrid('setcellvalue', 5, "Z", Math.round(Z6).toString()+"%");
  }


  //result   F7,F8,F9,F10
  var calc_F7,calc_F8,calc_F9,calc_F10;
  if(calcData.C7 == "Mission 345") calc_F7 = P5;
  else calc_F7 = P6;
  if(calcData.C17 == "Yes") calc_F7 += 500;
  if(calcData.C7 == "Mission 345") calc_F8 = U5;
  else calc_F8 = U6;
  if(calcData.C7 == "Mission 345") calc_F9 = X5;
  else calc_F9 = X6;
  if(calcData.C17 == "Yes") calc_F9 += 500;
  if(calcData.C7 == "Mission 345"){
    if(J5 >=2.9) calc_F10 = J5;
    else calc_F10="REFUSED <$2.90";
  }else{
    if(J6 >= 3.3) calc_F10 = J6;
    else calc_F10="REFUSED <$3.30";
  }
  // console.log(calc_F7,calc_F8,calc_F9,calc_F10);
  realCalcData.F7 = Math.round(calc_F7);
  realCalcData.F8 = Math.round(calc_F8);
  realCalcData.F9 = Math.round(calc_F9);
  realCalcData.F10 = Math.round(calc_F10*100)/100;
  $("#F7").val(Math.round(calc_F7));
  $("#F8").val(Math.round(calc_F8));
  $("#F9").val(Math.round(calc_F9));
  $("#F10").val(Math.round(calc_F10*100)/100);
  // var calcRef = firebase.database().ref('CALCULATOR');
  // calcRef.update({
  //   "nickname": "Amazing Grace"
  // });
}
function initial(){
  // console.log(userEmail);
  // console.log("initial function")
  firebase.firestore().collection("CALCULATOR").where("email","==",userEmail)
            .get()
            .then((querySnapshot) => {
                var docs = querySnapshot.docs;
                
                if(docs.length > 0) //update documentation
                {
                  querySnapshot.forEach((doc) => {
                    calcData.C5 = realCalcData.C5 = doc.data().C5;
                    calcData.C6 = realCalcData.C6 = doc.data().C6;
                    calcData.C7 = realCalcData.C7 = doc.data().C7;
                    calcData.C8 = realCalcData.C8 = doc.data().C8;
                    calcData.C9 = realCalcData.C9 = doc.data().C9;
                    calcData.C10 = realCalcData.C10 = doc.data().C10;
                    calcData.C11 = realCalcData.C11 = doc.data().C11;
                    calcData.C12 = realCalcData.C12 = doc.data().C12;
                    calcData.C13 = realCalcData.C13 = doc.data().C13;
                    calcData.C14 = realCalcData.C14 = doc.data().C14;
                    calcData.C15 = realCalcData.C15 = doc.data().C15;
                    calcData.C16 = realCalcData.C16 = doc.data().C16;
                    calcData.C17 = realCalcData.C17 = doc.data().C17;
                    calcData.F5 = realCalcData.F5 = doc.data().F5;
                    realCalcData.F7 = doc.data().F7;
                    realCalcData.F8 = doc.data().F8;
                    realCalcData.F9 = doc.data().F9;
                    realCalcData.F10 = doc.data().F10;
                    $("#C5").val(realCalcData.C5);
                    $("#C6").val(realCalcData.C6);
                    $("#C7").val(realCalcData.C7);
                    $("#C8").val(realCalcData.C8);
                    $("#C9").val(realCalcData.C9);
                    $("#C10").val(realCalcData.C10);
                    $("#C11").val((realCalcData.C11*100).toString()+"%");
                    $("#C12").val(realCalcData.C12);
                    $("#C13").val(realCalcData.C13);
                    $("#C14").val(realCalcData.C14);
                    $("#C15").val(realCalcData.C15);
                    $("#C16").val(realCalcData.C16);
                    $("#C17").val(realCalcData.C17);
                    $("#F5").val(realCalcData.F5);
                    $("#F7").val(realCalcData.F7);
                    $("#F8").val(realCalcData.F8);
                    $("#F9").val(realCalcData.F9);
                    $("#F10").val(realCalcData.F10);
                  })
                }
                else //add documentation
                {
                  
                }
             setTimeout(() => {
              realCalc();
             }, 500);
            })
          
}
$("#C5").change(function(){
  realCalc();
})
$("#C6").change(function(){
  realCalc();
})
$("#C7").change(function(){
  realCalc()
})
$("#C8").change(function(){
  realCalc()
})
$("#C9").change(function(){
  realCalc()
})
$("#C10").change(function(){
  realCalc()
})
$("#C11").change(function(){
  realCalc()
})
$("#C15").change(function(){
  realCalc()
})
$("#C17").change(function(){
  realCalc()
})
$("#F5").change(function(){
  realCalc()
})
function realCalc(){
  // console.log("realcalc function")
  calcData.C5 = realCalcData.C5 = $("#C5").val();
  calcData.C6 = realCalcData.C6 = $("#C6").val();
  calcData.C7 = realCalcData.C7 = $("#C7").val();
  calcData.C8 = realCalcData.C8 = $("#C8").val();
  calcData.C9 = realCalcData.C9 = parseFloat($("#C9").val());
  calcData.C10 = realCalcData.C10 = parseFloat($("#C10").val());
  calcData.C11 = realCalcData.C11 = parseFloat($("#C11").val().split("%")[0])/100;
  calcData.C15 = realCalcData.C15 = parseFloat($("#C15").val());
  calcData.C17 = realCalcData.C17 = $("#C17").val();
  calcData.F5 = realCalcData.F5 = $("#F5").val();
  //=C10-(C10*C11)
  calcData.C12 = realCalcData.C12 = realCalcData.C10-(realCalcData.C10 * realCalcData.C11);
  $("#C12").val(realCalcData.C12);
  calcData.C13 = realCalcData.C13 = 0.11 * realCalcData.C9;
  $("#C13").val(realCalcData.C13);
  calcData.C14 = realCalcData.C14 = 0;
  $("#C14").val(realCalcData.C14);
  calcData.C16 = realCalcData.C16 = realCalcData.C12-realCalcData.C13-realCalcData.C14-realCalcData.C15;
  $("#C16").val(realCalcData.C16);

  var formulasRef = firebase.database().ref('MINIFORMULAS');
  formulasRef.on('value', (snapshot) => {
  const data = snapshot.val();
  // console.log("realdata",data);

  var formulasData = {};
  formulasData.A5 = data.A5;
  formulasData.A6 = data.A6;
  formulasData.B5 = data.B5;
  formulasData.B6 = data.B6;
  formulasData.D5 = data.D5;
  formulasData.D6 = data.D6;
  formulasData.F5 = data.F5;
  formulasData.F6 = data.F6;
  formulasData.J12 = data.J12;
  formulasData.J13 = data.J13;
  formulasData.R3 = data.R3;
  formulasData.T11 = data.T11;
  // console.log(calcData,formulasData)
    calc(null,calcData,formulasData,authFlag)
    realCalcData.email = userEmail;
    firebase.firestore().collection("CALCULATOR").get().then((querySnapshot)=> {
      var docs = querySnapshot.docs;
      if(docs.length == 0)
      {
        // console.log("new");
        return firebase.firestore().collection('CALCULATOR').add(realCalcData).catch(function(error) {
          console.error('Error writing new message to database', error);
        });   
      }else{
        // console.log(userEmail,"userEmail")
        firebase.firestore().collection("CALCULATOR").where("email","==",userEmail)
              .get()
              .then((querySnapshot) => {
                  var docs = querySnapshot.docs;
                  if(docs.length > 0) //update documentation
                  {
                    firebase.firestore().collection("CALCULATOR").doc(docs[0].id).update(realCalcData).then(() => {
                        // console.log("calc Document successfully update!");
                    })
                  }
                  else //add documentation
                  {
                    // console.log("add database");
                    return firebase.firestore().collection('CALCULATOR').add(realCalcData).catch(function(error) {
                      // console.error('Error writing new message to database', error);
                    });
                  }
              })
      }
    })
  });
  
  
}


