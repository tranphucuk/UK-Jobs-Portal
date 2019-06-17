var jobDetail = {
    init: function () {
        this.registerEvents();
    },

    registerEvents: function () {
        $('#btn-add-wishlist').on('click', function (e) {
            var jobId = $(this).data('id');
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url: '/Wishlist/AddToWishlist',
                data: {
                    jobId: jobId,
                },
                success: function (res) {
                    if (res == true) {
                        location.reload();
                    } else {
                        window.location.href = "/login.html";
                    }
                }
            });
        });

        $('body').on('click', '.btn-delete-product', function () {
            var jobId = $(this).data('id');
            e.preventDefault();
            ajax({
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
    }
}
jobDetail.init();