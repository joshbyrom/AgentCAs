var Agent = function(group) {
	this.group = group;
	
	this.get_color = function() { 
		return this.group.color; 
	};
	
	this.get_group_name = function() {
		return this.group.name;
	}
	
	this.is_same_group = function(other) {
		return this.group.name === other.group.name;
	};
	
	this.get_attitude_towards_agent = function(other) {
    if(other === null || other === undefined) return 0;
		return this.group.get_attitude_towards(other.group);
	};
};