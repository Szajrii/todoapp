Vue.component("task-details",{

   		template:`

			<div class="modal active" id="modal-id">
			  <a class="modal-overlay" aria-label="Close" @click="closeModalView"></a>
			  <div class="modal-container"  >
			    <div class="modal-header">
			      <a class="btn btn-clear float-right" aria-label="Close" @click="closeModalView"></a>
			      <template v-if="!editMode">
			      <div class="modal-title h5">{{activedetails.name}}</div>
			      </template>
			      <template v-if="editMode">
			      <input class="form-input" style="width: 40%" type="text" :placeholder="activedetails.name" v-model="newData[0]">
			      </template>
			    </div>
			    <div class="modal-body" >
			      <div class="content">

					<div >
		   				<div class="form-style">
		   					<template v-if="!editMode">
							<div class="details-description s-rounded">{{activedetails.description}}</div>
							</template >

					
							<template  v-if="editMode">
							<textarea class="form-input details-description" :placeholder="activedetails.description" rows="3" v-model="newData[1]"></textarea>
							</template>
							<div class="details-date">
              <template v-if='condition != "group-list"'>
								<div>Dodano: </div>
								<div style="font-style: italic;">{{activedetails.currentDay}}/{{months[activedetails.currentMonth]}}/{{activedetails.currentYear}}</div>
              </template>
              <template v-else>
                <div>Dodał:</div>
                <div >{{activedetails.addBy}}</div>
              </template>
							</div>
						</div>


						<br>
						<div class="div-border"></div>
						<br>
          <template v-if="condition !='group-list'">
						<div class="form-style">
							<div>
								<div>Planowana data zakończenia: </div>
								<div style="font-style: italic; font-weight: bold;">{{activedetails.day}}/{{months[activedetails.month]}}/{{activedetails.year}}</div>
							</div>
							<div >
								<div>Pozostało: </div>
                                <div v-if = "time <= 259200000 && time >= 0">{{counterHours}} godzin {{counterMinutes}} minut {{counterSeconds}} sekund  </div>
                                <div v-if = "time > 259200000">{{remainingTime}}</div>
                                <div  v-if = "time < 0">Zadanie nieaktywne</div>
							</div>
							
						</div>
						<br>
						<div class="progress-div">
							<progress style="width: 100%;" class="progress" :value="progress" :max="max"></progress>
						</div>
						<br>
						<div>
							<div class="form-style">
								<div>
									<div>Status: </div>
									<div>{{getStatus}}</div>
								</div>

								<div  v-if="editMode">
									<div></div>
									<div class="form-group">
									  <select class="form-select" v-model="newData[2]">
									    <option disabled selected>Wybierz opcje</option>
									    <option value="done">Zadanie ukończone</option>
									    <option value="failed">Zadanie niewyokane</option>
									    <option value="inprogress">W trakcie</option>
									  </select>
									</div>
								</div>
							</div>
						</div>
							
					</template> 
					</div>
			        
			      </div>

			    </div>
            
			    <div class="modal-footer">
			    	
			      	<button style="background-color: #5755d9;" @click="editMode = !editMode" v-if="!editMode && activedetails.status == 'inprogress'">
			      		<i  style="color: white" class="fas fa-edit"></i>
			      	</button>
				    <button style="background-color: green;" @click="updateData" v-if="editMode"><i class="fas fa-check" style="color: white"></i></button>

		    	</div>
				    
			  </div>
			</div>

   			

   		`,
   		props: ["activedetails", "secondaryview", "condition"],
   		data: function(){
   			return{
   				months: ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca", "Lipca", "Sierpnia", "Września", "Października", "Listopada", "Grudnia"],
   				progress: 0,
   				max: 0,
   				time: 0,
   				counterHours: 0,
   				counterMinutes: 0,
   				counterSeconds: 0,
   				timerSignal: this.secondaryview,
   				editMode: false,
   				newData: ['','','Wybierz opcje']
   			}
   		},
   		computed:{
        //obliczenie pozostałego czasu
   			remainingTime: function	(){
   				let currentDate = new Date().getTime();
   				let addDate = this.activedetails.currentDate;
   				let expireDate = new Date(this.activedetails.year, this.activedetails.month, this.activedetails.day).getTime();
   				
   				// this.max = ( ( addDate - currentDate ) / ( expireDate - addDate ) ) * 100;
   				this.max = expireDate - addDate
   				this.progress =  currentDate - addDate
   				this.time = this.max - this.progress
   				
   				let year = Math.floor((expireDate - currentDate) / 1000 / 60 / 60 / 24 / 365) 
   				let month = Math.floor((expireDate - currentDate) / 1000 / 60 / 60 / 24 / 30)
   				let day = Math.floor((expireDate - currentDate) / 1000 / 60 / 60 / 24)
   				
   				
   				if( year  >= 2 ) {
   					return	`Ponad ${year} lat/a`
   				}else if( year == 1) {
   					return	`Ponad ${year} rok`	
   				}else if (month	> 1){
   					return `Ponad ${month} miesiące/y`
   				}else if(month == 1){
   					return `Ponad miesiąc`
   				}else {
   					return	`Pozostało	${day} dni`	
   				}

   				
   			},
        //status zadania
   			getStatus: function(){
   				if(this.activedetails.status == "inprogress"){
   					return 'W trakcie'
   				}else if(this.activedetails.status == 'expired'){
   						return 'Czas minął'
   					}else if(this.activedetails.status == 'failed'){
   						return 'Nie wykonano zadania'
   					}else if(this.activedetails.status == 'done'){
   						return 'Wykonano pomyślnie'
   					}
   					
   				
   			}

   		},
   		methods:{
   			closeModalView: function(){
  				
  				Event.closeModalView(this.secondaryview);
  				
  				this.timerSignal = ""
  			},
        //timer pokazujący czas w minutach jeśli zostało mniej niż 3 dni do wykonania zadania
  			timer: function (){

                	let currentDate = new Date().getTime();
                    let addDate = this.activedetails.currentDate;
                    let expireDate = new Date(this.activedetails.year, this.activedetails.month, this.activedetails.day).getTime();
                    
                    // this.max = ( ( addDate - currentDate ) / ( expireDate - addDate ) ) * 100;
                    this.max = expireDate - addDate
                    this.progress =  currentDate - addDate
                    this.time = this.max - this.progress


                    this.counterHours = Math.floor( (this.time   / 3600000));
                    this.counterMinutes = Math.floor( (this.time % 3600000)  / 60000);
                    this.counterSeconds = Math.floor( (this.time % 60000)  / 1000);

                    if(this.timerSignal	 == "task-details"){
                    	if(this.time < 259200000 && this.time >= 0){
                    		setTimeout(this.timer, 1000)
                    	}
                	}

            },
        //aktualizacja danych zadania
        updateData: function(){
        	if(this.newData[0] != undefined && this.newData[0] != "" && this.newData[1] != undefined && this.newData[1] && this.newData[2] != undefined && this.newData[2] && this.newData[2] != "Wybierz opcje" ){
        		Event.updateData(this.newData, this.activedetails.id);
        		this.closeModalView();
        	}else{
        		alert("Wszystkie pola muszą być uzupełnione")
        	}
        }
  			
  			

   		},
   		created(){
   			this.timer();
   		}
   		

   })