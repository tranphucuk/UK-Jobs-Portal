var review = {
    init: function () {
        this.registerEvents();
    },

    registerEvents: function () {
        var validator = $('#frm-review').validate({
            errorClass: 'red',
            rules: {
                Fullname: {
                    required: true,
                    maxlength: 50,
                },
                Email: {
                    email: true,
                    required: true,
                    maxlength: 30,
                },
                Review: {
                    required: true,
                    maxlength: 500,
                    minlength: 20,
                },
            },
            messages: {
                Fullname: {
                    required: 'Please enter your name',
                },
                Email: {
                    required: 'Please enter your email',
                },
                Review: {
                    required: 'Please enter your review',
                },
            },
        });

        $('#give-feedback').on('click', function (e) {
            e.preventDefault();
            $('#modal-review').modal('show');

            var jobId = $(this).data('id');
            $('#job-id').val(jobId);
        });

        $('#btn-send').on('click', function () {
            if (validator.form()) {
                var jobId = $('#job-id').val();
                var jobReview = {};
                jobReview.JobId = jobId;
                jobReview.Name = $('#txt-fullname').val();
                jobReview.Email = $('#txt-email').val();
                jobReview.Review = $('#txt-review').val();

                $.ajax({
                    type: 'POST',
                    url: '/Job/SendFeedback',
                    data: {
                        jobId: jobId,
                        jobReviewVm: jobReview
                    },
                    success: function (res) {
                        if (res == true) {
                            $('#div-review').html('');
                            var thankyou = '<div class="row form-group"><div class="col-lg-12 col-md-12 col-xs-6 col-sm-6 sign-success"><div class="col-sm-12 pull-left col-xs-12"><i class="fa fa-check check-mark"></i><span class="thank-you">THANK YOU!</span></div><div class="col-sm-12 pull-left col-xs-12">Thank you so much for taking the time to leave this excellent review.</div></div></div>'
                            $('#div-review').html(thankyou);
                            review.reload = true;
                        }
                    }
                });
            }
        });

        $('#modal-review').on('hidden.bs.modal', function () {
            if (review.reload == true) {
                location.reload();
            }
        });
    },

    reload: false,
}
review.init();