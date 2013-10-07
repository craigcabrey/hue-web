/**
 * Knockout JS Page ViewModel
 */
var ViewModel = function(data) {
    var self = this;
    
    self.user = new UserViewModel(data.user);
    self.bridges = ko.observable(data.bridges);
    self.selectedBridge = ko.observable(self.bridges().length === 1 ? self.bridges()[0] : null);
};

/**
 * User View Model
 */
var UserViewModel = function(data) {
    var self = this;
    
    if (typeof(data) === 'undefined') {
        self.firstName = ko.observable("");
        self.lastName = ko.observable("");
        self.loggedIn = ko.observable(false);
    } else {
        self.firstName = ko.observable(data.firstName);
        self.lastName = ko.observable(data.lastName);
        self.loggedIn = ko.observable(true);
    }

    self.fullName = ko.computed(function() {
            return self.firstName() + " " + self.lastName();
    });
};

/**
 * Bridge View Model
 */
var BridgeViewModel = function(data) {
    var self = this;
    
    self.id = ko.observable(data.id);
    self.ip = ko.observable(data.internalipaddress);
};

/**
 * Initial check to see if we're authenticated when we
 * first load the static page.
 */
$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: '/login',
        success: function(result) {
            if (result['state'] != '0') {
                var modal = document.querySelector('#modal-12');
                classie.add(modal, 'md-show');
            }
        }
    });
});

/**
 * Client side JavaScript login function.
 */
function login() {
    $.ajax({
        type: 'POST',
        data: {
            'userName': $('#userName').val(),
            'userPassword': $('#userPassword').val()
        },
        url: '/login',
        success: function(result) {
            var resultObj = JSON.parse(result);
            if (resultObj['state'] === '0') {
                var modal = document.querySelector('#modal-12');
                classie.remove(modal, 'md-show');
                $('#userName').val('');
                $('#userPassword').val('');
                loadInitial();
            } else {
                $('#userPasswordContainer').addClass('has-error');
                $('#userPassword').val('');
                $('#userPassword').focus();
            }
        }
    });
};

/**
 * Client side JavaScript logout function.
 */
function logout() {
    $.ajax({
        type: 'POST',
        url: '/logout',
        success: function(result) {
            var resultObj = JSON.parse(result);

            if (resultObj['state'] === 'success') {
                location.reload();
            }
        }
    });
}

/**
 * Client side JavaScript load initial state function.
 */
function loadInitial() {
    $.ajax({
        type: 'GET',
        url: '/api/initial',
        success: function(result) {
            console.log(result);
            ko.applyBindings(new ViewModel(JSON.parse(result)));
        }
    });
};

