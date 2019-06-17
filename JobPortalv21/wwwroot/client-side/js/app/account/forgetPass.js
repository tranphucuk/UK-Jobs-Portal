var forgetPassword = {
    init: function () {
        this.registerEvents();
    },

    registerEvents: function () {
        var validator = $('#frm-forget-pass').validate({
            errorClass: 'red',
            rules: {
                Email: {
                    email: true,
                    required: true
                },
            },
            messages: {
                Email: {
                    required: '*Email is required',
                },
            }
        });

        $('.btn-forget-pass').on('click', function () {
            validator.form();
        });
    }
}
forgetPassword.init();