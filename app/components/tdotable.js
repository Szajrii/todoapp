Vue.component("tdo-table",{
		template: `
			<table class="table table-striped table-hover">
					<thead>
						<tr>
							<th style="width: 5%;">Lp. </th>
							<th >Nazwa zadania</th>
							<th>Podgląd</th>
							<th>Usuń</th>
						</tr>
					</thead>
					<tbody>
						<tdo-data v-for="(list, index) in newArray" :key="index" :list="list" :index="index"></tdo-data> 
					</tbody>
				
			</table>
		`,
		data: function(){
			return {
				newArray: [],
				tempArray: [],
				numberOfPages: 0,
				currentPage: 0,
				tempChangePage: ''
			}
		},
		props: ["todolist", "sort", "search", "changepagesignal"],
		methods:{
			//przefiltrowanie zadań ze względu na status (aktwne/nieaktywne)
			arrayFilter: function(){
				this.newArray = this.tempArray.filter(list =>{
					if(this.sort == 'done'){
						return list.status == "done"
					}else if(this.sort == 'undone'){
						return list.status == "expired" || list.status == "failed"
					}else if(this.sort == 'all' || this.sort == ""){
						return list
					}
				})
			},
			//wyszukiwanie zadania
			searchName:function(){
				let listLowerCase, searchLowerCase;
				this.newArray = this.tempArray.filter( list => {

					listLowerCase = list.name.toLowerCase();
					searchLowerCase = this.search.toLowerCase();
					return listLowerCase.includes(searchLowerCase)

				})
			},
			//stworzenie widoku z podziałem na strony (5 zadań na 1 stronie)
			makePageView: function(){
				if(this.tempArray.length > 5){
					this.numberOfPages = Math.ceil(this.tempArray.length / 5)
					this.newArray = this.newArray.slice(this.currentPage * 5, (this.currentPage * 5) + 5)
					
				}else{
					this.numberOfPages = 1;
					
				}
				Event.pageChanged(this.currentPage, this.numberOfPages)
			},
			//zmiana strony
			changePage: function(){

				this.tempChangePage = this.changepagesignal
				if(this.tempChangePage.includes('previous')){
					if(this.currentPage > 0){
						this.currentPage --
						
					}
				}else if(this.tempChangePage.includes('next')){
					if(this.currentPage < this.numberOfPages - 1){
						this.currentPage ++
						
					}
				}
				
				Event.pageChanged(this.currentPage, this.numberOfPages)
			},
			
		},
		watch:{
			//nasłuchiwanie na zmiane hasła do wyszukania
			sort: function(){
				this.tempArray = this.todolist;
				this.arrayFilter();
				this.tempArray = this.newArray;
				this.currentPage = 0
				this.makePageView();
				
			},
			//nasłuchiwanie na zmiany w tablicy z zadaniami
			todolist: function(){
				this.tempArray = this.todolist;
				this.arrayFilter();
				this.tempArray = this.newArray;
				this.numberOfPages = 0
				this.makePageView();
			},
			search: function(){
				this.searchName();

			},
			//nasłuchiwanie na zmiane strony
			changepagesignal: function(){
				this.tempArray = this.todolist;
				this.arrayFilter();
				this.tempArray = this.newArray;
				this.changePage();
				this.makePageView();
				
			}
		},
		created(){
			this.newArray = this.todolist;
			this.tempArray = this.todolist;
			this.currentPage = 0
			this.makePageView();
			
		},
		
	})