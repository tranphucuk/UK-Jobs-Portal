var newsletter = {
    init: function () {
        this.loadData();
        this.registerEvents();
        this.loadCkEditor();
    },

    registerEvents: function () {
        var validator = $('#frm-news').validate({
            errorClass: 'red',
            rules: {
                txtNewsletterTitle: {
                    required: true,
                    maxlength: 500
                },
                txtNewsContent: 'required',
            },
            messages: {
                txtNewsletterTitle: {
                    required: '*Please enter title',
                    maxlength: '*Max length of title is 50 character',
                },
                txtNewsContent: {
                    required: '*Please enter content',
                },
            },
            showErrors: function (errorMap, errorList) {
                if (validator.submitted) {
                    var summary = "";
                    $.each(errorList, function () { summary += '* ' + this.message + "\n"; });
                    common.notify(summary, 'warn');
                    submitted = false;
                }
            },
        });

        $('#ddlShowPage').on('change', function () {
            config.pageSize = $('#ddlShowPage :selected').text();
            config.pageIndex = 1;
            $('#pagination-newsletter').twbsPagination('destroy');
            newsletter.loadData();
        });

        $('#txt-newsletter-keyword').on('keypress', function (e) {
            if (e.which === 13) {
                $('#btn-search-newsletter').click();
            }
        });

        $('#btn-search-newsletter').off('click').on('click', function () {
            $('#pagination-newsletter').twbsPagination('destroy');
            $('#ddlShowPage').prop('selectedIndex', 0);
            config.pageSize = 10;
            config.pageIndex = 1;
            newsletter.loadData();
        });

        $('#btn-create-newsletter').off('click').on('click', function () {
            $('#add-newsletter-modal').modal('show');
            newsletter.clearData();
        });

        $('#btn-save-news').off('click').on('click', function () {
            if (validator.form()) {
                var newsId = $('#hid-news-id').val();
                var news = {};
                if (newsId != undefined && newsId != '') {
                    news.Id = newsId;
                    news.CreatedDate = $('#hid-news-date').val();
                }
                news.Title = $('#txt-news-title').val();
                news.Content = CKEDITOR.instances['txt-news-content'].getData();
                news.Status = $('#ck-news-status').is(':checked') ? 1 : 0;

                $.ajax({
                    type: 'POST',
                    url: '/Admin/NewsLetter/SaveNewsLetter',
                    data: {
                        newsLetterVm: news,
                    },
                    beforeSend: common.runLoadingIndicator(),
                    success: function (res) {
                        if (res == true) {
                            common.notify('Save newsletter success', 'success');
                            common.stopLoadingIndicator();
                            $('#add-newsletter-modal').modal('hide');
                            newsletter.loadData();
                        } else {
                            common.notify('Save newsletter failed', 'error');
                            common.stopLoadingIndicator();
                        }
                    }
                });
            }
        });

        $('body').on('click', '.btnUpdateNewsletter', function () {
            var id = $(this).attr('data-id');
            $('#hid-news-id').val(id);
            $.ajax({
                type: 'GET',
                url: '/Admin/Newsletter/GetDetail',
                data: { id: id },
                beforeSend: common.runLoadingIndicator(),
                success: function (res) {
                    $('#add-newsletter-modal').modal('show');
                    $('#txt-news-title').val(res.Title);
                    CKEDITOR.instances['txt-news-content'].setData(res.Content);
                    $('#ck-news-status').prop('checked', res.Status);

                    $('#hid-news-date').val(res.CreatedDate);
                    common.stopLoadingIndicator();
                },
            });
        });

        $('body').on('click', '.btnSendNewsletter', function () {
            var id = $(this).attr('data-id');
            common.confirm("<b>Are you sure to send this?</b></br></br>***This newsletter will be sent to all emails.", function () {
                $.ajax({
                    type: 'POST',
                    url: '/Admin/Newsletter/SendNews',
                    data: { newsId: id },
                    beforeSend: common.runLoadingIndicator(),
                    success: function (res) {
                        if (res == true) {
                            common.notify('Sent newsletter succeeded', 'success');
                            newsletter.loadData();
                            common.stopLoadingIndicator();
                        } else {
                            common.notify('This newsletter is already sent to all emails.', 'warn');
                            common.stopLoadingIndicator();
                        }
                    }
                });
            });
        });
    },

    loadData: function () {
        var render = '';
        var template = $('#tbl-newsletter-template').html();
        $.ajax({
            type: 'GET',
            url: '/Admin/NewsLetter/GetAllPaging',
            data: {
                keyword: $('#txt-newsletter-keyword').val(),
                page: config.pageIndex,
                pageSize: config.pageSize,
            },
            beforeSend: common.runLoadingIndicator(),
            success: function (res) {
                $.each(res.Result, function (i, item) {
                    var news = {};
                    news.Id = item.Id;
                    news.Title = item.Title;
                    news.TotalReceiver = item.TotalReceiver;
                    news.Status = common.getStatusLabel(item.Status);
                    news.CreatedDate = common.formatDateTime(item.CreatedDate);

                    render += Mustache.render(template, news);
                });
                $('#tbl-newsletter-content').html(render);
                $('#lbl-total-newsletter').html(res.RowCount);

                if (res.RowCount > 0) {
                    newsletter.pagination(res.RowCount);
                }
                common.stopLoadingIndicator();
            }
        });
    },

    loadCkEditor: function () {
        CKEDITOR.replace('txtNewsContent', {
            language: 'en',
            width: '715px',
            height: '310px'
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

    clearData: function () {
        $('#hid-news-id').val('');
        $('#txt-news-title').val('');
        CKEDITOR.instances['txt-news-content'].setData('');
        $('#hid-news-date').val('');
    },

    pagination: function (total) {
        var totalPages = Math.ceil(total / config.pageSize);

        $('#pagination-newsletter').twbsPagination({
            totalPages: totalPages,
            visiblePages: 5,
            onPageClick: function (event, page) {
                if (page != config.pageIndex) {
                    config.pageIndex = page;
                    newsletter.loadData();
                }
            }
        });
    },
};
newsletter.init();