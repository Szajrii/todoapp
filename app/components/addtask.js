Vue.component("add-task", {
  		template:`
  			<div class="modal" id="modal-id" :class="{active: secondaryview == 'add-task'}">
			  <a class="modal-overlay" aria-label="Close" @click="closeModalView"></a>
			  <div class="modal-container">
			    <div class="modal-header">
			      <a class="btn btn-clear float-right" aria-label="Close" @click="closeModalView"></a>
			      <div class="modal-title h5">Dodaj zadanie</div>
			    </div>
			    <div class="modal-body">

				    <div class="content">
				        <div class="form-group">
	  					<div class="form-style">
			  			  	<div class="form-name-style">
							  	<label class="form-label" >Nazwa zadania</label>
							  	<input class="form-input" type="text" placeholder="Np. Zakupy" v-model="name">
						  	</div>
					  	<div class="form-select-style" v-if="viewcondition !='group'">
						  	<label class="form-label">Wybierz date zakończenia</label>
						  	<div class="form-style">	
							  	<select class="form-select" id="form-day" v-model="day">
							  		<option disabled>Dzień</option>
							    	<option v-for="i in 31">{{i}}</option>
							  	</select>
							  	<select class="form-select" id="form-month" v-model="month">
							  		<option disabled>Miesiąc</option>
							    	<option v-for="month in months" >{{month}}</option>
							  	</select>
							  	<select class="form-select" id="form-year" v-model="year">
							  		<option disabled>Rok</option>
							    	<option v-for="item in loopRange(2019, 2070)">{{item}}</option>
							  	</select>
							</div>
					  	</div>
					</div>

					<label class="form-label" >Szczegółowy opis zadania</label>
		 			  	<textarea class="form-input" placeholder="Kupić parówki i proszek do prania bo inaczej żona mnie zabije" rows="3" v-model="description"></textarea>
		 			<br>

	 			    <div class="confirm-button-div" @click="addTask">
						<button  class="bttn-gradient bttn-lg bttn-success confirm-button">
							<i class="fas fa-plus text-dark"><span class="text-dark">Dodaj zadanie</span></i>
						</button>
					</div>
 			  
				</div>
			   </div>
			  </div>

			    <div class="modal-footer">
			    
			    </div>
			  </div>
			</div>
  			
  		`,
  		props: ["secondaryview", 'viewcondition','groupname'],
  		data: function(){
  			return{
  				months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
  				name: "",
  				description: "",
  				day: "Dzień",
  				month: "Miesiąc",
  				year: "Rok"
  				
  			}
  		},
  		methods:{
  			loopRange:function(min, max){
  				let arr = []
  				for (let i = min; i <= max; i++){
  					arr.push(i)
  				}
  				return arr 
  			},
  			addTask: function(){
  				if(this.viewcondition != 'group'){
    				if(this.day != "Dzień" && this.month != "Miesiąc" && this.year != "Rok" && this.name != "" && this.description != ""){
    					Event.addTask(this.name, this.description, this.day, this.months.indexOf(this.month), this.year)
    				}else{
    					alert("uzupełnij wszystkie pola!")
    				}
         		 }else{
		            if(this.name != "" && this.description != ""){
		              Event.addTask(this.name, this.description, this.groupname)
		            }else{
		              alert("uzupełnij wszystkie pola!")
		            }
		         }
  				

  			},
  			closeModalView: function(){
  				
  				Event.closeModalView(this.secondaryview);
  			}
  		},

  	})