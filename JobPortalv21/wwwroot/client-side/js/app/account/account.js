var account = {
    init: function () {
        this.registerEvents();
    },

    registerEvents: function () {
        var validator = $('#frm-register').validate({
            errorClass: 'red',
            rules: {
                FullName: 'required',
                Email: {
                    email: true,
                    required: true
                },
                Password: 'required',
                ConfirmPassword: 'required',
            },
            messages: {
                FullName: {
                    required: '*Fullname is required',
                },
                Email: {
                    required: '*Email is required',
                },
                Password: {
                    required: '*Password is required.',
                },
                ConfirmPassword: {
                    required: '*Confirm password is required.',
                },
            }
        });

        $('.btn-register').on('click', function () {
            validator.form();
        });
    }
}
account.init();