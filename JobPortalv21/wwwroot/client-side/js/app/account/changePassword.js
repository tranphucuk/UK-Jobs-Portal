var changePass = {
    init: function () {
        this.registerEvents();
    },

    registerEvents: function () {
        var validator = $('#frm-changePass').validate({
            errorClass: 'red',
            rules: {
                Fullname: 'required',
                Address: 'required',
                OldPassword: {
                    required: true,
                    minlength: 6
                },
            },
            messages: {
                Fullname: {
                    required: '*Fullname is required',
                },
                Address: {
                    required: '*Address is required',
                },
                OldPassword: {
                    required: '*Current password is required.',
                },
            }
        });

        $('.btn-change-pass').on('click', function () {
            validator.form();
        });
    }
}
changePass.init();