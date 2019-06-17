var wishlist = {
    init: function () {
        this.loadData();
        this.registerEvents();
        this.loadCkEditor();
    },

    registerEvents: function () {
        $('body').on('click', '.btnViewWishlist', function () {
            var userId = $(this).data('user');
            var jobId = $(this).data('id');
            $.ajax({
                type: 'GET',
                url: '/Admin/UserJob/GetWishlistDetail',
                data: {
                    userId: userId,
                    jobId: jobId
                },
                beforeSend: common.runLoadingIndicator(),
                success: function (res) {
                    $('#txt-industry').val(res.Job.Industry);
                    $('#txt-company').val(res.Job.Company);
                    CKEDITOR.instances['txt-wishlist-content'].setData(res.UserNote);
                    $('#modal-wishlist').modal('show');
                    common.stopLoadingIndicator();
                }
            });
        });
    },

    loadData: function () {
        var render = '';
        var template = $('#tbl-wishlist-template').html();
        var wishlistId = $(this).data('id');
        $.ajax({
            type: 'GET',
            url: '/Admin/UserJob/GetAllPaging',
            data: {
                keyword: $('#txt-blog-keyword').val(),
                page: config.pageIndex,
                pageSize: config.pageSize,
            },
            beforeSend: common.runLoadingIndicator(),
            success: function (res) {
                $.each(res.Result, function (i, item) {
                    var obj = {};
                    obj.Id = item.Id;
                    obj.userId = item.AppUser.Id;
                    obj.Username = item.AppUser.UserName;
                    obj.AddedDate = common.formatDateTime(item.CreatedDate);
                    obj.JobName = item.Job.Industry;
                    obj.Company = item.Job.Company;
                    obj.jobId = item.Job.Id;

                    render += Mustache.render(template, obj);
                });
                $('#tbl-wishlist-content').html(render);
                if (res.Total > 0) {
                    wishlist.paging(res.Total);
                }
                $('#lbl-total-wishlist').html(res.Total);
                common.stopLoadingIndicator();
            },
            error: function (err) {
                common.notify('An error has occurred while loading data', 'error');
                common.stopLoadingIndicator();
            }
        });
    },

    paging: function (records) {
        var totalPages = Math.ceil(records / config.pageSize);

        $('#pagination-wishlist').twbsPagination({
            totalPages: totalPages,
            visiblePages: 5,
            onPageClick: function (event, page) {
                if (page != config.pageIndex) {
                    config.pageIndex = page;
                    wishlist.loadData();
                }
            }
        });
    },

    loadCkEditor: function () {
        CKEDITOR.replace('txtWishlistContent', {
            language: 'en',
            height: '280px'
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
wishlist.init();