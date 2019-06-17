var login = {
    init: function () {
        this.registerEvents();
    },

    registerEvents: function () {
        var validator = $('#frm-login').validate({
            errorClass: 'red',
            rules: {
                Email: {
                    email: true,
                    required: true
                },
                Password: 'required',
            },
            messages: {
                Email: {
                    required: '*Email is required',
                },
                Password: {
                    required: '*Password is required.',
                },
            }
        });

        $('.btn-login').on('click', function () {
            validator.form();
        });
    }
}
login.init();