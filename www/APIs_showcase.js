document.addEventListener('deviceready', function () {
    document.getElementById('geolocation').addEventListener('click', function () {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var prop, data = position.coords;
                for (prop in data) {
                    document.getElementById(prop).innerHTML = data[prop];
                }
                var latLong = { lat: data.latitude, lng: data.longitude};
                var map = new google.maps.Map(
                    document.getElementById('googleMap'),
                    {
                        center: latLong,
                        zoom: 16,
                        mapTypeControl: false,
                        streetViewControl: false
                    }
                );
                var infowindow = new google.maps.InfoWindow({            
                    content: 'Είναι ωραίο να γνωρίζεις πού βρίσκεσαι...',
                    maxWidth: 150
                });
                var marker = new google.maps.Marker({                   
                    position: latLong,
                    map: map,
                    title: 'Η τρέχουσα θέση σας'
                });
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(map, marker);
                });
                document.getElementById('googleMap').style.display = 'block';
                document.getElementById('geolocationErrors').innerHTML = '';
            },
            function (error) {
                var errorMessage;
                if ( error.code == error.PERMISSION_DENIED ) {
                    errorMessage = 'Άρνηση χρήστη';
                } else if ( error.code == error.POSITION_UNAVAILABLE ) {
                    errorMessage = 'Αδυναμία λήψης δεδομένων';
                } else if ( error.code == error.TIMEOUT ) {
                    errorMessage = 'Παρέλευση χρονικού ορίου';
                } else {
                    errorMessage = 'Άγνωστο σφάλμα';
                }
                document.getElementById('geolocationErrors').innerHTML = errorMessage;
            },
            {
                enableHighAccuracy : true,
                timeout : 6000,
                maximumAge : 60000
            }
        );
    });

    // ------------------------- //

    document.getElementById('fileAPI').addEventListener('change', function () {
        var file = this.files.item(0),
            reader = new FileReader();

    // Android 4.3 not supporting addEventListener + load, loadend etc. events
        reader.onload = function () {
            document.getElementById('photo').src = reader.result;
        };

        reader.readAsDataURL(file);
    });

    // ------------------------- //

    document.getElementById('notificationButton').addEventListener('click', function () {
        var notify = function () {
                var notification = new Notification('Web Notification!', {
                    body: document.getElementById('notificationText').value,
                    icon: 'exclamation.png'
                });
            };

        if ( window.Notification ) {
            if ( Notification.permission === 'granted' ) {
                notify();
            }
            else if ( Notification.permission !== 'denied' ) {
                Notification.requestPermission(function (permission) {
                    if ( permission === 'granted' ) {
                        notify();
                    }
                });
            }
        } else {
            navigator.notification.alert(
                document.getElementById('notificationText').value,  // message
                function () {},                                     // callback
                'Web Notification!',                                // title
                'OK'                                                // buttonName
            );
        }
    });

    // ------------------------- //

    document.getElementById('vibration').addEventListener('click', function () {
        navigator.vibrate(300);
    });

    // ------------------------- //

    function myOrientationData(ev) {
        document.getElementById('absolute').innerHTML = ev.absolute;
        ['alpha', 'beta', 'gamma'].forEach(function (item) {
            document.getElementById(item).innerHTML = ev[item].toFixed();
        });
    };
    function myMotionData(ev) {
        document.getElementById('interval').innerHTML = ev.interval.toFixed();
        ['acceleration', 'accelerationIncludingGravity'].forEach(function (item) {
            if ( ev[item] ) { // ev.acceleration is null in Android 4.3
                document.getElementById(item).innerHTML = '(' + 
                    ev[item].x.toFixed() + ',' + ev[item].y.toFixed() + ',' + ev[item].z.toFixed() + ')';
            }
        });
        if ( ev.rotationRate ) { // ev.rotationRate is null in Android 4.3
            document.getElementById('rotationRate').innerHTML = '(' + 
                ev.rotationRate.alpha.toFixed() + ',' + ev.rotationRate.beta.toFixed() +
                ',' + ev.rotationRate.gamma.toFixed() + ')';
        }
    };
    document.getElementById('orientation').addEventListener('click', function () {
        if ( this.innerHTML == 'Έναρξη ανάγνωσης' ) {
            this.innerHTML = 'Λήξη ανάγνωσης';
            window.addEventListener('deviceorientation', myOrientationData);
            window.addEventListener('devicemotion', myMotionData);
        } else {
            this.innerHTML = 'Έναρξη ανάγνωσης';
            window.removeEventListener('deviceorientation', myOrientationData);
            window.removeEventListener('devicemotion', myMotionData);
        }
    });

    // ------------------------- //
    var batteryStatus;
    window.addEventListener('batterystatus', function (status) {
        batteryStatus = status;
    });
    document.getElementById('battery').addEventListener('click', function () {
        if ( navigator.getBattery ) {
            navigator.getBattery().then(function (battery) {
                document.getElementById('charging').innerHTML = battery.charging ? 'Ναι' : 'Όχι';
                document.getElementById('level').innerHTML = battery.level * 100;
            });
        } else {
            document.getElementById('charging').innerHTML = batteryStatus.isPlugged ? 'Ναι' : 'Όχι';
            document.getElementById('level').innerHTML = batteryStatus.level;
        }
    });
});