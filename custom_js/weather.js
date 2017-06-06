$.simpleWeather({
    location: 'seoul, KR',
    woeid: '',
    unit: 'c',
    success: function(weather) {
      html = '<h2 style="height:120px"><i class="icon-'+weather.code+'"></i>'+weather.temp
      html +='</h2><h3>';
      for(var i=1;i<5;i++){
        html += '&nbsp;&nbsp;&nbsp;<i id="not-current" class="icon-'+weather.forecast[i].code+'"></i>'+weather.forecast[i].low+"|"+weather.forecast[i].high+"</span>";
      }
      html +='</h3>';


      $("#weather").html(html).fadeIn();
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });

/*
 $.simpleWeather({
            location: 'seoul, KR',
            unit: 'c',
            speed: 'kph',
            success: function(weather) {
               html = '<h2>'+weather.city+', '+weather.region+'</h2>';
               html += "<div style='width:50%;float:right;'><i class='current icon-'+weather.forecast[0].code+''></i></div><p class='current'>'+weather.temp+'<sub>°'+weather.units.temp+'</sub></p>";
               html += "<div class='clearfix'></div><ul class='sidebar-list'>";
               for(var i=0;i<weather.forecast.length;i++) {
                  html += "<li><span style='font-weight:700;'>'+weather.forecast[i].day+'</span><span><i class='icon-'+weather.forecast[i].high+''></i></span><span>'+weather.forecast[i].low+'<sub>°'+weather.units.temp+'</sub></span><span>'+weather.forecast[i].high+'<sub>°'+weather.units.temp+'</sub></span></li>";
               }
                 html += '</ul>';
               $('#weather').html(html);
            },

             error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });*/
