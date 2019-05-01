Vue.component("group-list", {
    template: `
      <div class="flex">
        <div id="groupslist" style="overflow:auto;">
          <div class="accordion">
            <input type="checkbox" id="accordion-1" name="accordion-checkbox" hidden>
            <label class="accordion-header pointer" for="accordion-1">
              <i class="icon icon-arrow-right mr-1 "></i>
              Zarządzaj swoimi grupami
            </label>
            <div class="accordion-body">
              <div  v-for="group in adminGroupList">
                <a class="pointer" :class="{'active-group' : groupManagementName == group.name}" @click="manageGroup(group.name); groupNameToAddTask = '' ">{{group.name}}</a>
              </div>
              <div>
                <a v-if="availablegroups > 0" @click="makeGroupCreateView">Stwórz grupę</a>
              </div>
            </div>
          </div>
          <div class="accordion">
            <input type="checkbox" id="accordion-2" name="accordion-checkbox" hidden>
            <label class="accordion-header pointer" for="accordion-2">
              <i class="icon icon-arrow-right mr-1"></i>
              Grupy do których należysz
            </label>
            <div class="accordion-body">
              <div v-for="group in grouplist">
                <a class="pointer" :class="{'active-group' : groupNameToAddTask == group.name}" @click="getGroupTasks(group.name); groupManagementName = '' ">{{group.name}}</a><i class="fas fa-crown" v-if="group.admin == true" style="margin-left: 5px;"></i>
              </div>
            </div>
          </div>
        </div>

        <div id="grouptasks" v-if="groupManagmentView == ''">
          <tdo-table :todolist="grouptasks" :sort="sort" :changepagesignal="changepagesignal" :search="search"></tdo-table>
          <div>
            <button class="add-button pointer"><i class="fas fa-plus text-primary" @click="setGroupAddingTaskView"><span class="text-primary">Dodaj zadanie</span></i></button>
          </div>
        </div>

        <div  id="grouptasks" v-if="groupManagmentView == 'create'">
          <div class="form-group">
            <label class="form-label" for="input-example-1">Nazwa grupy</label>
            <input class="form-input" type="text" id="input-example-1" placeholder="Name" v-model="groupName">
            <label class="form-label" for="input-example-3">Opis grupy</label>
            <textarea class="form-input" id="input-example-3" placeholder="Textarea" rows="3" v-model="groupDescription"></textarea>
            <label class="form-label" for="input-example-1">Wybierz użytkowników, których chcesz zaprosić do swojej grupy</label>
            <div class="flex">
              <div style="width:50%">
                <select class="form-select" v-model="userChosen">
                  <option disabled>Wybierz użytkownika</option>
                  <option v-for="user in usersList" :disabled="usersChosen.length >=5">{{user}}</option>
                </select><br>
                <button @click="addCoUser" class="add-button main-color add-user-button"  ><i class="fas fa-user-plus" ></i><span style="margin-left:2%">Dodaj użytkownika</span></button>
              </div>
              <div class="flex" style="width:50%; margin-left: 3%">
                <div style="width: 50%">
                  <span class="chip" v-for="(user, index) in usersChosen.slice(0,3)" >{{user}}
                  <a class="btn btn-clear" aria-label="Close" role="button" :id="user" @click="removeCoUser($event)"></a>
                  </span>
                </div>
                <div style="width: 50%">
                  <span class="chip" v-for="(user, index) in usersChosen.slice(3,5)" >{{user}}
                  <a class="btn btn-clear" aria-label="Close" role="button" :id="user" @click="removeCoUser($event)"></a>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="create-group-button-div main-color">
              <button class="btn create-group-button" @click="getGroupDetails()">Stwórz grupę <i class="fas fa-tasks"></i></button>
          </div>
        </div>

         <div  id="grouptasks" v-if="groupManagmentView == 'manage'">
          <div>Użytkownicy: {{userGroupCounter}}/5 <i class="fas fa-user-plus pointer" v-if="userGroupCounter < 5" @click="addUserMode = true"></i></div>

            <div class="form-style">
              <div class="flex">
                <div v-for="user in groupUsers">
                  <span class="chip">
                  {{user}}
                  <a  class="btn btn-clear" aria-label="Close" role="button" @click="removeUser($event)" :id="user"></a>
                </span>
                </div>
              </div>

              <div class="flex" style="width:20%;" v-if="addUserMode == true">
                  <div>
                     <select class="form-select" v-model="userChosen">
                      <option disabled>Wybierz użytkownika</option>
                      <option v-for="user in usersList">{{user}}</option>
                    </select>
                  </div>
                  <div class="pointer" style="font-size:1.5em;padding-left: 5px;" @click="addUser()"><i class="fas fa-plus"></i></div>
              </div>
            </div>

            <div>
              <div>
                <label class="form-label" for="input-example-3">Opis grupy</label>
                <textarea class="form-input" id="input-example-3" :placeholder="groupDescription2" rows="5" style="resize: none;" v-model="groupDescription2"></textarea>
              </div>
            </div>
            <div class="form-style" style='margin-top: 10%;'>
              <div style='width:50%;'>
                <button class="btn" style = "width:100%" @click="updateDescription">Aktualizuj opis</button>
              </div>
              <div>
                  <button class="add-button pointer" @click="removeGroup"><span style="padding-right: 5px;">Usuń grupę</span> <i class="fas fa-trash" style="color: #e0415e;"></i></button>
              </div>
            </div>
          </div>
      </div>

    `,
    props: ["grouplist", "grouptasks", "changepagesignal", "sort", "availablegroups", "search", "user"],
    data: function(){
      return {
        adminGroupList: [],
        groupManagmentView: '',
        dataBase: firebase.firestore(),
        usersList: [],
        userChosen: '',
        usersChosen: [],
        groupName: '',
        groupDescription: '',
        groupDescription2: '',
        groupUsers: [],
        userGroupCounter: 0,
        addUserMode: false,
        groupManagementName: '',
        groupNameToAddTask: '',
        

      }
    },
    computed:{
      //pobranie listy do, których użytkownik ma prawa administratora
      makeAdminList: function(){ 
        this.adminGroupList = this.grouplist.filter( group => group.admin == true)
      },
      
    },
    methods:{
      //pobranie zadań grupy po kliknięciu
      getGroupTasks: function(name){
        this.groupNameToAddTask = name;
        Event.askForGroupTasks(name)
        this.groupManagmentView = ""
      },
      //uruchomienie widoku tworzenia grupy
      makeGroupCreateView: function(){

        this.groupManagmentView = "create"
        this.getAllUsers();
      },
      //dodanie użytkownika do grupy podczas jej tworzenia
      addCoUser: function(){
        if(this.userChosen != ''){
          this.usersChosen.push(this.userChosen)
          this.usersList.splice(this.usersList.indexOf(this.userChosen), 1)
        }else{
          alert("Wybierz użytkownika")
        }
      },
      //usunięcie wybranego użytkownika
      removeCoUser: function(event){
        this.usersList.push(event.currentTarget.id)
        this.usersChosen.splice(this.usersChosen.indexOf(event.currentTarget.id), 1)
      },
      //pobranie wszystkich użytkowników
      getAllUsers: function(){
        this.usersList = [];
        this.dataBase.collection(`Users`).get().then((querySnapshot) => {
          querySnapshot.forEach(doc => {
            this.usersList.push(doc.data().name)
          })
        })
      },
      //pobranie danych potrzebnych do stworzenia grupy
      getGroupDetails: function(){
        if(this.groupName == '' || this.groupDescription == ''){
          alert("Nazwa i opis grupy muszą być wypełnione")
        }else{
          Event.sendGroupDetails(this.groupName, this.groupDescription, this.usersChosen)
        }
      },
      //stworzenie widoku zarządzania grupą
      manageGroup: function(name){
        this.groupManagementName = name;
        this.groupManagmentView = "manage"
        this.groupUsers = []
        this.userGroupCounter = 0
        this.addUserMode = false
        this.userChosen = ''
        this.getAllUsers()
        this.dataBase.collection(`Groups/${name}/Users`).get().then((querySnapshot) => { 

          querySnapshot.forEach(doc =>{
           if(doc.data().name != this.user){
              this.groupUsers.push(doc.data().name)
              this.userGroupCounter++
           }
          })
          this.getGroupDescription(name);
        })

      },
      getGroupDescription: function(name){
        this.dataBase.collection(`Groups/${name}/Config`).doc('config').get().then((querySnapshot) => { 
            this.groupDescription2 = querySnapshot.data().description
        })
      },
      //dodanie użytkownika z widoku zarządzania grupą
      addUser:function(){

        // if(this.groupUsers.includes(this.userChosen))
          this.dataBase.collection(`Groups/${this.groupManagementName}/Users`).doc(`${this.userChosen}`).set({
            name: this.userChosen
           }, { merge: true })

          this.dataBase.collection(`${this.userChosen}/Groups/groups`).doc(`${this.groupManagementName}`).set({
            admin: false,
            name: name
           })

          this.groupUsers.push(this.userChosen)
          this.userGroupCounter ++;
      },
      removeUser: function(event){
          this.groupUsers.splice(this.groupUsers.indexOf(event.currentTarget.id), 1)
          this.userGroupCounter --;

          this.dataBase.collection(`Groups/${this.groupManagementName}/Users`).doc(event.currentTarget.id).delete().then(function() {
              console.log("Document successfully deleted!");
          }).catch(function(error) {
              console.error("Error removing document: ", error);
          });

           this.dataBase.collection(`${event.currentTarget.id}/Groups/groups`).doc(this.groupManagementName).delete().then(function() {
              console.log("Document successfully deleted!");
          }).catch(function(error) {
              console.error("Error removing document: ", error);
          });
      },
      updateDescription: function(){
        this.dataBase.collection(`Groups/${this.groupManagementName}/Config`).doc(`config`).update({
          description: this.groupDescription2
        })
        .then(function() {
            console.log("Document successfully updated!");
        });
      },
      removeGroup: function(){
        this.groupUsers.forEach(user => {
          this.dataBase.collection(`${user}/Groups/groups`).doc(this.groupManagementName).delete()
        })

        this.dataBase.collection(`Groups`).doc(this.groupManagementName).delete()
        this.dataBase.collection(`${this.user}/Groups/groups`).doc(this.groupManagementName).delete()

        this.groupManagmentView = ""
        Event.removeGroup()
      },
      //emisja zdarzenia i przekazanie danych potrzebnych do dodania zadania do grupy
      setGroupAddingTaskView: function(){
        Event.addGroupTask('add-task', 'group', this.groupNameToAddTask)
      }

      
    },
    watch:{
        userGroupCounter: function(){
          if(this.userGroupCounter == 5) this.addUserMode = false
        }
    },
    created(){
      this.makeAdminList
      
    }
   })