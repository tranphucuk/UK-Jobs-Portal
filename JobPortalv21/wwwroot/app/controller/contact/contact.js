var contact = {
    init: function () {
        this.loadData();
        this.registerEvents();
    },

    registerEvents: function () {
        $('#ddlShowPage').on('change', function () {
            config.pageSize = $('#ddlShowPage :selected').text();
            config.pageIndex = 1;
            $('#pagination-contact').twbsPagination('destroy');
            contact.loadData();
        });

        $('#txt-contact-keyword').on('keypress', function (e) {
            if (e.which === 13) {
                $('#btn-search-contact').click();
            }
        });

        $('#btn-search-contact').off('click').on('click', function () {
            $('#pagination-contact').twbsPagination('destroy');
            $('#ddlShowPage').prop('selectedIndex', 0);
            config.pageIndex = 1;
            config.pageSize = 10;
            contact.loadData();
        });

        $('body').on('click', '.btnUpdateContact', function () {
            var contactId = $(this).data('id');
            $('#hid-contact-id').val(contactId);
            $.ajax({
                type: 'GET',
                url: '/Admin/Contact/GetContactDetails',
                data: { contactId: contactId },
                beforeSend: common.runLoadingIndicator(),
                success: function (res) {
                    $('#modal-contact').modal('show');
                    $('#txt-email').val(res.Email);
                    $('#txt-subject').val(res.Subject);
                    $('#txt-content').text(res.Message);
                    $('#ck-contact-status').prop('checked', res.Status);
                    $('#hid-contact-date').val(res.CreatedDate);
                    common.stopLoadingIndicator();
                },
                error: function (err) {
                    common.notify('Error: ' + err, 'error');
                    common.stopLoadingIndicator();
                }
            });
        });

        $('#btn-save-contact').on('click', function () {
            var contactVm = {};
            contactVm.Id = $('#hid-contact-id').val();
            contactVm.Subject = $('#txt-subject').val();
            contactVm.Email = $('#txt-email').val();
            contactVm.Message = $('#txt-content').text();
            contactVm.CreatedDate = $('#txt-contact-date').val()
            contactVm.Status = $('#ck-contact-status').is(':checked') ? 1 : 0;
            $.ajax({
                type: 'POST',
                url: '/Admin/Contact/SaveContact',
                data: { contactVm: contactVm },
                beforeSend: common.runLoadingIndicator(),
                success: function (res) {
                    $('#modal-contact').modal('hide');
                    contact.loadData();
                    common.stopLoadingIndicator();
                },
                error: function (err) {
                    common.notify('Error: ' + err, 'error');
                    common.stopLoadingIndicator();
                }
            });
        });

        $('body').on('click', '.btnDeleteContact', function () {
            var contactId = $(this).attr('data-id');
            common.confirm('Are you sure to delete?', function () {
                $.ajax({
                    type: 'POST',
                    url: '/Admin/Contact/Delete',
                    data: { contactId: contactId },
                    success: function (res) {
                        common.notify('Removed success.', 'success');
                        contact.loadData();
                    },
                    error: function (err) {
                        common.notify('Error: ' + err.Message, 'error');
                    }
                });
            });
        });
    },

    loadData: function () {
        var render = '';
        var template = $('#tbl-contact-template').html();
        var keyword = $('#txt-contact-keyword').val();
        $.ajax({
            type: 'GET',
            url: '/Admin/Contact/GetAllPaging',
            data: {
                keyword: keyword,
                pageSize: config.pageSize,
                page: config.pageIndex,
            },
            beforeSend: common.runLoadingIndicator(),
            success: function (res) {
                $.each(res.Result, function (i, item) {
                    var obj = {};
                    obj.Id = item.Id;
                    obj.Subject = item.Subject;
                    obj.Email = item.Email;
                    obj.CreatedDate = common.formatDateTime(item.CreatedDate);
                    obj.Status = common.getStatusResponse(item.Status);

                    render += Mustache.render(template, obj);
                });
                $('#tbl-contact-content').html(render);
                if (res.Total > 0) {
                    contact.paging(res.Total);
                }
                $('#lbl-total-contact').html(res.Total);
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
                    contact.loadData();
                }
            }
        });
    },
}
contact.init();