//Formatted date used in the history API to retrieve the most recent state of each device
let histDate = new Date().toISOString().slice(2,10).replace(/-/g,"");

//Retrieve all the device states and populate the Dashboard
function Refresh(){
	
	//API endpoint to retrieve all the device ID's from the database
	let urldeviceIDs="http://localhost:3000/getAllDeviceIDs"
  
	//API endpoint to retrieve the API key from the database
	let urlAPIKey="http://localhost:3000/getAPIKey"
	
	//API endpoint to retrieve the history of each device
	let urlHistory="https://qwikswitch.com/api/v1/history/"
  $.get(urlAPIKey, function(APIKey, status){
	}).done(function(dataAPIKey){

		$.get(urldeviceIDs, function(datadeviceID, status){
   	}).done(function(datadeviceID){
  	  let dataLength=datadeviceID.length
			
			//Loop through all the devices, retrieve the state and populate the dashboard
      for(x=0;x<datadeviceID.length;x++){
      	let urlHistoryParams=dataAPIKey[0].key + '/?date=' + histDate + '&devices=' + datadeviceID[x].deviceID + '&option=_lastIndex_'
        let deviceID=datadeviceID[x].deviceID
				
				//Send the request to retrieve the history
        $.get(urlHistory+urlHistoryParams, function(datadeviceID, status){
        }).done(function(datadeviceID){
					console.log(datadeviceID[deviceID].name)
					console.log(datadeviceID[deviceID].data.output[0][1])
				
					let Location=datadeviceID[deviceID].name
          let currentLevel=datadeviceID[deviceID].data.output[0][1]
					
					//Update the dashboard based on the DeviceID retrieved from each iteration of the loop
					switch(Location){

          	case 'Lounge':{
            	$("#loungeDimValue").text(currentLevel + '%')  
              $("#loungeDimmer").slider("option", "value",currentLevel);
              if(currentLevel==0){
              
								$("#loungelightBulb").hide()
							}
              else{
              	$("#loungelightBulb").show()      
              }
            }
            break;

            case 'Bedroom':{
						
            	$("#bedroomDimValue").text(currentLevel + '%')  
              $("#bedroomDimmer").slider("option", "value",currentLevel);
              if(currentLevel==0){
                $("#bedroomlightBulb").hide()
              }
              else{
                $("#bedroomlightBulb").show()      
              }
            }
            break;
 
						case 'Passage':{
							
            	if(currentLevel==1){
              	$("#passageValue").text("ON")
                $("#passageSwitch").text("Light OFF")
                $("#passagelightBulb").show()
              }
							else{
								$("#passageValue").text("OFF")
                $("#passageSwitch").text("Light ON")
                $("#passagelightBulb").hide()
              }
            }
            break;

            case 'GarageLight':{
            	if(currentLevel==1){
                $("#garageValue").text("ON")
                $("#garageSwitch").text("Light OFF")
                $("#garagelightBulb").show()
              }
							else{
                $("#garageValue").text("OFF")
                $("#garageSwitch").text("Light ON")
                $("#garagelightBulb").hide()
              };
						};  
            break;

						case 'WaterFeature':{
							
            	if(currentLevel==1){
              	$("#waterfeatureValue").text("ON")
                $("#waterfeatureSwitch").text("Pump OFF")
                $("#waterfeaturelightBulb").show()
              }
							else{
								$("#waterfeatureValue").text("OFF")
                $("#waterfeatureSwitch").text("Pump ON")
                $("#waterfeaturelightBulb").hide()
              }
            }
						break;

						case 'Lights':{
						
            	if(currentLevel==1){
                $("#featurelightsValue").text("ON")
                $("#featurelightsSwitch").text("Light OFF")
                $("#featurelightslightBulb").show()
              }
							else{
                $("#featurelightsValue").text("OFF")
                $("#featurelightsSwitch").text("Light ON")
                $("#featurelightslightBulb").hide()
              };
						};  
            	break;
          };
        });
   	  };
    });
	});
};

//Controlling the dimmer module (can be set from 0% up to 100%)
function setDimmer(Location,event,ui){
  let urldeviceID="http://localhost:3000/getDeviceID?Location=" + Location
  let urlAPIKey="http://localhost:3000/getAPIKey"
  let urlLightControl="https://qwikswitch.com/api/v1/control/"
  
	//Retrieve API key
	$.get(urlAPIKey, function(dataAPIKey, status){
  }).done(function(dataAPIKey){
  	
		//Retrieve the DeviceID to control
		$.get(urldeviceID, function(datadeviceID, status){
    }).done(function(datadeviceID){
    	
			//Construct the API endpoint URL 
			urlLightControl=urlLightControl + dataAPIKey[0].key + '?device='+datadeviceID.deviceID + '&setlevel=' + ui.value
      
			//Send the request to control the device
			$.get(urlLightControl, function(data, status){
      	console.log(datadeviceID.Location)             
				console.log(data.level)  
			});
    });
  });
};

