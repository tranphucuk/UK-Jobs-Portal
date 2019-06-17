var job = {
    init: function () {
        job.loadData();
        this.loadTier('#ddl-tier-info');
        job.loadTags();
        job.registerEvents();
        this.loadCkEditor();
    },

    registerEvents: function () {
        var validator = $('#frm-job').validate({
            errorClass: 'red',
            rules: {
                txtJobIndustry: 'required',
                txtJobCompany: 'required',
                txtJobWebsite: 'required',
                txtJobCity: 'required',
                ddlJoxTier: {
                    required: true,
                    number: true
                },
                txtJobTags: {
                    required: true
                },
                txtJobDescription: 'required',
            }
        })

        $('#ddl-display-number').on('change', function () {
            config.pageSize = $('#ddl-display-number :selected').text();
            config.pageIndex = 1;
            $('#pagination-job').twbsPagination('destroy');
            job.loadData();
        });

        $('#txt-keyword-job').on('keypress', function (e) {
            if (e.which === 13) {
                $('#btn-search-job').click();
            }
        });

        $('#btn-search-job').on('click', function () {
            $('#pagination-job').twbsPagination('destroy');
            $('#ddl-display-number').prop('selectedIndex', 0);
            config.pageIndex = 1;
            config.pageSize = 10;
            job.loadData();
        });

        $('#btn-excel-modal').on('click', function () {
            $('#btn-excel-options').modal('show');
        });

        $('body').on('click', '#btn-import-excel', function () {
            $('#file-import-excel').click();
        });

        $('#file-import-excel').on('change', function () {
            var file = this.files[0];
            var fd = new FormData();
            fd.append('files', file);
            $('#btn-excel-options').modal('hide');
            $.ajax({
                type: 'POST',
                url: '/Admin/Job/ImportJob',
                data: fd,
                processData: false,
                contentType: false,
                beforeSend: common.runLoadingIndicator,
                success: function (res) {
                    common.notify('Import succeeded', 'success');
                    job.loadData();
                    common.stopLoadingIndicator();
                },
                error: function (err) {
                    common.notify('Err: ' + err, 'error');
                    console.log(err);
                    common.stopLoadingIndicator();
                }
            });
        });

        $('#btn-create-job').off('click').on('click', function () {
            $('#add-edit-job').modal('show');
            validator.resetForm();
            job.clearForm();
            job.loadTier('#ddl-bind-tier');
            job.dropdownConfig();
        });

        $('#btn-save-job').off('click').on('click', function () {
            var id = $('#hid-job-id').val();
            if (validator.form()) {
                var jobVm = {};
                if (id !== '') {
                    jobVm.Id = id;
                    jobVm.CreatedDate = $('#txt-job-created-at').val();
                }
                jobVm.Industry = $('#txt-job-name').val();
                jobVm.Company = $('#txt-job-company').val();
                jobVm.Website = $('#txt-job-website').val();
                jobVm.Description = CKEDITOR.instances['txtJobContent'].getData();
                jobVm.City = $('#txt-job-city').val();
                jobVm.Tier = $('#ddl-bind-tier :selected').val();
                jobVm.Tags = $('.select-job-tag').val().join();
                jobVm.Status = $('#ck-job-status').is(':checked') ? 1 : 0;

                $.ajax({
                    type: 'POST',
                    url: '/Admin/Job/SaveJob',
                    data: { jobViewModel: jobVm },
                    beforeSend: common.runLoadingIndicator(),
                    success: function (res) {
                        common.notify('Save job success', 'success');
                        $('#add-edit-job').modal('hide');
                        job.loadData();
                        common.stopLoadingIndicator();
                    },
                    error: function (err) {
                        common.notify('An error has occurred while saving.', 'error');
                        console.log(err);
                        common.stopLoadingIndicator();
                    }
                });
            }
        });

        $('body').on('click', '.btn-edit-job', function () {
            job.clearForm();
            validator.resetForm();
            var jobId = $(this).attr('data-id');
            $('#hid-job-id').val(jobId);
            $.ajax({
                type: 'GET',
                url: '/Admin/Job/GetJobDetail',
                data: { id: jobId },
                beforeSend: common.runLoadingIndicator(),
                success: function (res) {
                    $('#add-edit-job').modal('show');
                    job.loadTier('#ddl-bind-tier');

                    $('#txt-job-name').val(res.Industry);
                    $('#txt-job-company').val(res.Company);
                    $('#txt-job-website').val(res.Website);
                    CKEDITOR.instances['txtJobContent'].setData(res.Description);
                    $('#txt-job-city').val(res.City);
                    $('#ddl-bind-tier').val(res.Tier);

                    var tags = res.Tags.split(',');
                    $('.select-job-tag').val(tags);
                    job.dropdownConfig();

                    $('#ck-job-status').prop('checked', res.Status);
                    $('#txt-job-created-at').val(common.formatDateTime(res.CreatedDate));
                    $('#txt-job-modified-at').val(common.formatDateTime(res.ModifiedDate));

                    common.stopLoadingIndicator();
                },
                error: function (err) {
                    common.notify('Error loading job', 'error');
                    console.log(err);
                    common.stopLoadingIndicator();
                }
            });
        });

        $('body').on('click', '.btn-delete-job', function () {
            var jobId = $(this).attr('data-id');
            common.confirm('Are you sure to remove this job?', function () {
                $.ajax({
                    type: 'POST',
                    url: '/Admin/Job/DeleteJob',
                    data: { id: jobId },
                    beforeSend: common.runLoadingIndicator(),
                    success: function (res) {
                        common.notify('delete success', 'success');
                        $('#txt-keyword-job').val('');
                        $('#ddl-tier-info').val('');
                        $('#pagination-job').twbsPagination('destroy');
                        job.loadData();
                        common.stopLoadingIndicator();
                    },
                    error: function (err) {
                        common.notify('An error has occurred while deleting', 'error');
                        console.log(err);
                        common.stopLoadingIndicator();
                    }
                });
            });
        });
    },

    loadCkEditor: function () {
        CKEDITOR.replace('txtJobContent', {
            language: 'en',
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

    loadTags: function () {
        $.ajax({
            type: 'GET',
            url: '/Admin/Job/GetTags',
            success: function (res) {
                $.each(res, function (i, item) {
                    $('.select-job-tag').append('<option value="' + item + '">' + item + '</option>')
                });
            }
        });
    },

    dropdownConfig: function () {
        $(".select-job-tag").chosen({
            disable_search_threshold: 10,
            no_results_text: "Oops, nothing found!",
            width: "100%"
        });
        $(".select-job-tag").trigger("chosen:updated");
    },

    loadTier: function (selector) {
        $(selector).append('<option disabled="disabled" value="" selected="selected">Tier</option>')
        $.ajax({
            type: 'GET',
            url: '/Admin/Job/ParseEnum',
            dataType: 'json',
            success: function (res) {
                $.each(res, function (i, item) {
                    $(selector).append('<option value="' + item.Value + '" >' + item.Text + '</option>');
                });
            }
        });
    },

    loadData: function () {
        var render = '';
        var template = $('#tbl-job-template').html();
        $.ajax({
            type: 'GET',
            url: '/Admin/Job/GetAllPaging',
            dataType: 'json',
            data: {
                tier: $('#ddl-tier-info').val(),
                keyword: $('#txt-keyword-job').val(),
                pageSize: config.pageSize,
                page: config.pageIndex
            },
            beforeSend: common.runLoadingIndicator(),
            success: function (res) {
                if (res.Total == 0) {
                    common.notify('No Job Matched', 'error');
                    common.stopLoadingIndicator();
                    return;
                }
                $.each(res.Result, function (i, item) {
                    var obj = {};
                    obj.Id = item.Id;
                    obj.Job = item.Industry;
                    obj.Company = item.Company;
                    obj.Website = item.Website;
                    obj.Tier = common.defineTier(item.Tier);
                    obj.City = item.City;
                    obj.Status = common.getStatusLabel(item.Status);

                    render += Mustache.render(template, obj);
                });
                if (render != '') {
                    $('#tbl-render-job').html(render);
                }
                if (res.Total > 0) {
                    job.paging(res.Total);
                }
                $('#total-job').html(res.Total);
                common.stopLoadingIndicator();
            },
            error: function (err) {
                common.notify('An error has occurred while loading data', 'error');
                console.log(err);
                common.stopLoadingIndicator();
            }
        });
    },

    clearForm: function () {
        $('#txt-job-name').val('');
        $('#txt-job-company').val('');
        $('#txt-job-website').val('');
        $('#txt-job-city').val('');
        CKEDITOR.instances['txtJobContent'].setData('');
        $('#ddl-bind-tier').html('');
        $('.select-job-tag').val('');
        $('#frm-job-created').hide();
        $('#frm-job-modified').hide();
    },

    paging: function (records) {
        var totalPages = Math.ceil(records / config.pageSize);

        $('#pagination-job').twbsPagination({
            totalPages: totalPages,
            visiblePages: 5,
            onPageClick: function (event, page) {
                if (page != config.pageIndex) {
                    config.pageIndex = page;
                    job.loadData();
                }
            }
        });
    }
}
job.init();