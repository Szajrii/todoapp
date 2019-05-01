   var Event = new Vue({
        methods: {
            addTask: function(...args) {
                this.$emit("addTask", args);
            },
             addDetailsView: function(list){
        	this.$emit("addDetailsView", list);
        	},
        	removeTask: function(id){
        		this.$emit('removeTask', id);
        	},
        	closeModalView: function(secondaryview){
        		
        		this.$emit('closeModalView', secondaryview);
        	},
        	updateData:function(newData, id){
        		this.$emit('updateData', newData, id);
        	},
        	pageChanged: function(currentPage, numberOfPages){
        		this.$emit('pageChanged', currentPage, numberOfPages);
        	},
          askForGroupTasks: function(name){
            this.$emit('groupTasksRequest', name)
          },
          sendGroupDetails: function  (name, description, users){
            this.$emit('groupRequest', name, description, users)
          },
          removeGroup: function(){
            this.$emit('removeGroup')
          },
          addGroupTask: function(view, condition, groupName){
            this.$emit('addGroupTask', view, condition, groupName)
          }
        },

    });