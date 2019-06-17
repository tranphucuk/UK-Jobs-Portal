var contactUs = {
    init: function () {
        this.registerEvents();
    },

    registerEvents: function () {
        var validator = $('#frm-contact-us').validate({
            errorClass: 'red',
            rules: {
                Email: {
                    email: true,
                    required: true
                },
                Subject: 'required',
                Message: 'required',
            },
            messages: {
                Email: {
                    required: '*Email is required',
                },
                Subject: {
                    required: '*Subject is required.',
                },
                Message: {
                    required: '*Message is required.',
                },
            }
        });

        $('.btn-contact-us').on('click', function () {
            validator.form();
        });
    }
}
contactUs.init();