var common = {
    notify: function (message, type) {
        $.notify(message, {
            // whether to hide the notification on click
            clickToHide: true,
            // whether to auto-hide the notification
            autoHide: true,
            // if autoHide, hide after milliseconds
            autoHideDelay: 5000,
            // show the arrow pointing at the element
            arrowShow: true,
            // arrow size in pixels
            arrowSize: 5,
            // position defines the notification position though uses the defaults below
            position: 'bottom right',
            // default positions
            elementPosition: 'bottom left',
            globalPosition: 'top right',
            // default style
            style: 'bootstrap',
            // default class (string or [string])
            className: type,
            // show animation
            showAnimation: 'slideDown',
            // show animation duration
            showDuration: 400,
            // hide animation
            hideAnimation: 'slideUp',
            // hide animation duration
            hideDuration: 200,
            // padding between element and notification
            gap: 2
        });
    }, // library notify.js

    confirm: function (message, okCallback) {
        bootbox.confirm({
            message: message,
            buttons: {
                confirm: {
                    label: 'OK',
                    className: 'btn-primary'
                },
                cancel: {
                    label: 'Cancel',
                    className: 'btn-cecondary'
                }
            },
            callback: function (result) {
                if (result === true) {
                    okCallback();
                }
            }
        });
    }, // library bootbox.js

    formatDate: function (dateInput) {
        if (dateInput != null || dateInput != '') {
            var date = new Date(Date.parse(dateInput)).toLocaleDateString();
            return date;
        } else {
            return '';
        }
    },

    formatDateTime: function (dateTimeInput) {
        if (dateTimeInput != null && dateTimeInput !== '') {
            var date = new Date(Date.parse(dateTimeInput)).toLocaleDateString();
            var time = new Date(Date.parse(dateTimeInput)).toLocaleTimeString();
            var dateTime = date + ' ' + time;
            return dateTime;
        } else {
            return '';
        }
    },

    formartNumber: function (number, format) {
        if (!isFinite(number)) {
            return number.toString();
        }
        var string = numeral(number).format(format);
        return string;
    },// library numeral.js

    formatImage: function (img) {
        var style = "setImg";
        var defaultImg = '/admin-side/images/loading.gif';
        return img != null ? '<img class="' + style + '" src="' + img + '" width="40" />' : '<img class="' + style + '" src="' + defaultImg + '" width="40" />';
    },

    formatImageWithSize: function (img, size) {
        var style = "setImg";
        var defaultImg = '/admin-side/images/loading.gif';
        return img != null ? '<img class="' + style + '" src="' + img + '" width="' + size + '" />' : '<img class="' + style + '" src="' + defaultImg + '" width="' + size + '" />';
    },

    getStatusLabel: function (status) {
        if (status === 1) {
            return '<span class="badge bg-green ">Activated</span>'
        } else {
            return '<span class="badge bg-red ">Blocked</span>'
        }
    },

    getStatusResponse: function (status) {
        if (status === 1) {
            return '<span class="badge bg-green ">Respond</span>'
        } else {
            return '<span class="badge bg-orange ">New</span>'
        }
    },

    unflattern: function (arr) {
        'use strict';
        var map = {};
        var roots = [];
        for (var i = 0; i < arr.length; i++) {
            arr[i].children = [];
            map[arr[i].id] = i;    // 1 key : 1 value ==>> add this obj to a dictionary
        }
        for (var i = 0; i < arr.length; i += 1) {
            var node = arr[i];
            // use map to look-up the parents
            if (node.parentId !== null) {
                arr[map[node.parentId]].children.push(node);
            } else {
                roots.push(node);
            }
        }
        return roots;
    },

    loadEditor: function (contentId) {
        CKEDITOR.replace(contentId, {
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

    readImg: function (file, onLoadCallback) {
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsDataURL(file);
    },

    runLoadingIndicator: function () {
        if (Math.random() >= 0.5) {
            $('body').loading({
                theme: 'dark',
            });
        }
        else {
            $('body').loading({
                theme: 'light'
            });
        }
    }, // library jquery-loading

    stopLoadingIndicator: function () {
        $('body').loading('stop');
    },// library jquery-loading

    definePaymentMethod: function (number) {
        switch (number) {
            case 0:
                return 'Cash on delivery';
            case 1:
                return 'Online banking';
            case 2:
                return 'Payment gateway';
            case 3:
                return 'Visa';
            case 4:
                return 'Master card';
            case 5:
                return 'Paypal';
            case 6:
                return 'Atm';
            default:
                break;
        }
    },

    defineTier: function (num) {
        switch (num) {
            case 0:
                return "Tier 2"
            case 1:
                return "Tier 5(TW)"
            case 2:
                return "Both"
            default:
        }
    },
}

$(document).ajaxSend(function (e, xhr, options) {
    if (options.type.toUpperCase() == "POST" || options.type.toUpperCase() == "PUT") {
        var token = $('form').find("input[name='__RequestVerificationToken']").val();
        xhr.setRequestHeader("RequestVerificationToken", token);
    }
});