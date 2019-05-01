const config = {
	    apiKey: "AIzaSyDG9Dl_QK1We2nGUZtr9qvsF0tmBLP2znU",
	    authDomain: "todoapp-e077a.firebaseapp.com",
	    databaseURL: "https://todoapp-e077a.firebaseio.com",
	    projectId: "todoapp-e077a",
	    storageBucket: "todoapp-e077a.appspot.com",
	    messagingSenderId: "922772029794"
	  };
 	 firebase.initializeApp(config);

 	 new Vue ({
 	 	el: '#app',
 	 	data: {
 	 		view: 'login',
 	 		email: '',
 	 		password: '',
 	 		name:'',
 	 		dataBase: firebase.firestore(),
 	 	},
 	 	methods: {
 	 		makeRegisterView: function(){
 	 			this.view = 'register'
 	 		},
 	 		registerUser: function(){
 	 			firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(	() => {
				

 	 			//Jeśli użytkownik się zarejestruje pomyślnie to dodaj do bazy jego config
				this.dataBase.collection(this.name).doc(`config`).set({
			   	name: this.name,
			   	xp: 50,
			   	lvl: 1,
			   	numberOfGroups: 0,
			   	availableGroups: 1,
			   	dailyXpAssigned: true,
			   	lastDailyXpDate: [new Date().getDay(),new Date().getDate(),new Date().getFullYear()],
			   	numberOfActiveTasks: 0,
			   	numberOfArchivedTasks: 0,
			   	numberOfDoneTasks: 0,
			   	numberOfUndoneTasks: 0	   		

				   	})
					.then(() => {
						this.dataBase.collection('Users').doc(this.name).set({
							name: this.name
						}).then(function(){}).catch(function(error){})
						    console.log("Document successfully written!");
						})
					.catch(function(error) {
						    console.error("Error writing document: ", error);
						});

				// window.location.href = 'app/index.html'
				firebase.auth().onAuthStateChanged( (user) => {
				  if (user) {
				    user.updateProfile({
					  displayName: this.name
					  
					}).then(function() {
					  window.location.href = "/app"
					}).catch(function(error) {
					  // An error happened.
					});
					// setTimeout(() =>{
					// 	window.location.href = "app/index.html"
					// },1000)
				  } else {
				    // No user is signed in.
				  }

				});
 	 			}).catch(function(error) {
			 	// Handle Errors here.
			 	
				  var errorCode = error.code;
				  var errorMessage = error.message;
				  console.log(errorCode)
							
				
			});

 	 			

 	 		},
 	 		loginUser:function(){
 	 			firebase.auth().signInWithEmailAndPassword(this.email, this.password).then( () =>
 	 			{
 	 				// firebase.auth().onAuthStateChanged( (user) => {
 	 				// 	if(user){window.location.href = "app/index.html"}else{}
 	 				// })
 	 				window.location.href = "app/index.html"
 	 			})
 	 			.catch(function(error) {
				  // Handle Errors here.
				  var errorCode = error.code;
				  var errorMessage = error.message;

				  // ...
				});
 	 		}
 	 	}

 	 })