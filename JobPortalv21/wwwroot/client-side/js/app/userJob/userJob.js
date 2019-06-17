var userJob = {
    init: function () {
        this.loadCkEditor()
        this.registerEvents();
    },

    registerEvents: function () {

        CKEDITOR.on('instanceReady', function () { userJob.checkScreen(); });

        $(window).on('resize', function () {
            var mock = $('.mock-scal').width();
            $('.cke_editor_txt-content').width(mock);
        });

        $('.btn-note-content').on('click', function () {
            var id = $(this).data('id');
            var userJobVm = {};
            userJobVm.JobId = id;
            userJobVm.UserNote = CKEDITOR.instances['txt-content'].getData();
            $.ajax({
                type: 'POST',
                url: '/Wishlist/SaveNote',
                data: {
                    jobVm: userJobVm
                },
                success: function (res) {
                    if (res.Status == true) {
                        window.location.href = "/my-wishlist.html";
                    } else {
                        $('.erro-display').html(res.Message);
                    }
                },
            });
        });
    },

    checkScreen: function () {
        var mock = $('.mock-scal').width();
        $('.cke_editor_txt-content').width(mock);
    },

    loadCkEditor: function () {
        CKEDITOR.replace('Content', {
            language: 'en',
            width: '664px',
            height: '200px'
        });
        $.fn.modal.Constructor.prototype.enforceFocus = function () {
            $(document)
                .off('focusin.bs.modal') // guard against infinite focus loop
                .on('focusin.bs.modal', $.proxy(function (e) {
                    if (
                        this.$element[0] !== e.target && !this.$element.has(e.target).length
                        // CKEditor compatibility fix start.
                        && !$(e.target).closest('.cke_dialog, .cke').length
                        // CKEditor compatibility fix end.
                    ) {
                        this.$element.trigger('focus');
                    }
                }, this));
        };
    },
}
userJob.init();