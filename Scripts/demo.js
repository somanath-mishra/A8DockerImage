(function(){
    // const notification_server = '192.168.0.121';
    const notification_server = '138.197.110.57';
    // const api_server = '192.168.0.42';
    // const api_server = 'api.fattiengage.com';
	function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }

    $("#username").val('james_clarke@secom.co.uk');
    $("#password").val('96fl4d9s');


    $("#login").click(function (event) {
    	var username = $("#username").val();
    	var password = $("#password").val();

    	console.log('Username password', username, password);
        var url = 'https://api.fattiengage.com/api/v1/accounts/login';
    	// var url = 'http://192.168.0.42/api/v1/accounts/login';
    	var data = {
            username: username,
            password: password
    	};
    	var socket = undefined;
    	
    	function socketConnect (token) {
    		var securityFilterData = {
            'filter': {
                'voId': 'd3d8f763b48748a79ebfca473410643c'
                }
            };
            var jwtData = parseJwt(token);
            console.log('jwt data ', jwtData);
            if (typeof jwtData["owner_id"] !== 'undefined') {
            	securityFilterData.filter.voId = jwtData["owner_id"];
    		    socket = io('ws://' + notification_server + ':8080/security?token=' + token);
    		    socket.on('connect', () => {
                    console.log(socket.id);
                    $('#status').html('Connected to socket');
                    socket.emit('server.version', {});
                    socket.emit('security:analytics:filter', securityFilterData);
                });
    		    socket.on('server.version', (res) => {
                    console.log('server.version', res );
                });
                socket.on('security:analytics:receive', (res) => {
            	    $('#status').html('Receiving data');
                    console.log('receive');
                    var json = JSON.parse(res)
                    $(".reponse_data #code").html(JSON.stringify(json, undefined, 2));
                });
            }
    	}
        $('#status').html('Logging in ..');
    	$.ajax({
            url: url,
            type: 'post',
            data:  JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            dataType: 'json',
            success: function (data) {
            	$('#status').html('Logged in');
                console.info(data);
                if (typeof data.jwt !== 'undefined') {
                    socketConnect(data.jwt)
                }
            }, error: function (err) {
            	$('#status').html(JSON.stringify(err));
            }

        });
    });
})();

