$(document).ready(function(){
var
	$form = $("form[name='contact']"),
	$input = $("form input"),
	$submit = $("button[type=submit]")
;

function phoneFormat(telValue) {
	telValue = telValue.replace(/[^0-9]/g, '');
	telValue = telValue.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
	return telValue;
}

function processForm(e) {
	var
		formURL = $("form").attr("action"),
		postData = JSON.stringify({
			"first": $('#firstName').val(),
			"last": $('#lastName').val(),
			"email": $('#email').val(),
			"telephone": $('#telephone').val()
		})
	;

	$(".response").removeClass("hide");
	$(".response pre").html(JSON.stringify(postData));
	$form.addClass("hide");
	$(".alert-success").removeClass("hide");

	/*$.ajax({
		url: formUrl,
		dataType: 'json',
		type: 'post',
		contentType: 'application/json',
		data: postData,
		processData: false,
		success: function(data, textStatus, jQxhr) {
			$form.addClass("hide");
			$(".alert-success").removeClass("hide");
		},
		error: function(jqXhr, textStatus, errorThrown) {
			console.log(errorThrown);
			$(".alert-danger").removeClass("hide");
		}
	});
	e.preventDefault();*/
}

/*$form.submit(processForm);*/

$input.on('focus', function() {
	var $label = $("label[for='" + this.id + "']");
	$label.removeClass("hide").addClass('active');
});

$input.on('keyup focus blur', function() {
	var $label = $("label[for='" + this.id + "']");

	if(this.checkValidity()){
		$label.addClass("valid").removeClass("invalid");
		$(this).addClass("valid").removeClass("invalid");
	} else {
		$label.addClass("invalid").removeClass("valid");
		$(this).addClass("invalid").removeClass("valid");
	}

	$input.each(function(){
		var $label = $("label[for='" + this.id + "']");

		if($(this).val()){
			if(this.checkValidity()){
				$label.addClass("valid").removeClass("invalid");
				$(this).addClass("valid").removeClass("invalid");
			} else {
				$label.addClass("invalid").removeClass("valid");
				$(this).addClass("invalid").removeClass("valid");
			}
		}
	});

	// if($("form input.valid").length === $input.length){
	// 	$submit.prop("disabled", false);
	// } else {
	// 	$submit.prop("disabled", true);
	// }
});

$input.on('blur', function() {
	var $label = $("label[for='" + this.id + "']");

	$label.removeClass('active');

	if(!$(this).val()){
		$("label").addClass("hide");
	}

	$input.each(function(){
		var $label = $("label[for='" + this.id + "']");
		if($(this).val()){
			$label.removeClass("hide");
		}
	});

	if($("input.tel").val()){
		var telValue = $(".tel").val();
		telValue = phoneFormat(telValue);
		$(".tel").val(telValue);
	}
});
});