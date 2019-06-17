var base = {
    init: function () {
        this.registerEvents();
    },

    registerEvents: function () {
        $('#btn-subscribe').off('click').on('click', function () {
            var sub = {};
            sub.Email = $('#txt-email-sub').val();

            $.ajax({
                type: 'POST',
                url: '/Home/SubscribeEmail',
                data: {
                    emailSub: sub,
                },
                success: function (res) {
                    if (res == true) {
                        $('.newsleter-con').html('');
                        $('.newsleter-con').html('<div>Thank you for your subscription to our newsletter!</div>');
                        $('.newsleter-con').css({
                            'font-size': '30px',
                            'font-weight': 'bold',
                            'text-align': 'center',
                            'color': 'white',
                        });
                    } else {
                        $('#txt-email-sub').attr('title', 'Please enter a valid email address.');
                        $('#txt-email-sub').tooltip('show');
                    }
                }
            });
        });

        base.checkScreen();

        $(window).on('resize', function () {
            var fontSize = Math.floor($('.job-search').width() / 11);
            $(".add-size").css({ 'font-size': fontSize });
        });
    },

    checkScreen: function () {
        var fontSize = Math.floor($('.job-search').width() / 11);
        $(".add-size").css({ 'font-size': fontSize });
    },
}
base.init();

$(document).ajaxSend(function (e, xhr, options) {
    if (options.type.toUpperCase() == "POST" || options.type.toUpperCase() == "PUT") {
        var token = $('form').find("input[name='__RequestVerificationToken']").val();
        xhr.setRequestHeader("RequestVerificationToken", token);
    }
});