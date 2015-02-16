//maps 
function initialize() {
    navigator.geolocation.getCurrentPosition(function (position) {
        var LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapProp = {
            center: LatLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        $.get(serviceLocation, { function: 'partiesAroundMe', lat: position.coords.latitude, long: position.coords.longitude, dist: 15 }, null, 'json')
        .done(function (data) {
            if (data.message == "success") {
                console.log(data.parties)
                for (party in data.parties) {
                    if (party == "equals") break;
                    var partyOptions = {
                        strokeColor: typeValues[data.parties[party].type - 1].color,
                        strokeOpacity: 0.8,
                        clickable: true,
                        strokeWeight: 2,
                        fillColor: typeValues[data.parties[party].type - 1].color,
                        fillOpacity: 0.35,
                        map: map,
                        center: randomMove(data.parties[party].lat, data.parties[party].long, 100),
                        radius: 100
                    };
                    partyCircle = new google.maps.Circle(partyOptions);
                    partyCircle.party = data.parties[party];
                   
                    google.maps.event.addListener(partyCircle, 'click', function (ev) {

                        var content = '<div class="gm-iw gm-sm" jstcache="0" style="width: 204px;">\
                                        <div class="gm-title" jscontent="i.result.name" jstcache="1">{0}</div>\
                                        <div class="gm-basicinfo" jstcache="0">{1}</div>\
                                        <div class="gm-rev" jstcache="0"> Nombre de places restantes : {2}</div>\
                                      </div>'.format(typeValues[this.party.type - 1].text, this.party.description, this.party.slot);

                        var infoWindow = new google.maps.InfoWindow({
                            content: content,
                            position: this.center
                        });
                        infoWindow.open(map);
                    });
                }
            }
            else {
                console.log(data);
            }
        })
        .fail(function (data) {
            console.log(data.responseText);
        });
    }, function () {
        alert('error');
    }, { timeout: 10000 });

}

function randomMove(lat, long, maxDist) {

    //Earth’s radius, sphere
    R = 6378137

    //offsets in meters
    dn = Random.next(-maxDist, maxDist);
    de = Random.next(-maxDist, maxDist);

    //Coordinate offsets in radians
    dLat = dn / R
    dLon = de / (R * Math.cos(Math.PI * lat / 180))

    //OffsetPosition, decimal degrees
    lat += dLat * 180 / Math.PI
    long += dLon * 180 / Math.PI
    return new google.maps.LatLng(lat, long);
}