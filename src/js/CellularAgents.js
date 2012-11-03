var shuffle = function(array) {
	var count = array.length;
	var index = 0;
	var temp = null;
	
	while(count > 0) {
		index = Math.floor(Math.random() * count--);
		temp = array[count];
		array[count] = array[index];
		array[index] = temp;
	}
}

var View = function(cellspace, canvas_id) {
	this.cellspace = cellspace;
	this.canvas_id = canvas_id;
	
	this.canvas = document.getElementById(this.canvas_id);
	this.context = this.canvas.getContext('2d');
	
	this.min_width = 5;
	this.min_height = 5;
	
	this.set_width_height = function() {
		this.cell_width = this.canvas.width / this.cellspace.number_of_columns;
		this.cell_height = this.canvas.height / this.cellspace.number_of_rows;
		
		this.cell_width = Math.max(this.cell_width, this.min_width);
		this.cell_height = Math.max(this.cell_height, this.min_height);
	};
	
	this.set_width_height();
	
	this.draw_cell = function(cell) {
		var x = cell.column * this.cell_width;
		var y = cell.row * this.cell_height;
		var color = cell.get_state() === 'occupied' ? cell.agent.get_color() : 'black';
		
		this.context.fillStyle = color;
		this.context.lineWidth = 1;
	    this.context.strokeStyle = 'black';
		
		this.context.beginPath();
		this.context.rect(x, y, this.cell_width, this.cell_height);
		this.context.closePath();
		
		this.context.fill();
		//this.context.stroke();
	};
	
	this.draw = function() {
		var xlen = this.cellspace.number_of_columns;
		var ylen = this.cellspace.number_of_rows;
		
		var cell = null;
		for(var x = 0; x < xlen; ++x) {
			for(var y = 0; y < ylen; ++y) {
				cell = this.cellspace.get_cell_at(x, y);
				this.draw_cell(cell);
			}
		}
	};
};


var GroupLogic = function(cellspace, groups) {
	this.cellspace = cellspace;
	this.groups = groups;
	
	this.birth_chance = 0.55;
  
        this.initial_range = 5;   
        this.extended_range = 10;
	
	// update
	this.update = function() {
		var xlen = this.cellspace.number_of_columns;
		var ylen = this.cellspace.number_of_rows;
		
		var cell = null;
		for(var x = 0; x < xlen; ++x) {
			for(var y = 0; y < ylen; ++y) {
				cell = this.cellspace.get_cell_at(x, y);
				this.handle_cell(cell);
			}
		}
		
		for(x = 0; x < xlen; ++x) {
			for(y = 0; y < ylen; ++y) {
				cell = this.cellspace.get_cell_at(x, y);
				if(cell.get_state() != cell.next_state) {
					cell.enter_next_state();
				}
			}
		}
	};
	
	this.handle_cell = function(cell) {
		var state = cell.get_state();
			
		if(state === 'unknown') {
			if(Math.random() < this.birth_chance) {
				cell.agent = this.create_agent();
				cell.next_state = 'occupied';
			} else {
				cell.next_state = 'empty';
				cell.agent = null;
			}
	  } else if(state === 'occupied') {
      this.determine_move(cell, this.initial_range);
    }
	};
  
  this.move_cell = function(cell, target) {
    var tmp = target.agent;
    
    target.next_state = cell.get_state();
    target.agent = cell.agent;
    
    cell.next_state = target.state;
    cell.agent = tmp;
  }
  
  this.get_cell_value = function(cell_one, cell_two) {
    var attitude = 0;
    
    var neighbors = cell_two.get_neighbors(this.initial_range);
    
    var cell = null;
    for(var i = 0; i < neighbors.length; ++i) {
      for(var j = 0; j < neighbors[i].length; ++j) {
        cell = neighbors[i][j];
        
        if(cell !== cell_one) {
          attitude += cell_one.agent.get_attitude_towards_agent(cell.agent);
        }
      }
    }
    
    return attitude;
  };
  
  this.determine_move = function(cell, range) {
    var neighbors = cell.get_neighbors(range);
    var highest = {
      target : cell,
      value : this.get_cell_value(cell, cell)
    };
    
    var current_value = 0;
    var current_cell = null;
    for(var i = 0; i < neighbors.length; ++i) {
      for(var j = 0; j < neighbors[i].length; ++j) {
        if(i === cell.column && j === cell.row) continue;
        
        current_cell = neighbors[i][j];
        if(current_cell.get_state() === 'empty' && 
           current_cell.next_state !== 'occupied') {
          current_value = this.get_cell_value(cell, current_cell);

          if(current_value > highest.value) {
            highest.target = neighbors[i][j];
            highest.value = current_value;
          }
        }
      }
    }
    
    if(highest.target !== cell) {
      this.move_cell(cell, highest.target);
    } else if(range < this.extended_range) {
      this.determine_move(cell, this.extended_range);
    }
  };
	
	this.create_agent = function() {
		var index = Math.floor(Math.random() * this.groups.length);
		return new Agent(this.groups[index]);
	}
};

var main = function(canvas_id) {
	var Yy = new Group('Yy', 'purple');
	var YY = new Group('YY', 'teal');
  var Xy = new Group('Xy', 'green');
  var XX = new Group('XX', 'blue');
	
  XX.set_attitude_towards(YY, 0.5);
  YY.set_attitude_towards(XX, 0.5);
  
	var cellspace = new Cellspace(100, 100);
	
	var view = new View(cellspace, canvas_id);
	var logic = new GroupLogic(cellspace, [Yy, YY, Xy, XX]);
	
	var sim = new Simulation(logic, view);
	//sim.infinite = true;
	sim.start(1000, 25);
};

