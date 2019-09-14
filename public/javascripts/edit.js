$(document).ready(function()
{
	/*alert("hi");*/
	$('.remove').click(function()
	{
		/*alert("clicked");*/
		var id=$(this).val();
		/*alert(id);*/
		/*jquery*/
		$.post("/remove",{no:id},function(data)
		{
			location.reload('/');
		});
	});
	$(".edit").click(function()
	{
		var id=$(this).val();
		/*alert(id);*/
		$.post("/edit",{no:id},function(data)
		{
			/*alert(data);*/
			var a=JSON.stringify(data);
			var Parsedata=JSON.parse(a);
			/*alert(Parsedata[0].FirstName);*/
			$("#id").val(Parsedata[0]._id);
			$("#firstName1").val(Parsedata[0].FirstName);
			$("#lastName1").val(Parsedata[0].LastName);
			$("#email1").val(Parsedata[0].Email);
			$("#telephone1").val(Parsedata[0].Mobile);
			/*alert(a);*/
			/*location.reload('/');*/
		});
		$(".dontshow").show();
	})
});