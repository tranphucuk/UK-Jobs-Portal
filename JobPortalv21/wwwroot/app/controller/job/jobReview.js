var jobReview = {
    init: function () {
        this.loadData();
        this.registerEvents();
    },

    registerEvents: function () {
        $('#ddlShowPage').on('change', function () {
            config.pageSize = $('#ddlShowPage :selected').text();
            config.pageIndex = 1;
            $('#pagination-review').twbsPagination('destroy');
            jobReview.loadData();
        });

        $('#txt-review-keyword').on('keypress', function (e) {
            if (e.which === 13) {
                $('#btn-search-review').click();
            }
        });

        $('#btn-search-review').off('click').on('click', function () {
            $('#pagination-review').twbsPagination('destroy');
            $('#ddlShowPage').prop('selectedIndex', 0);
            config.pageSize = 10;
            config.pageIndex = 1;
            jobReview.loadData();
        });

        $('body').on('click', '.btnUpdateReview', function () {
            var id = $(this).attr('data-id');
            $('#hid-review-id').val(id);
            $.ajax({
                type: 'GET',
                url: '/Admin/JobFeedback/GetReview',
                data: { reviewId: id },
                beforeSend: common.runLoadingIndicator(),
                success: function (res) {
                    $('#modal-review').modal('show');
                    $('#txt-email').val(res.Email);
                    $('#txt-title').val(res.Name);
                    $('#txt-review-content').val(res.Review);
                    $('#ck-review-status').prop('checked', res.Status);

                    $('#hid-review-date').val(res.CreatedDate);
                    common.stopLoadingIndicator();
                },
            });
        });

        $('#btn-save-review').off('click').on('click', function () {
            var reviewId = $('#hid-review-id').val();
            var review = {};
            if (reviewId != undefined && reviewId != '') {
                review.Id = reviewId;
                review.CreatedDate = $('#hid-review-date').val();
            }
            review.Status = $('#ck-review-status').is(':checked') ? 1 : 0;
            review.Email = $('#txt-email').val();
            review.Name = $('#txt-title').val();
            review.Review = $('#txt-review-content').val();

            $.ajax({
                type: 'POST',
                url: '/Admin/JobFeedback/UpdateReview',
                data: {
                    jobReview: review,
                },
                beforeSend: common.runLoadingIndicator(),
                success: function (res) {
                    if (res == true) {
                        common.notify('Save review success', 'success');
                        common.stopLoadingIndicator();
                        $('#modal-review').modal('hide');
                        jobReview.loadData();
                    } else {
                        common.notify('Save review failed', 'error');
                        common.stopLoadingIndicator();
                    }
                }
            });
        });
    },

    loadData: function () {
        var render = '';
        var template = $('#tbl-review-template').html();
        $.ajax({
            type: 'GET',
            url: '/Admin/JobFeedback/GetJobFeedbackPaging',
            data: {
                keyword: $('#txt-review-keyword').val(),
                page: config.pageIndex,
                pageSize: config.pageSize,
            },
            beforeSend: common.runLoadingIndicator(),
            success: function (res) {
                $.each(res.Result, function (i, item) {
                    var review = {};
                    review.Id = item.Id;
                    review.Email = item.Email;
                    review.Name = item.Name;
                    review.Status = common.getStatusResponse(item.Status);
                    review.CreatedDate = common.formatDateTime(item.CreatedDate);

                    render += Mustache.render(template, review);
                });
                $('#tbl-review-content').html(render);
                $('#lbl-total-review').html(res.RowCount);

                if (res.RowCount > 0) {
                    jobReview.pagination(res.RowCount);
                }
                common.stopLoadingIndicator();
            }
        });
    },

    pagination: function (total) {
        var totalPages = Math.ceil(total / config.pageSize);

        $('#pagination-review').twbsPagination({
            totalPages: totalPages,
            visiblePages: 5,
            onPageClick: function (event, page) {
                if (page != config.pageIndex) {
                    config.pageIndex = page;
                    jobReview.loadData();
                }
            }
        });
    },

}
jobReview.init();