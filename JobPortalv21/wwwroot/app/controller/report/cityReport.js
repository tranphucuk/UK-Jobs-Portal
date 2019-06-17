var cityReport = {
    init: function () {
        this.loadData();
        this.registerEvents();
    },

    registerEvents: function () {
        $('#ddlShowPage').on('change', function () {
            config.pageSize = $('#ddlShowPage :selected').text();
            config.pageIndex = 1;
            $('#pagination-city').twbsPagination('destroy');
            cityReport.loadData();
        });

        $('#ddl-city-options').off('change').on('change', function () {
            config.pageSize = $('#ddlShowPage :selected').text();
            config.pageIndex = 1;
            $('#pagination-city').twbsPagination('destroy');
            cityReport.loadData();
        });

        $('#txt-city-keyword').on('keypress', function (e) {
            if (e.which === 13) {
                $('#btn-search-city').click();
            }
        });

        $('#btn-search-city').off('click').on('click', function () {
            $('#pagination-city').twbsPagination('destroy');
            $('#ddlShowPage').prop('selectedIndex', 0);
            config.pageSize = 10;
            config.pageIndex = 1;
            cityReport.loadData();
        });
    },

    loadData: function () {
        var render = '';
        var template = $('#tbl-visitor-template').html();
        $.ajax({
            type: 'GET',
            url: '/Admin/City/GetAllPaging',
            data: {
                sortType: $('#ddl-city-options').val(),
                keyword: $('#txt-city-keyword').val(),
                page: config.pageIndex,
                pageSize: config.pageSize,
            },
            beforeSend: common.runLoadingIndicator(),
            success: function (res) {
                $.each(res.Result, function (i, item) {
                    var visitor = {};
                    visitor.Id = item.Id;
                    visitor.City = item.City;
                    visitor.SearchCount = item.SearchCount;
                    visitor.DateView = common.formatDateTime(item.DateView);

                    render += Mustache.render(template, visitor);
                });
                $('#tbl-report-content').html(render);
                $('#lbl-total-report').html(res.RowCount);

                if (res.RowCount > 0) {
                    cityReport.pagination(res.RowCount);
                }
                common.stopLoadingIndicator();
            }
        });
    },

    pagination: function (total) {
        var totalPages = Math.ceil(total / config.pageSize);

        $('#pagination-city').twbsPagination({
            totalPages: totalPages,
            visiblePages: 5,
            onPageClick: function (event, page) {
                if (page != config.pageIndex) {
                    config.pageIndex = page;
                    cityReport.loadData();
                }
            }
        });
    },
}
cityReport.init();