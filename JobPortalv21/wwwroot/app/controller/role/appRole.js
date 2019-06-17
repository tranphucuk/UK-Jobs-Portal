var role = {
    init: function () {
        this.loadData();
        role.loadFunction();
        this.registerEvents();
    },

    registerEvents: function () {
        var validator = $('#frm-role').validate({
            errorClass: 'red',
            rules: {
                txtNameRole: 'required',
                txtRoleDescription: 'required',
            }
        });

        $('#btn-create-role').off('click').on('click', function () {
            $('#add-edit-role').modal('show');
            role.clearForm();
            validator.resetForm();
        });

        $('body').on('click', '.btn-edit-role', function () {
            var roleId = $(this).attr('data-id');
            $('#hid-role-id').val(roleId);
            $.ajax({
                type: 'GET',
                url: '/Admin/Role/GetRoleDetail',
                data: { id: roleId },
                beforeSend: common.runLoadingIndicator(),
                success: function (res) {
                    if (res.Status) {
                        $('#add-edit-role').modal('show');

                        $('#txt-role-name').val(res.Data.Name);
                        $('#txt-role-description').val(res.Data.Description);
                        $('#ck-role-status').prop('checked', res.Data.Status);
                    }
                    common.stopLoadingIndicator();
                },
                error: function (err) {
                    common.notify('An error has occurred.', 'error');
                    common.stopLoadingIndicator();
                }
            });
        });

        $('body').on('click', '.btn-delete-role', function () {
            var roleId = $(this).attr('data-id');
            common.confirm('Are you sure to remove this role?', function () {
                $.ajax({
                    type: 'POST',
                    url: '/Admin/Role/DeleteRole',
                    data: { id: roleId },
                    beforeSend: common.runLoadingIndicator(),
                    success: function (res) {
                        if (res.Status) {
                            common.notify('Removed success role: ' + res.Message, 'success');
                        }
                        role.loadData();
                        common.stopLoadingIndicator();
                    },
                    error: function (err) {
                        common.notify('Remove role failed.', 'error');
                        common.stopLoadingIndicator();
                    }
                });
            });
        });

        $('body').on('click', '.btn-grant-permission', function () {
            $('#hid-role-id').val($(this).attr('data-id'));
            $('#grant-permission-modal').modal('show');
            role.clearPermission();
            role.fillPermission($(this).attr('data-id'));
        });

        $('#btn-save-role').on('click', function () {
            var id = $('#hid-role-id').val();
            if (validator.form()) {
                var roleVm = {};
                if (id != '') {
                    roleVm.Id = id;
                }
                roleVm.Name = $('#txt-role-name').val();
                roleVm.Description = $('#txt-role-description').val();
                roleVm.Status = $('#ck-role-status').is(':checked') ? 1 : 0;

                $.ajax({
                    type: 'POST',
                    url: '/Admin/Role/SaveRole',
                    data: { appRoleViewModel: roleVm },
                    beforeSend: common.runLoadingIndicator(),
                    success: function (res) {
                        common.notify('Save success role: ' + res.Data.Message, 'success');
                        $('#add-edit-role').modal('hide');
                        common.stopLoadingIndicator();
                        role.loadData();
                    },
                    error: function (err) {
                        common.notify('An error has occurred', 'error');
                        common.stopLoadingIndicator();
                    }
                });
            }
        });

        $('#ck-read-all').off('click').on('click', function () {
            var isChecked = $('#ck-read-all').is(':checked');
            if (isChecked) {
                $('#tbl-permisson-body #ck-read-permission').each(function (i, item) {
                    $(item).prop('checked', true);
                });
            } else {
                $('#tbl-permisson-body #ck-read-permission').each(function (i, item) {
                    $(item).prop('checked', false);
                });
            }
        });

        $('#ck-create-all').off('click').on('click', function () {
            var isChecked = $('#ck-create-all').is(':checked');
            if (isChecked) {
                $('#tbl-permisson-body #ck-create-permission').each(function (i, item) {
                    $(item).prop('checked', true);
                });
            } else {
                $('#tbl-permisson-body #ck-create-permission').each(function (i, item) {
                    $(item).prop('checked', false);
                });
            }
        });

        $('#ck-update-all').off('click').on('click', function () {
            var isChecked = $('#ck-update-all').is(':checked');
            if (isChecked) {
                $('#tbl-permisson-body #ck-update-permission').each(function (i, item) {
                    $(item).prop('checked', true);
                });
            } else {
                $('#tbl-permisson-body #ck-update-permission').each(function (i, item) {
                    $(item).prop('checked', false);
                });
            }
        });

        $('#ck-delete-all').off('click').on('click', function () {
            var isChecked = $('#ck-delete-all').is(':checked');
            if (isChecked) {
                $('#tbl-permisson-body #ck-delete-permission').each(function (i, item) {
                    $(item).prop('checked', true);
                });
            } else {
                $('#tbl-permisson-body #ck-delete-permission').each(function (i, item) {
                    $(item).prop('checked', false);
                });
            }
        });

        $('body').on('click', '#ck-read-permission', function () {
            role.isReadAll();
        });

        $('body').on('click', '#ck-create-permission', function () {
            role.isCreateAll();
        });

        $('body').on('click', '#ck-update-permission', function () {
            role.isEditAll();
        });

        $('body').on('click', '#ck-delete-permission', function () {
            role.isDeleteAll();
        });

        $('#btn-save-permission').off('click').on('click', function () {
            var roleId = $('#hid-role-id').val();
            var listPermission = [];
            $('#tbl-permisson-body tr').each(function (i, item) {
                var permission = {};
                permission.RoleId = roleId;
                permission.FunctionId = $(item).attr('data-id');
                permission.CanRead = $(item).find('#ck-read-permission').is(':checked');
                permission.CanCreate = $(item).find('#ck-create-permission').is(':checked');
                permission.CanEdit = $(item).find('#ck-update-permission').is(':checked');
                permission.CanDelete = $(item).find('#ck-delete-permission').is(':checked');
                listPermission.push(permission);
            });
            $.ajax({
                type: 'POST',
                url: '/Admin/Role/SavePermission',
                data: {
                    permissionViewModels: listPermission,
                    roleId: roleId
                },
                beforeSend: common.runLoadingIndicator(),
                success: function () {
                    $('#grant-permission-modal').modal('hide');
                    common.notify('Save success', 'success');
                    common.stopLoadingIndicator();
                },
                error: function (err) {
                    common.notify('An error has occurred', 'error');
                    common.stopLoadingIndicator();
                }
            });
        });
    },

    loadData: function () {
        $.ajax({
            type: 'GET',
            url: '/Admin/Role/GetAll',
            beforeSend: common.runLoadingIndicator(),
            success: function (res) {
                var render = '';
                var template = $('#tbl-role-template').html();
                $.each(res, function (i, item) {
                    var obj = {};
                    obj.Id = item.Id;
                    obj.Name = item.Name;
                    obj.Description = item.Description;
                    obj.Status = common.getStatusLabel(item.Status);
                    render += Mustache.render(template, obj);
                });
                $('#tbl-render-role').html(render);
                common.stopLoadingIndicator();
            },
            error: function (err) {
                common.notify('An error has occurred', 'error');
                common.stopLoadingIndicator();
            }
        });
    },

    loadFunction: function () {
        var render = '';
        var template = $('#tbl-permission-template').html();
        $.ajax({
            type: 'GET',
            url: '/Admin/Role/GetAllFunction',
            beforeSend: common.runLoadingIndicator(),
            success: function (res) {
                $.each(res, function (i, item) {
                    var obj = {};
                    obj.Id = item.Id;
                    if (item.ParentId != null) {
                        obj.ParentId = ' treegrid-parent-' + item.ParentId;
                    }
                    obj.Function = '<strong>' + item.Name + '</strong>';
                    render += Mustache.render(template, obj);
                });
                $('#tbl-permisson-body').html(render);

                $('.tree').treegrid({
                    'initialState': 'collapsed',
                });

                common.stopLoadingIndicator();
            },
            error: function (err) {
                common.notify('An error has occurred', 'error');
                common.stopLoadingIndicator();
            }
        });
    },

    fillPermission: function (roleId) {
        $.ajax({
            type: 'GET',
            url: '/Admin/Role/LoadPermissionByRoleId',
            data: { guidId: roleId },
            beforeSend: common.runLoadingIndicator(),
            success: function (res) {
                $.each(res, function (i, item) {
                    $('#tbl-permisson-body').find('tr[data-id="' + item.FunctionId + '"] #ck-read-permission').prop('checked', item.CanRead);
                    $('#tbl-permisson-body').find('tr[data-id="' + item.FunctionId + '"] #ck-create-permission').prop('checked', item.CanCreate);
                    $('#tbl-permisson-body').find('tr[data-id="' + item.FunctionId + '"] #ck-update-permission').prop('checked', item.CanEdit);
                    $('#tbl-permisson-body').find('tr[data-id="' + item.FunctionId + '"] #ck-delete-permission').prop('checked', item.CanDelete);

                    role.isReadAll();
                    role.isCreateAll();
                    role.isEditAll();
                    role.isDeleteAll();
                });
                common.stopLoadingIndicator();
            },
            error: function (err) {
                common.notify('An error has occurred', 'error');
                common.stopLoadingIndicator();
            }
        });
    },

    isReadAll: function () {
        var listReads = $('#tbl-permisson-body #ck-read-permission').length;
        totalChecked = $('#tbl-permisson-body #ck-read-permission:checked').length;

        if (totalChecked < listReads) {
            $('#ck-read-all').prop('checked', false);
        } else {
            $('#ck-read-all').prop('checked', true);
        }
    },

    isCreateAll: function () {
        var listReads = $('#tbl-permisson-body #ck-create-permission').length;
        totalChecked = $('#tbl-permisson-body #ck-create-permission:checked').length;

        if (totalChecked < listReads) {
            $('#ck-create-all').prop('checked', false);
        } else {
            $('#ck-create-all').prop('checked', true);
        }
    },

    isEditAll: function () {
        var listReads = $('#tbl-permisson-body #ck-update-permission').length;
        totalChecked = $('#tbl-permisson-body #ck-update-permission:checked').length;

        if (totalChecked < listReads) {
            $('#ck-update-all').prop('checked', false);
        } else {
            $('#ck-update-all').prop('checked', true);
        }
    },

    isDeleteAll: function () {
        var listReads = $('#tbl-permisson-body #ck-delete-permission').length;
        totalChecked = $('#tbl-permisson-body #ck-delete-permission:checked').length;

        if (totalChecked < listReads) {
            $('#ck-delete-all').prop('checked', false);
        } else {
            $('#ck-delete-all').prop('checked', true);
        }
    },

    clearPermission: function () {
        $('.tbl-permission input[type="checkbox"]').prop('checked', false);
    },

    clearForm: function () {
        $('#txt-role-name').val('');
        $('#txt-role-description').val('');
    }
}
role.init();