var map;
var serviceLocation = 'http://ovent.net/PartyFinder/party.php';
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
                    var partyOptions = {
                        strokeColor: typeColor[data.parties[party].type - 1],
                        strokeOpacity: 0.8,
                        clickable: true,
                        strokeWeight: 2,
                        fillColor: typeColor[data.parties[party].type-1],
                        fillOpacity: 0.35,
                        map: map,
                        center: new google.maps.LatLng(data.parties[party].lat, data.parties[party].long),
                        radius: 100
                    };
                    partyCircle = new google.maps.Circle(partyOptions);
                    var infoWindow = new google.maps.InfoWindow({
                        content: data.parties[party].description + '\
</br> Nombre de places restantes : ' + data.parties[party].slot
                    });
                    google.maps.event.addListener(partyCircle, 'click', function (ev) {
                        infoWindow.setPosition(partyCircle.getCenter());
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
    }, function() {
        alert('error');
    }, { timeout: 10000 });
    
}



$(function () {
    $("[data-role='navbar']").navbar();
    $("[data-role='footer']").toolbar();
    
    $('#use-my-position').click(function () {
        $.mobile.loading("show");
        navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationFail, { timeout: 10000 });
    });
    initialize();
    //CREATE SECTION 
    $('#create-form').submit(function (event) {
        var form = this;
        navigator.geolocation.getCurrentPosition(function (position) {
            $('#lat').val(position.coords.latitude);
            $('#long').val(position.coords.longitude);
            $.post(form.action, $(form).serialize(), null, "json")
            .done(function (data) {
                if (data.message == 'success') {
                    localStorage['partyId'] = data.id;
                }
            })
            .fail(function (data) {
                console.log(data.responseText);
            });
        }, function () {
            alert('error');
        }, { timeout: 10000 });
        
        event.preventDefault();
        return false;
    });

    //Retrieve party around

});
$(document).on("pageload", "#party", function() {
    $('#create').click();
});
$(document).on("pagecreate", "#profil", function () {
    profilViewModel = new ProfilViewModel();


    if (localStorage['profil']) {
        profilFromDB = JSON.parse(localStorage['profil']);
        if (profilFromDB.lastname)
            profilViewModel.lastname(profilFromDB.lastname);
        if (profilFromDB.photo)
            profilViewModel.photo(profilFromDB.photo);
        if (profilFromDB.firstname)
            profilViewModel.firstname(profilFromDB.firstname);
        if (profilFromDB.age)
            profilViewModel.age(profilFromDB.age);
        if (profilFromDB.isMan)
            profilViewModel.isMan(profilFromDB.isMan);

    }
    ko.applyBindings(profilViewModel, $('#profil')[0]);

    $('#nom,#prenom,#age,#sex').change(function () {
        localStorage['profil'] = ko.toJSON(profilViewModel);
    });
    $('#profil-picture').click(function () {
        navigator.camera.getPicture(onCameraSuccess, onCameraFail, {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            correctOrientation: true,
            correctOrientation: true,
            targetWidth: 200,
            targetHeight: 200,
        });
    });
});

//KO PROFILE MODEL//
var profilViewModel;

function ProfilViewModel() {
    this.lastname = ko.observable("John");
    this.firstname = ko.observable("Doe");
    this.photo = ko.observable("data:image/png;base64,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");
    this.age = ko.observable(0);
    this.isMan = ko.observable(false);
}


//END - KO PROFIL MODEL//

//LOCATION CALLBACK

function onLocationSuccess(position) {
    $('#lat').val(position.coords.latitude);
    $('#long').val(position.coords.longitude);
    $.get("http://maps.googleapis.com/maps/api/geocode/json?latlng={0},{1}".format(position.coords.latitude, position.coords.longitude),
        function (data) {
            console.log(data);
            if (data.results)
                $('#create #address').val(data.results[0].formatted_address);
    }).fail(function () {
        $('#internet-error').popup('open');
    }).always(function() {
        $.mobile.loading("hide");
    });
    console.log(position);
}
function onLocationFail(error) {
    $.mobile.loading("hide");
    $('#localisation-error').popup('open');
}


// CAMERA CALLBACK

function onCameraSuccess(imageData) {
    imageData = "data:image/jpeg;base64," +imageData;
    profilViewModel.photo(imageData);
    localStorage['profil'] = ko.toJSON(profilViewModel);
}

function onCameraFail(message) {
    console.log('Failed because: ' +message);
}
// END - CAMERA CALLBACK


// Update the contents of the toolbars
$(document).on("pagecontainerchange", function () {

    var current = $(".ui-page-active").attr('id');

    //fake panorama maison
    switch (current) {
        case "party":
            $('[href="#map"').data("direction", "");
            $('[href="#profil"').data("direction", "");
            var activtab = $('.ui-tabs-panel:visible').attr('id');
            $('[href="#' + activtab + '"]').click();
            break;
        case "map":
            $('[href="#party"').data("direction", "reverse");
            $('[href="#profil"').data("direction", "");
            //fix du à la map qui est collapse quand on est pas sur la page et qui se fout n'importe comment du coup quand on revient dessus
            if (map){
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            }
            break;
        case "profil":
            $('[href="#map"').data("direction", "reverse");
            $('[href="#party"').data("direction", "reverse");
            break;
}

    $("[data-role='navbar'] a.ui-btn-active").removeClass("ui-btn-active");
    $("[data-role='navbar'] a").each(function () {
        if ($(this).attr('href') === '#' +current) {
            $(this).addClass("ui-btn-active");
    }
    });
});

//HANDLE BROWSER WINKNESS
//handle min/max
$('#age').change(function () {
    if ($(this).val() < 18)
        $(this).val(18);
    if ($(this).val() > 50)
        $(this).val(50);
});

//JQM + KO
ko.bindingHandlers.jqmFlip = {
        init: function (element, valueAccessor) {
        var result = ko.bindingHandlers.value.init.apply(this, arguments);
        try {
            $(element).slider("refresh");
        } catch (x) {
        }
        return result;
},
        update: function (element, valueAccessor) {
        ko.bindingHandlers.value.update.apply(this, arguments);
        var value = valueAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);
        try {
            $(element).slider("refresh");
        } catch (x) {
        }
}
};
ko.extenders.booleanValue = function (target) {
    target.formattedValue = ko.computed({
            read: function () {
            if (target() === true) return "true";
            else if (target() === false) return "false";
    },
            write: function (newValue) {
            if (newValue) {
                if (newValue === "false") target(false);
                else if (newValue === "true") target(true);
            }
    }
    });

    target.formattedValue(target());
    return target;
};
var typeColor = ['#5099B2', '#FFA6BB', '#8CE1FF', '#CCC55C', '#B2AD59']