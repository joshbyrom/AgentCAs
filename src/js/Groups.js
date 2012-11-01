var Group = function(name, color) {
	this.name = name;
	this.color = color;
	
	this.self_attitude =  1.0;
	this.base_attitude = -1.0;
	
	this.attitudes = {};
	
	this.get_attitude_towards = function(other) {
		if(other.name === this.name) return this.selt_attitude;

		var result = this.attitudes[other.name];
		if(result === undefined) return this.base_attitude;
		else return result;
	};
	
	this.set_attitude_towards = function(other, value) {
		this.attitudes[other.name] = value;
	};
};