var login = {
    init: function () {
        this.registerEvents();
    },
    registerEvents: function () {
        $('#frm-login').validate({
            errorClass: 'red',
            ignore: [],
            rules: {
                username: 'required',
                password: 'required'
            }
        })

        $('#btn-login').on('click', function (e) {
            e.preventDefault();
            if ($('#frm-login').valid()) {
                var user = $('#txt-username').val();
                var pass = $('#txt-password').val();
                login.login(user, pass);
            }
        });

        $('#txt-username').on('keypress', function (e) {
            if ($('#frm-login').valid()) {
                var user = $('#txt-username').val();
                var pass = $('#txt-password').val();
                if (e.which === 13) {
                    login.login(user, pass);
                }
            }
        })

        $('#txt-password').on('keypress', function (e) {
            if ($('#frm-login').valid()) {
                var user = $('#txt-username').val();
                var pass = $('#txt-password').val();
                if (e.which === 13) {
                    login.login(user, pass);
                }
            }
        })
    },

    login: function (user, pass) {
        var obj = {
            Username: user,
            Password: pass,
            Rememberme: false
        }
        $.ajax({
            type: 'POST',
            data: {
                Model: obj
            },
            dataType: 'json',
            url: '/Admin/Login/Signin',
            success: function (res) {
                if (res.Status) {
                    window.location.href = "/Admin/Home/Index";
                } else {
                    common.notify(res.Message, 'error');
                }
            },
            error: function (err) {
                console.log(err);
                common.notify("Error: " + err, 'error');
            }
        });
    }
}
login.init();