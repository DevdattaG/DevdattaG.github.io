$(document).ready(function(){
	console.log("app loaded");
	if(window.location.hash === "")
	{
		$("#backArrow").hide();
	}
	//fetchData();

	$("#backArrow").click(function(){
		$("#backArrow").hide();
		window.location = "index.html";
	});

	// $(".selected").click(function(){
	// 	$("#backArrow").show();
	// });
});

function hideBackArrow()
{
	$("#backArrow").show();
}

function fetchData(){
	fetch("./data/dataAll.json")
	.then(function(response){
		console.log(response);
		response.text().then(function(myData){
			var outputData = "";
			JSON.parse(myData).forEach(function(val){
				outputData += showData(val.id,val.imageUrl,val.name,val.country);
			});			
			$("#homeScreen").html(outputData);
		});
	});		
}

function showData(id,image,name,country){	
	return '<div class="section"><a onclick=hideBackArrow(); href="#'+id+'"><div class="row"><div class="col-xs-6"><img class= "img-responsive img-rounded" src="./'+image+'" ></div><div class="col-xs-6"></div><p class="placeTitle">'+name+'</p><p class="placeCountry">'+country+'</p></div></a></div>';	
}