Vue.component("tdo-data", {
		template: `
			<tr>
				<td >{{ index + 1 }}.</td>
				<td>{{ list.name }}</td>
				<td>
					<button class="bg-primary pointer" @click="addDetailsView(list)"><i class="far fa-eye" ></i></button>
				</td>
				<td>
					<button class="bg-error pointer" @click="removeTask(list.id)"><i class="fas fa-trash-alt" ></i></button>
				</td>
			</tr>
		`,
		data: function(){
			return{
				descriptionView: "task-details" 
			}
		},
		props:["list", "index"],
		methods:{
			//uruchomienie szczegółów zadania
			addDetailsView: function(list){
				Event.addDetailsView(list);
			},
			removeTask: function(id){
				Event.removeTask(id);
			}
		}
	})