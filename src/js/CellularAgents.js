var shuffle = function(array) {
	var count = array.length;
	var index = 0;
	var temp = null;
	
	while(count > 0) {
		index = Math.floor(Math.random() * count--);
		temp = array[count];
		array[count] = array[index];
		array[index] = array[count];
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
	
	this.birth_chance = 0.05;
	
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
	    }
	};
	
	this.create_agent = function() {
		var index = Math.floor(Math.random() * this.groups.length);
		return new Agent(this.groups[index]);
	}
};

var main = function(canvas_id) {
	var Yy = new Group('Yy', 'yellow');
	var YY = new Group('YY', 'green');
	
	var cellspace = new Cellspace(50, 50);
	
	var view = new View(cellspace, canvas_id);
	var logic = new GroupLogic(cellspace, [Yy, YY]);
	
	var sim = new Simulation(logic, view);
	//sim.infinite = true;
	sim.start(1000, 5);
}