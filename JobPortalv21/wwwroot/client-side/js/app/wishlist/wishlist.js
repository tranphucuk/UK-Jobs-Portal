var wishlist = {
    init: function () {
        this.registerEvents();
    },

    registerEvents: function () {
        $('body').on('click', '.btn-delete-product', function (e) {
            var jobId = $(this).data('id');
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url: '/Wishlist/RemoveJob',
                data: {
                    jobId: jobId
                },
                success: function (res) {
                    if (res == true) {
                        location.reload();
                    } else {
                        window.location.href = "/login.html";
                    }
                }
            })
        });
    },
}
wishlist.init();