$(document).ready(function(){
	$('.header-tabs a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	})
	$('.header-tabs a:first').tab('show')
});