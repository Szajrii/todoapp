const config = {
	    apiKey: "AIzaSyDG9Dl_QK1We2nGUZtr9qvsF0tmBLP2znU",
	    authDomain: "todoapp-e077a.firebaseapp.com",
	    databaseURL: "https://todoapp-e077a.firebaseio.com",
	    projectId: "todoapp-e077a",
	    storageBucket: "todoapp-e077a.appspot.com",
	    messagingSenderId: "922772029794"
	  };
  firebase.initializeApp(config);
  // var userName = firebase.auth().currentUser.displayName;

	new Vue ({
		el: "#app",
		data: {
			toDoList: [],
			dataBase: firebase.firestore(),
			archivesList : [],
			view: "tdo-table",
			view2: '',
			secondaryView: '',
			secondaryView2: '',
      secondaryView3: '',
			lastIndex: 0,
			lastIndexArray: [],
			activeDetails:{},
			search: '',
			changePageSignal: '',
			pagesView: {
				currentPage: 0,
				numberOfPages: 0
			},
      user: '',
      lvl: 0,
      numberOfAvailableGroups: 0,
      groupList: [],
      groupTasks: [],
      viewCondition: '',
      groupNameToAddTask: '',
      groupNameToRemoveTask: '',
      modal: 'none'
			
			
		},
		methods: {
			
			getData: function(){
				this.toDoList = [];
				this.lastIndexArray = [];
				this.lastIndex = 0;
				this.archivesList = [];
				this.dataBase.collection(`${this.user}/Tasks/tasks/`).get().then((querySnapshot) => {
					
		   			querySnapshot.forEach( (doc) => {

		   			includeMetadataChanges: true

			   			const data = {
			   				'id': doc.data().id,
			   				'name': doc.data().name,
			   				'description': doc.data().description,
			   				'day': doc.data().day,
			   				'month': doc.data().month,
			   				'year': doc.data().year,
			   				'currentDay': doc.data().currentDay,
			   				'currentMonth': doc.data().currentMonth,
			   				'currentYear': doc.data().currentYear,
			   				'currentDate': doc.data().currentDate,
			   				'status': doc.data().status

			   			}
			   			this.lastIndexArray.push(data.id)

			   			if(data.status == 'inprogress'){
			   				if(new Date().getTime() > new Date(data.year, data.month, data.day).getTime() ){
			   					this.dataBase.collection(this.name).doc(`task${data.id}`).update({
			   						'status': 'expired'

			   					})
			   					this.archivesList.push(data)
			   				}else{
			   				this.toDoList.push(data)
			   				}
			       			
			       		}else{
			       			this.archivesList.push(data)
			       		}

			       		if(this.lastIndexArray.lenght == 0 || this.lastIndexArray.includes(NaN) || this.lastIndexArray.includes(undefined)){
		   					this.lastIndex = 0;
		   				}else{
		   				this.lastIndex = parseInt(Math.max(...this.lastIndexArray)) 
		   				}	

				  	  	});
		   				
		   			
				});
				
         return new Promise(function(succes, fail){})
			
			},
			render: function(){
				this.getData()
			},
			addTaskView: function(){
				this.secondaryView = "add-task"
			},
			addTask: function(args){
        
        if(this.viewCondition != 'group'){
          if(this.lastIndex == "NaN"){this.lastIndex = 0}
  				this.dataBase.collection(this.user).doc(`Tasks/tasks/task${this.lastIndex + 1}`).set({
  					  id: this.lastIndex + 1,
  				    name: args[0],
  				    description: args[1],
  				    day: args[2],
  				    month: args[3],
  				    year: args[4],
  				    currentDay: new Date().getDate(),
  				    currentMonth: new Date().getMonth(),
  				    currentYear: new Date().getFullYear(),
  				    currentDate: new Date().getTime(),
  				    status: 'inprogress',

  				    
  				})
  				.then( () => {
  				    console.log("Document successfully written!");
  				    this.getData();
  				    this.view = "tdo-table";
  				    this.secondaryView = '';
              this.secondaryView3 = '';
              this.viewCondition = '';
  				    
  				})
  				.catch( (error) => {
  				    console.error("Error writing document: ", error);
  				});

        }else{
          let random = Math.random()
          this.dataBase.collection(`Groups/${args[2]}/Tasks`).doc(`task${random}`).set({
            name: args[0],
            description: args[1],
            addBy: this.user,
            id: random
          })
          .then( () => {
              console.log("Document successfully written!");
              this.secondaryView = '';
              this.secondaryView3 = '';
              this.viewCondition = '';
              this.getGroupTasks(args[0])
              
          })
          .catch( (error) => {
              console.error("Error writing document: ", error);
          });
        }


			},
			addDetailsView: function(list){
				this.activeDetails = list;
				this.secondaryView = "task-details"
        this.groupNameToRemoveTask = ''

			},
			removeTask: function(id){
        if(this.groupNameToRemoveTask == ''){
  				this.dataBase.collection(this.user).doc(`Tasks/tasks/task${id}`).delete().then( () => {
  				    console.log("Document successfully deleted!");
  				    
  				}).catch( (error) => {
  				    console.error("Error removing document: ", error);
  				});
  				this.getData();
        }else{
          this.dataBase.collection(`Groups/${this.groupNameToRemoveTask}/Tasks`).doc(`task${id}`).delete().then( () => {
              console.log("Document successfully deleted!");
              this.getGroupTasks(this.groupNameToRemoveTask)
              
          }).catch( (error) => {
              console.error("Error removing document: ", error);
          });
        }
			},
			closeModalView: function(secondaryview){
				this.secondaryView = '';
        this.secondaryView3 = '';
        this.viewCondition = '';
			},
			setArchivesView: function(){
				this.view2 = "tdo-table";
				this.view = '';
				this.secondaryView2 = "all"
				this.search = ""
        this.groupNameToRemoveTask = ''

			},
			setTdoView: function(){
				this. view = 'tdo-table';
				this.view2 = '';
				this.secondaryView2 = ""
				this.search = ""
        this.groupNameToRemoveTask = ''
			},
      setGroupView: function(){
        this.view = "group-list";
        this.view2 = '';
        this.secondaryView2 = ""
        this.search = ""
        this.groupNameToRemoveTask = ''
      },
			updateData: function(newData, id){
				this.dataBase.collection(this.user).doc(`Tasks/tasks/task${id}`).update({
			   		'name': newData[0],
			   		'description': newData[1],
			   		'status': newData[2]

			   	})
			   	this. view = 'tdo-table';
				  this.view2 = '';
			   	this.getData()
			},
			changePage(id){
				this.changePageSignal = ''
				if(id.currentTarget.id == "previous"){
					
					this.changePageSignal = 'previous' + Math.random();
					
				}else if(id.currentTarget.id == "next"){
					
					this.changePageSignal = 'next' + Math.random();
					
				}else{}


				
			},
			pageChanged: function(currentPage, numberOfPages){
				
				this.pagesView.currentPage = currentPage;
				this.pagesView.numberOfPages = numberOfPages;						
			},
      getGroups: function (){

          this.groupList = []
          this.dataBase.collection(`${this.user}/Groups/groups/`).get().then((querySnapshot) => {
          
            querySnapshot.forEach( (doc) => {
              const data = {
                name: doc.data().name,
                admin: doc.data().admin
              } 
              this.groupList.push(data)
            })
          })
      },
       getGroupTasks: function(name){
         this.groupNameToRemoveTask = name;
         this.groupTasks = []
         this.dataBase.collection(`Groups/${name}/Tasks/`).get().then((querySnapshot) => {
              querySnapshot.forEach( (doc) => {

                const data = {
                  id: doc.data().id,
                  name: doc.data().name,
                  description: doc.data().description,
                  addBy: doc.data().addBy
                }
                this.groupTasks.push(data);
              })
         })
      },
      createGroup: function (name, description, users){
        let usersToUpdate = {}
        users.forEach(user => {
           this.dataBase.collection(`Groups/${name}/Users`).doc(`${user}`).set({
            name: user
           }, { merge: true })

           this.dataBase.collection(`${user}/Groups/groups`).doc(`${name}`).set({
            admin: false,
            name: name
           })
        })

        this.dataBase.collection(`${this.user}/Groups/groups`).doc(`${name}`).set({
            admin: true,
            name: name
        })

        this.dataBase.collection(`Groups/${name}/Users`).doc(`${this.user}`).set({
            name: this.user
        }, { merge: true })

        this.dataBase.collection(`Groups/${name}/Config`).doc(`config`).set({
            name: name,
            description: description
        })
       
      },
      addGroupTask: function(view, condition, name){
        this.secondaryView3 = view;
        this.viewCondition = condition;
        this.groupNameToAddTask = name
      },
      logOut: function(){
        firebase.auth().signOut().then(function() {
          window.location.href = "/.."
        }).catch(function(error) {
          // An error happened.
        });
      }
		},
    computed:{
      getUserLvl: function(){
        this.dataBase.collection(`${this.user}`).doc('config').get().then((querySnapshot) => {
            this.lvl = querySnapshot.data().lvl
            return new Promise(function(succes, fail){})
          })
      },
      setUser: function(){
        var user = firebase.auth().currentUser;
        this.user = user.displayName
        this.getUserNumberOfAvailableGroups;
            // querySnapshot.forEach( (doc) => {
        return new Promise(function(succes, fail){})
      },
      getUserNumberOfAvailableGroups: function(){
        this.dataBase.collection(`${this.user}`).doc('config').get().then((querySnapshot) => {
            this.numberOfAvailableGroups = querySnapshot.data().availableGroups;
          })
      },
     
    },
		created(){
      // this.setUser();
      firebase.auth().onAuthStateChanged( (user) => {

        if(user){
          this.setUser.then(this.getUserLvl).then(this.getData()).then(this.getGroups())
        }else{}
      })

			// this.getData()
			Event.$on("addTask", this.addTask);
			Event.$on("addDetailsView", this.addDetailsView);
			Event.$on('removeTask', this.removeTask);
			Event.$on('closeModalView', this.closeModalView);
			Event.$on('updateData', this.updateData);
			Event.$on('pageChanged', this.pageChanged);
      Event.$on('groupTasksRequest', this.getGroupTasks);
      Event.$on('groupRequest', this.createGroup)
      Event.$on('removeGroup',this.getGroups)
      Event.$on('addGroupTask', this.addGroupTask)
		

		},
				
	})