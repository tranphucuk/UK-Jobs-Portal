var recoverPassword = {
    init: function () {
        this.registerEvents();
    },

    registerEvents: function () {
        var validator = $('#frm-reset-pass').validate({
            errorClass: 'red',
            rules: {
                Password: 'required',
                ConfirmPassword: 'required',
            },
            messages: {
                Password: {
                    required: '*Password is required.',
                },
                ConfirmPassword: {
                    required: '*Confirm password is required.',
                },
            }
        });

        $('.btn-recover-pass').on('click', function () {
            validator.form();
        });
    }
}
recoverPassword.init();