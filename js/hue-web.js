var ViewModel = function(data) {
    var self = this;
    
    self.user = new UserViewModel(data.user);
    self.bridges = ko.observable(data.bridges);
    self.selectedBridge = ko.observable(self.bridges().length === 1 ? self.bridges()[0] : null);
};

var UserViewModel = function(data) {
    var self = this;
    
    self.firstName = ko.observable(data.firstName);
    self.lastName = ko.observable(data.lastName);
    self.fullName = ko.computed(function() {
        return self.firstName() + " " + self.lastName();
    });
};

var BridgeViewModel = function(data) {
    var self = this;
    
    self.id = ko.observable(data.id);
    self.ip = ko.observable(data.internalipaddress);
};

var viewModel;

$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: '/api/bridges',
		success: function(result) {
			ko.applyBindings(new ViewModel(JSON.parse(result)));
		}
	});
});

