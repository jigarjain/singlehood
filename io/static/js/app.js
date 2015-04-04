$(document).ready(function () {

    if ($.fn.footable) {
        $('.footable').footable();
    }

    $('.modal-trigger').leanModal();

    // Delete File
    $(document).on('click', '.deleteFile', function () {
        var fileId = $(this).data('file'),
        that = this;

        $.ajax({
            url: '/files/' + fileId + '/delete',
            type: 'POST',
            dataType: 'json'
        }).done(function (res) {
            if (res.status) {
                that.closest('tr').remove();
                $('.footable').footable();
            } else {
                console.log(res.msg);
            }
        });
    });
});
