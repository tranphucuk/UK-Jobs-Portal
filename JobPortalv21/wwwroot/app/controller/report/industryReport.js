var industryReport = {
    init: function () {
        this.loadData();
        this.registerEvents();
    },

    registerEvents: function () {
        $('#ddlShowPage').on('change', function () {
            config.pageSize = $('#ddlShowPage :selected').text();
            config.pageIndex = 1;
            $('#pagination-industry').twbsPagination('destroy');
            industryReport.loadData();
        });

        $('#ddl-industry-options').off('change').on('change', function () {
            config.pageSize = $('#ddlShowPage :selected').text();
            config.pageIndex = 1;
            $('#pagination-industry').twbsPagination('destroy');
            industryReport.loadData();
        });

        $('#txt-industry-keyword').on('keypress', function (e) {
            if (e.which === 13) {
                $('#btn-search-industry').click();
            }
        });

        $('#btn-search-industry').off('click').on('click', function () {
            $('#pagination-industry').twbsPagination('destroy');
            $('#ddlShowPage').prop('selectedIndex', 0);
            config.pageSize = 10;
            config.pageIndex = 1;
            industryReport.loadData();
        });
    },

    loadData: function () {
        var render = '';
        var template = $('#tbl-industry-template').html();
        $.ajax({
            type: 'GET',
            url: '/Admin/Industry/GetAllPaging',
            data: {
                sortType: $('#ddl-industry-options').val(),
                keyword: $('#txt-industry-keyword').val(),
                page: config.pageIndex,
                pageSize: config.pageSize,
            },
            beforeSend: common.runLoadingIndicator(),
            success: function (res) {
                $.each(res.Result, function (i, item) {
                    var visitor = {};
                    visitor.Id = item.Id;
                    visitor.Industry = item.Industry;
                    visitor.SearchCount = item.SearchCount;
                    visitor.DateView = common.formatDateTime(item.DateView);

                    render += Mustache.render(template, visitor);
                });
                $('#tbl-report-content').html(render);
                $('#lbl-total-report').html(res.RowCount);

                if (res.RowCount > 0) {
                    industryReport.pagination(res.RowCount);
                }
                common.stopLoadingIndicator();
            }
        });
    },

    pagination: function (total) {
        var totalPages = Math.ceil(total / config.pageSize);

        $('#pagination-industry').twbsPagination({
            totalPages: totalPages,
            visiblePages: 5,
            onPageClick: function (event, page) {
                if (page != config.pageIndex) {
                    config.pageIndex = page;
                    industryReport.loadData();
                }
            }
        });
    },
}
industryReport.init();