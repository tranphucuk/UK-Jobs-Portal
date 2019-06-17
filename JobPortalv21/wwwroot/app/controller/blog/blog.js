var blog = {
    init: function () {
        this.loadData();
        this.registerEvents();
        this.loadCkEditor();
    },

    registerEvents: function () {
        var validator = $('#frm-blog').validate({
            errorClass: 'red',
            rules: {
                txtBlogName: "required",
                txtBlogThumbnail: "required",
                txtBlogDescription: {
                    required: true,
                    minlength: 1,
                    maxlength: 500
                },
                txtBlogContent: {
                    required: true,
                    minlength: 1,
                },
            },
            messages: {
                txtBlogName: {
                    required: 'Name is required'
                },
                txtBlogThumbnail: {
                    required: 'Thumbnail is required'
                },
                txtBlogDescription: {
                    required: 'Description is required',
                },
                txtBlogContent: {
                    required: 'Content is required'
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
            $('#pagination-blog').twbsPagination('destroy');
            blog.loadData();
        });

        $('#txt-blog-keyword').on('keypress', function (e) {
            if (e.which === 13) {
                $('#btn-search-blog').click();
            }
        });

        $('#btn-search-blog').off('click').on('click', function () {
            $('#pagination-blog').twbsPagination('destroy');
            $('#ddlShowPage').prop('selectedIndex', 0);
            config.pageIndex = 1;
            config.pageSize = 10;
            blog.loadData();
        });

        $('#ddl-blog-options').off('change').on('change', function () {
            config.pageSize = $('#ddlShowPage :selected').text();
            config.pageIndex = 1;
            $('#pagination-blog').twbsPagination('destroy');
            blog.loadData();
        });

        $('#btn-create-blog').on('click', function () {
            $('#add-edit-blog').modal('show');
        });

        $('body').on('click', '.btnUpdateBlog', function () {
            var blogId = $(this).data('id');
            $('#hid-blog-id').val(blogId);
            $.ajax({
                type: 'GET',
                url: '/Admin/Blog/GetBlogDetails',
                data: { blogId: blogId },
                beforeSend: common.runLoadingIndicator(),
                success: function (res) {
                    $('#add-edit-blog').modal('show');
                    $('#txt-blog-name').val(res.Name);
                    $('#txt-blog-thumbnail').val(res.Image);
                    $('#txt-blog-description').val(res.Description);
                    CKEDITOR.instances['txt-blog-content'].setData(res.Content);
                    $('#ck-blog-status').prop('checked', res.Status);
                    $('#ck-blog-hot').prop('checked', res.HotFlag);
                    $('#hid-blog-date').val(res.CreatedDate);
                    common.stopLoadingIndicator();
                },
                error: function (err) {
                    common.notify('Error: ' + err, 'error');
                    common.stopLoadingIndicator();
                }
            });
        });

        $('#btn-select-thumbnail').off('click').on('click', function () {
            $('#file-blog-thumbnail').val('');
            $('#file-blog-thumbnail').click();
        });

        $('#file-blog-thumbnail').on('change', function (e) {
            blog.thumbnail = $(this)[0].files[0];
            $('#txt-blog-thumbnail').val('/client-side/images/blog/' + blog.thumbnail.name);
        });

        $('#btn-save-blog').off('click').on('click', function () {
            var id = $('#hid-blog-id').val();
            if (validator.form()) {
                var fd = new FormData();
                if (id != '' && id != undefined) {
                    fd.append('Id', id);
                    fd.append('CreatedDate', $('#hid-blog-date').val());
                }
                fd.append('image', blog.thumbnail);
                fd.append('Name', $('#txt-blog-name').val());
                fd.append('Description', $('#txt-blog-description').val());
                fd.append('Image', $('#txt-blog-thumbnail').val());
                fd.append('Content', CKEDITOR.instances['txt-blog-content'].getData());
                fd.append('Status', $('#ck-blog-status').is(':checked') ? 1 : 0);
                fd.append('HotFlag', $('#ck-blog-hot').is(':checked') ? 1 : 0);
                $.ajax({
                    type: 'POST',
                    url: '/Admin/Blog/SaveBlog',
                    data: fd,
                    processData: false,
                    contentType: false,
                    beforeSend: common.runLoadingIndicator(),
                    success: function (res) {
                        common.notify('Save blog success.', 'success');
                        $('#add-edit-blog').modal('hide');
                        blog.loadData();
                        blog.clearForm();
                        common.stopLoadingIndicator();
                    },
                    error: function (err) {
                        common.notify('Error: ' + err, 'error');
                        common.stopLoadingIndicator();
                    }
                });
            }
        });

        $('body').on('click', '.btnDeleteBlog', function () {
            var blogId = $(this).attr('data-id');
            common.confirm('Are you sure to delete?', function () {
                $.ajax({
                    type: 'POST',
                    url: '/Admin/Blog/RemoveBlog',
                    data: { blogId: blogId },
                    beforeSend: common.runLoadingIndicator(),
                    success: function (res) {
                        common.notify('Remove success!', 'success');
                        blog.loadData();
                        common.stopLoadingIndicator();
                    },
                    error: function (err) {
                        common.notify('Error: ' + err, 'error');
                        common.stopLoadingIndicator();
                    }
                });
            });
        });
    },

    thumbnail: [],

    loadData: function () {
        var render = '';
        var template = $('#tbl-blog-template').html();
        var keyword = $('#txt-blog-keyword').val();
        var sortType = $('#ddl-blog-options').val();
        $.ajax({
            type: 'GET',
            url: '/Admin/Blog/GetAllPaging',
            data: {
                sortType: sortType,
                keyword: keyword,
                pageSize: config.pageSize,
                page: config.pageIndex,
            },
            beforeSend: common.runLoadingIndicator(),
            success: function (res) {
                $.each(res.Result, function (i, item) {
                    var obj = {};
                    obj.Id = item.Id;
                    obj.Name = item.Name;
                    obj.Image = common.formatImageWithSize(item.Image, 100);
                    obj.CreatedDate = common.formatDateTime(item.CreatedDate);
                    obj.ViewCount = item.ViewCount;
                    obj.Status = common.getStatusLabel(item.Status);

                    render += Mustache.render(template, obj);
                });
                $('#tbl-blog-content').html(render);
                if (res.Total > 0) {
                    blog.paging(res.Total);
                }
                $('#lbl-total-blog').html(res.Total);
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

        $('#pagination-blog').twbsPagination({
            totalPages: totalPages,
            visiblePages: 5,
            onPageClick: function (event, page) {
                if (page != config.pageIndex) {
                    config.pageIndex = page;
                    blog.loadData();
                }
            }
        });
    },

    clearForm: function () {
        $('#txt-blog-name').val('');
        $('#txt-blog-thumbnail').val('');
        $('#txt-blog-description').val('');
        CKEDITOR.instances['txt-blog-content'].setData('');
        $('#ck-blog-status').prop('checked', true);
        $('#ck-blog-show-home').prop('checked', false);
        $('#ck-blog-hot').prop('checked', false);
    },

    loadCkEditor: function () {
        CKEDITOR.replace('txtBlogContent', {
            language: 'en',
            height: '380px'
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
};
blog.init();