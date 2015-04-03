$(document).ready(function () {

    if ($.fn.footable) {
        $('.footable').footable();
    }

    // Delete File
    $(document).on('click', '.deleteFile', function() {
        var fileId = $(this).data('file');
        var that = this;
        $.ajax({
            url: '/files/' + fileId + '/delete',
            type: 'POST',
            dataType: 'json',
        }).done(function(res) {
            if (res.status) {
                that.closest('tr').remove();
                $('.footable').footable();
            } else {
                console.log(res.msg);
                window.alert(res.msg);
            }
        });
    });
});