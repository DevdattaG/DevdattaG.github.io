$(document).ready(function(){
	console.log("app loaded");
	if(window.location.hash === "")
	{
		$("#backArrow").hide();
		$("#homeScreen").show();
		$("#infoScreen").hide();
		fetchData();
	}else if(+window.location.hash.split('#')[1] > 0)
	{
		showInfoScreen(window.location.hash.split('#')[1]);
	}	

	$("#backArrow").click(function(){		
		window.location = "index.html";
	});
});

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
	return '<div class="section"><a onclick=showInfoScreen('+id+'); href="#'+id+'"><div class="row"><div class="col-xs-6"><img class= "img-responsive img-rounded homeImages" src="./'+image+'" ></div><div class="col-xs-6"></div><p class="placeTitle">'+name+'</p><p class="placeCountry">'+country+'</p></div></a></div>';	
}

function showImageGallery(image){
	return '<div class="col-xs-12 pad10"><img class= "img-responsive img-rounded" src="./'+image+'" ></div>';
}

function showInfoScreen(id){
	$("#backArrow").show();
	$("#homeScreen").hide();
	$("#infoScreen").show();
	var source = "./data/data"+ id +".json"
	fetch(source)
	.then(function(response){
		console.log(response);
		response.text().then(function(myData){
			var outputData = JSON.parse(myData);			
			$("#infoName").html(outputData.name);
			$("#infoCity").html(outputData.city?outputData.city+", "+outputData.country:outputData.country);
			$("#infoDescription").html(outputData.description);
			$("#infoImage").attr("src",outputData.imageUrl);
			var imageData = "";
			outputData.imageGallery.forEach(function(val){
				imageData+=showImageGallery(val);
			});
			$("#infoGallery").html(imageData);
		});
	});		
}