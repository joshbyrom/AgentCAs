var Agent = function(group) {
	this.group = group;
	
	this.get_color = function() { 
		return this.color; 
	};
	
	this.is_same_group = function(other) {
		return this.group.name === other.group.name;
	};
	
	this.get_attitude_towards = function(other) {
		return this.group.get_attitude_towards(other.group);
	};
};