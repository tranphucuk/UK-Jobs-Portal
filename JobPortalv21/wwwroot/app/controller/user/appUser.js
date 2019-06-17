var user = {
    init: function () {
        this.loadData();
        this.registerEvents();
    },

    registerEvents: function () {
        var validator = $('#frm-user').validate({
            errorClass: 'red',
            rules: {
                txtUsername: 'required',
                txtUserFullname: 'required',
                txtUserPassword: {
                    required: true,
                    minlength: 8,
                    maxlength: 30
                },
                txtUserEmail: {
                    required: true,
                    email: true
                },
                txtUserPhoneNumber: {
                    number: true,
                    minlength: 10,
                    maxlength: 15
                },
                txtUserAvatar: 'required',
                txtUserBirthday: 'required',
                txtUserAddress: 'required',
            },
            messages: {
                txtUserPhoneNumber: {
                    required: "Please enter your correct phone number."
                },
            }
        });

        $('#btn-search-user').off('click').on('click', function () {
            $('#pagination-user').twbsPagination('destroy');
            $('#ddl-display-number').prop('selectedIndex', 0);
            config.pageIndex = 1;
            config.pageSize = 10;
            user.loadData();
        });

        $('#txt-keyword-user').on('keypress', function (e) {
            if (e.which === 13) {
                $('#btn-search-user').click();
            }
        });

        $('#btn-avatar-img').on('click', function () {
            $('#btn-avatar-file').val('');
            $('#btn-avatar-file').click();
        });

        $('#btn-avatar-file').on('change', function () {
            var file = $(this)[0].files[0];
            $('#txt-user-avatar').val("/admin-side/images/user/" + file.name);
            user.data = file;
        });

        $('#btn-create-user').off('click').on('click', function () {
            $('#add-edit-user').modal('show');
            user.clearForm();
            validator.resetForm();
            $('#frm-user-password').show();
            $('#frm-created-date').hide();
            $('#frm-modified-date').hide();
        });

        $('body').on('click', '.btn-edit-user', function () {
            var userId = $(this).attr('data-id');
            $('#hid-user-id').val(userId);
            user.clearForm();
            $.ajax({
                type: 'GET',
                url: '/Admin/User/GetUserDetailAsync',
                data: { id: userId },
                beforeSend: common.runLoadingIndicator(),
                success: function (res) {
                    $('#add-edit-user').modal('show');
                    var data = res.Data;
                    $('#txt-user-name').val(data.UserName);
                    $('#txt-user-name').attr('disabled', 'disabled');
                    $('#frm-user-password').hide();
                    $('#txt-user-fullname').val(data.Fullname);
                    $('#txt-user-email').val(data.Email);
                    $('#txt-phone-number').val(data.PhoneNumber);
                    $('#txt-user-avatar').val(data.Avatar);
                    $('input:radio[name="sex"]').val([data.Gender])
                    $('#txt-user-birthday').datepicker('update', data.Birthday);
                    $('#txt-user-address').val(data.Address);
                    $('#frm-created-date').show();
                    $('#frm-modified-date').show();
                    $('#txt-created-date').val(common.formatDateTime(data.CreatedDate));
                    $('#txt-modified-date').val(common.formatDateTime(data.ModifiedDate));
                    $('#ck-user-status').prop('checked', data.Status);
                    $.each(data.Roles, function (i, item) {
                        $('#frm-role-group').find('input[value="' + item + '"]').prop('checked', true);
                    });

                    common.stopLoadingIndicator();
                },
                error: function (err) {
                    common.notify('An error has occurred.', 'error');
                    common.stopLoadingIndicator();
                }
            });

        });

        $('body').on('click', '.btn-delete-user', function () {
            var userId = $(this).attr('data-id');
            common.confirm('Are you sure to delete user?', function () {
                $.ajax({
                    type: 'POST',
                    url: '/Admin/User/DeleteAsync',
                    data: { id: userId },
                    beforeSend: common.runLoadingIndicator(),
                    success: function (res) {
                        if (res.Status) {
                            common.notify('Removed user: ' + res.Message + ' success.', 'success');
                        } else {
                            common.notify('Erorr: ' + res.Message, "error");
                        }
                        user.loadData();
                        common.stopLoadingIndicator();
                    },
                    error: function (err) {
                        common.notify('An error has occurred: ' + err, 'error');
                        common.stopLoadingIndicator();
                    }
                });
            });
        });

        $('#btn-save-user').off('click').on('click', function () {
            var id = $('#hid-user-id').val();
            if (validator.form()) {
                var fd = new FormData();
                if (id != '' && id != undefined) {
                    fd.append('Id', id);
                    fd.append('CreatedDate', $('#txt-created-date').val());
                }
                fd.append('Username', $('#txt-user-name').val());
                fd.append('Password', $('#txt-user-password').val());
                fd.append('Fullname', $('#txt-user-fullname').val());
                fd.append('Phonenumber', $('#txt-phone-number').val());
                fd.append('Email', $('#txt-user-email').val());
                fd.append('Avatar', $('#txt-user-avatar').val());
                fd.append('Birthday', $('#txt-user-birthday').val());
                fd.append('Address', $('#txt-user-address').val());
                fd.append('Gender', $('#rad-user-male').is(':checked') ? 0 : 1);
                fd.append('Status', $('#ck-user-status').is(':checked') ? 1 : 0);

                $.each($('#frm-role-group input[type="checkbox"]:checked'), function (i, item) {
                    fd.append("Roles", $(item).val());
                })
                fd.append('file', user.data);
                $.ajax({
                    type: 'POST',
                    url: '/Admin/User/SaveUserAsync',
                    data: fd,
                    processData: false,
                    contentType: false,
                    beforeSend: common.runLoadingIndicator(),
                    success: function (res) {
                        if (res.Status) {
                            common.notify('Save user: ' + res.Message + ' success', 'success');
                            $('#add-edit-user').modal('hide');
                            user.loadData();
                        } else {
                            common.notify('Error: ' + res.Message, 'error');
                        }

                        common.stopLoadingIndicator();
                    },
                    error: function (err) {
                        common.notify('An error has occurred.', 'error');
                        common.stopLoadingIndicator();
                    }
                });
            }
        });
    },

    data: [],

    loadData: function () {
        var render = '';
        var template = $('#tbl-user-template').html();
        $.ajax({
            type: 'GET',
            url: '/Admin/User/GetAllPaging',
            data: {
                page: config.pageIndex,
                pageSize: config.pageSize,
                keyword: $('#txt-keyword-user').val()
            },
            beforeSend: common.runLoadingIndicator(),
            success: function (res) {
                $.each(res.Result, function (i, item) {
                    var obj = {};
                    obj.Id = item.Id;
                    obj.Username = item.UserName;
                    obj.Email = item.Email;
                    obj.Fullname = item.Fullname;
                    obj.Avatar = common.formatImage(item.Avatar);
                    obj.Phone = item.PhoneNumber;
                    obj.CreatedDate = common.formatDateTime(item.CreatedDate);
                    obj.Status = common.getStatusLabel(item.Status);
                    render += Mustache.render(template, obj);
                });
                $('#tbl-render-user').html(render);
                user.pagination(res.Total);
                common.stopLoadingIndicator();
            },
            error: function (err) {
                common.notify('An error has occurred.', 'error');
                common.stopLoadingIndicator();
            }
        });
    },

    pagination: function (total) {
        var totalPage = (Math.ceil)(total / config.pageSize);

        $('#pagination-user').twbsPagination({
            totalPages: totalPage,
            visiblePages: 5,
            onPageClick: function (event, page) {
                if (config.pageIndex != page) {
                    user.loadData();
                }
            }
        });
    },

    clearForm: function () {
        $('#txt-user-name').val('');
        $('#txt-user-name').removeAttr('disabled');
        $('#txt-user-password').val('');
        $('#txt-user-fullname').val('');
        $('#txt-user-email').val('');
        $('#txt-phone-number').val('');
        $('#txt-user-avatar').val('');
        $('#txt-user-birthday').val('');
        $('#txt-user-birthday').datepicker({
            format: 'm/d/yyyy',
            autoclose: true
        });
        $('#ck-user-status').prop('checked', true);
        $('#txt-user-address').val('');
        $('#frm-role-group').find('input[type="checkbox"]').prop('checked', false);
    }
}
user.init();