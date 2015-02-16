//           __         .__                
//   _______/  |________|__| ____    ____  
//  /  ___/\   __\_  __ \  |/    \  / ___\ 
//  \___ \  |  |  |  | \/  |   |  \/ /_/  >
// /____  > |__|  |__|  |__|___|  /\___  / 
//      \/                      \//_____/  

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
}

String.prototype.endsWith = function (suffix) {
    return (this.substr(this.length - suffix.length) === suffix);
}

String.prototype.startsWith = function (prefix) {
    return (this.substr(0, prefix.length) === prefix);
}

// _____ ___________________  ___.__.
// \__  \\_  __ \_  __ \__  \<   |  |
//  / __ \|  | \/|  | \// __ \\___  |
// (____  /__|   |__|  (____  / ____|
//      \/                  \/\/     

Array.prototype.equals = function (array) {
    if (!array)
        return false;

    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
}

//                      __   .__        
//   ____  ____   ____ |  | _|__| ____  
// _/ ___\/  _ \ /  _ \|  |/ /  |/ __ \ 
// \  \__(  <_> |  <_> )    <|  \  ___/ 
//  \___  >____/ \____/|__|_ \__|\___  >
//      \/                  \/       \/ 
var CookiesManager = {

    setCookie: function (sName, sValue) {
        var today = new Date(), expires = new Date();
        expires.setTime(today.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = sName + "=" + encodeURIComponent(sValue) + ";expires=" + expires.toGMTString();
    },

    getCookie: function (sName) {
        var cookContent = document.cookie, cookEnd, i, j;
        var sName = sName + "=";

        for (i = 0, c = cookContent.length; i < c; i++) {
            j = i + sName.length;
            if (cookContent.substring(i, j) == sName) {
                cookEnd = cookContent.indexOf(";", j);
                if (cookEnd == -1) {
                    cookEnd = cookContent.length;
                }
                return decodeURIComponent(cookContent.substring(j, cookEnd));
            }
        }
        return null;
    }
}

//  __                               .__ 
// |  | ______   ____ _____    _____ |__|
// |  |/ /  _ \ /    \\__  \  /     \|  |
// |    <  <_> )   |  \/ __ \|  Y Y  \  |
// |__|_ \____/|___|  (____  /__|_|  /__|
//      \/          \/     \/      \/    

function KonamiManager() {

    var stack = [];
    var toListen = [];
    var timeOut;
    document.addEventListener('keyup', function (e) {
        clearTimeout(timeOut);
        stack.push(e.which);
        timeOut = setTimeout(function () { stack.length = 0 }, 1000);
        toListen.forEach(function (e) {
            if (e[0].equals(stack)) {
                e[1]();
                stack.length = 0;
            }
        });
    });

    this.addStringListener = function (knoma, callback) {
        var array = knoma.toUpperCase().split('');
        array.forEach(function (e, i, arr) {
            arr[i] = e.charCodeAt(0);
        });
        toListen.push([array, callback]);
    };

    this.addArrayListener = function (konami, callback) {
        toListen.push([konami, callback]);
    }
}


//   _____.__.__          
// _/ ____\__|  |   ____  
// \   __\|  |  | _/ __ \ 
//  |  |  |  |  |_\  ___/ 
//  |__|  |__|____/\___  >
//                     \/ 

function getBase64(file, callback) {

    var reader = new FileReader();
    reader.onload = function (readerEvt) {
        var base64 = readerEvt.target.result;
        callback(base64);
    }
    reader.readAsDataURL(file);
}

function dataURItoBlob(dataURI) {

    var byteString = atob(dataURI.split(',')[1]);
    var type = dataURI.split(',')[0].split(':')[1].split(';')[0]

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: type });
}

//              .__   
//  __ _________|  |  
// |  |  \_  __ \  |  
// |  |  /|  | \/  |__
// |____/ |__|  |____/

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

//                           .___              
// ____________    ____    __| _/____   _____  
// \_  __ \__  \  /    \  / __ |/  _ \ /     \ 
//  |  | \// __ \|   |  \/ /_/ (  <_> )  Y Y  \
//  |__|  (____  /___|  /\____ |\____/|__|_|  /
//             \/     \/      \/            \/

// Usage : Random.next(5) -> random between 0 & 5, Random.next(2,7) random between 2 & 7
var Random = {
    next: function (min, max) {
        if (!max) {
            max = min;
            min = 0;
        }

        if (min > max) {
            var tmp = max;
            max = min;
            min = tmp;
        }

        return Math.round((Math.random() * (max - min)) + min);
    }
}