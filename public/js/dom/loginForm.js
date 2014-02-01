/* use as handler for resize*/
$(window).resize(adjustLayout);
/* call function in ready handler*/
$(document).ready(function(){
    adjustLayout();
    // Attention : ugly hack to be able to take hashes (#) into account in the redirection URL. It makes impossible the use of hashes in the Login page
    $('#redirectUrl').val(getParameterByName('url') + window.location.hash);
})

function adjustLayout(){
    $('#signin-form').css({
        position:'absolute',
        top: ($(window).height() - $('#signin-form').height())/2
    });
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}