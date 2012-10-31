var View = function(cellspace, canvas_id) {
	this.canvas = document.getElementById(canvas_id);
	this.context = this.canvas.getContext('2d');
	
	this.draw = function() {
		
	};
};


var Logic = function(cellspace) {
	this.cellspace = cellspace;
	
	
	this.update = function() {
	
	}
};

var main = function(canvas_id) {
	var cellspace = new Cellspace(100, 100);
	
	var view = new View(cellspace, canvas_id);
	var logic = new Logic(cellspace);
	
	var sim = new Simulation(logic, view);
	sim.infinite = true;
	sim.start(1000, 0);
}