//Controlling the light module (can be set on or off)
function setLight(Location,history){
  
	let urldeviceID="http://localhost:3000/getDeviceID?Location=" + Location
  let urlAPIKey="http://localhost:3000/getAPIKey"
  let urlgetHistory="https://qwikswitch.com/api/v1/history/"
  let currentState=''
  let urlControl='https://qwikswitch.com/api/v1/control/'
  
	//Retrieve API key
	$.get(urlAPIKey, function(dataAPIKey, status){
  }).done(function(dataAPIKey){
 
		//Retrieve the DeviceID to control
		$.get(urldeviceID, function(datadeviceID, status){
    }).done(function(datadeviceID){
      
			//Construct the history API endpoint URL to determine the most recent state (used when turning device on and off)
	    urlgetHistory=urlgetHistory + dataAPIKey[0].key + '/?date=' + histDate + '&devices=' + datadeviceID.deviceID + '&option=_lastIndex_'
      
			//Send the request to control the retrieve the history
			$.get(urlgetHistory, function(data, status){
  	    return data
    	}).done(function(data){
      	currentState=data[datadeviceID.deviceID].data.output[0][1]
        
				if(currentState==0){
        	
					//Construct the API endpoint URL 
					urlControl=urlControl + dataAPIKey[0].key + '?device='+datadeviceID.deviceID + '&setlevel=100'
          
					//Send the request to control the device (turn on)
					$.get(urlControl, function(data, status){
          }).done(function(data){
						console.log("Success")
						console.log(data.success)
						console.log(datadeviceID.Location)             
						console.log(data.level)    
						
          	if(Location=='WaterFeature'){
							$("#" + Location.toLowerCase() +  "Value").text("ON");
            	$("#" + Location.toLowerCase() +  "Switch").text("Pump OFF");
            	$("#" + Location.toLowerCase() + "lightBulb").show();
						}
						else{
							$("#" + Location.toLowerCase() +  "Value").text("ON");
							$("#" + Location.toLowerCase() +  "Switch").text("Light OFF");
							$("#" + Location.toLowerCase() + "lightBulb").show();
						}
          })
        }

        if(currentState==1){
        	
					//Construct the API endpoint URL 
					urlControl=urlControl + dataAPIKey[0].key + '?device='+datadeviceID.deviceID + '&setlevel=0'
          
					//Send the request to control the device (turn off)
					$.get(urlControl, function(data, status){
          }).done(function(data){
						console.log("Success")
						console.log(data.success)
						console.log(datadeviceID.Location)             
						console.log(data.level) 

						if(Location=='WaterFeature'){
							//updateDisplay(Location,currentState,"ON","Light OFF")
							$("#" + Location.toLowerCase() +  "Value").text("OFF");
							$("#" + Location.toLowerCase() +  "Switch").text("Pump ON");
							$("#" + Location.toLowerCase() + "lightBulb").show();
							}
							else{
								$("#" + Location.toLowerCase() +  "Value").text("OFF");
								$("#" + Location.toLowerCase() +  "Switch").text("Light ON");
								$("#" + Location.toLowerCase() + "lightBulb").hide();
							}
        	});
        };
      });
    });
 });
};

//Update the dashboard display
function Dimmer(Location,event,ui){
	setDimmer(Location,event,ui)
  $("#" + Location.toLowerCase() +"DimValue").text($("#" + Location.toLowerCase() + "Dimmer").slider("option", "value") + '%')
	if(ui.value==0){
  	$("#" + Location.toLowerCase() +"lightBulb").hide()
  }
  else{
    $("#" + Location.toLowerCase() +"lightBulb").show()      
  };
};

function passageLight(Location){
  setLight(Location)
};

function garageLight(Location){
  setLight(Location)
};

function waterFeatureLight(Location){
  setLight(Location)
};

function featureLights(Location){
  setLight(Location)
};

//When the application loads get the history of the devices and update the display
$(function(){
	Refresh();
  $("#bedroomDimmer").on("slidestop", function(event,ui){
  	Dimmer('Bedroom',event,ui);
  });

  $("#loungeDimmer").on("slidestop", function(event,ui){
  	Dimmer('Lounge',event,ui);
  });

  $("#passageSwitch").on("click", function(data){
  	passageLight('Passage');
  });

  $("#garageSwitch").on("click", function(data){
  	garageLight('Garage');
  });

  $("#waterfeatureSwitch").on("click", function(data){
    waterFeatureLight('WaterFeature');
  });
        
  $("#featurelightsSwitch").on("click", function(data){
    featureLights('FeatureLights');
  });

	$("#house_container").hide();
  $("#garden_container").hide();
  $("#Refresh").on("click", function(){
		Refresh();
	}) 
   
  $("#house").on('click', function () {
  	$("#house_container").delay(500);
  	$("#house_container").slideDown(500);
  	$("#garden_container").slideUp(500);
  })

  $("#garden").on('click', function () {
	  $("#garden_container").delay(500);
    $("#garden_container").slideDown(500);
    $("#house_container").slideUp(500);
  })

	//Set the dimmer slider attributes
  $("#loungeDimmer").slider({
		value:0,
		min: 0,
    max: 100,
    step: 1
  });

	//Set the dimmer slider attributes
  $("#bedroomDimmer").slider({
		value:0,
		min: 0,
    max: 100,
    step: 1
  });            

})
