var clock = new THREE.Clock();

var Signals = {
    takephoto: new Signal()
};

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

function onResizeWindow() {
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight;

    Halo.Config.onResizeWindow(w, h);
}

var controls = null;
// var pressed = false;
// var start_x = 0;
// var delta = 0;

// function onMouseDown(evt) {
//     var x = evt.clientX;
//     var y = document.documentElement.clientHeight - evt.clientY;
//     pressed = true;

//     var scene = Halo.Config.scene();
//     if (scene) {
//         scene.onMouseDown(x, y);
//     }
// }

// function onMouseUp(evt) {
//     var x = evt.clientX;
//     var y = document.documentElement.clientHeight - evt.clientY;
//     pressed = false;

//     var scene = Halo.Config.scene();
//     if (scene) {
//         scene.onMouseUp(x, y);
//     }
// }

// function onMouseMove(evt) {
//     var x = evt.clientX;
//     var y = document.documentElement.clientHeight - evt.clientY;

//     var scene = Halo.Config.scene();
//     if (scene) {
//         scene.onMouseMove(x, y);

//         if (pressed) {
//             var dx = evt.movementX / document.documentElement.clientWidth * Halo.Math.TWO_PI;
//             var dy = evt.movementY / document.documentElement.clientHeight * THREE.Math.PI;
    
//             scene.rotation.y += dx;
//         }
//     }
// }

// function onTouchStart(evt) {
//     var touches = [];
//     for (var i = 0; i !== evt.touches.length; ++i) {
//         var x = evt.touches[i].pageX;
//         var y = document.documentElement.clientHeight - evt.touches[i].pageY;
//         touches.push({ x: x, y: y });
//     }

//     var moves = [];
//     for (var i = 0; i !== evt.changedTouches.length; ++i) {
//         var x = evt.changedTouches[i].pageX;
//         var y = document.documentElement.clientHeight - evt.changedTouches[i].pageY;
//         moves.push({ x: x, y: y });
//     }

//     if (touches.length == 1) {
//         pressed = true;
//         start_x = touches[0].x;
//     }
//     delta = 0;

//     var scene = Halo.Config.scene();

//     if (scene) {
//         scene.onTouchStart(moves);
//     }
// }

// function onTouchEnd(evt) {
//     var touches = [];
//     for (var i = 0; i !== evt.touches.length; ++i) {
//         var x = evt.touches[i].pageX;
//         var y = document.documentElement.clientHeight - evt.touches[i].pageY;
//         touches.push({ x: x, y: y });
//     }

//     var moves = [];
//     for (var i = 0; i !== evt.changedTouches.length; ++i) {
//         var x = evt.changedTouches[i].pageX;
//         var y = document.documentElement.clientHeight - evt.changedTouches[i].pageY;
//         moves.push({ x: x, y: y });
//     }

//     if (touches.length == 1) {
//         pressed = false;
//     }

//     var scene = Halo.Config.scene();
//     if (scene) {
//         scene.onTouchEnd(moves);
//     }
// }

// function onTouchMove(evt) {
//     evt.preventDefault();

//     var touches = [];
//     for (var i = 0; i !== evt.touches.length; ++i) {
//         var x = evt.touches[i].pageX;
//         var y = document.documentElement.clientHeight - evt.touches[i].pageY;
//         touches.push({ x: x, y: y });
//     }

//     var moves = [];
//     for (var i = 0; i !== evt.changedTouches.length; ++i) {
//         var x = evt.changedTouches[i].pageX;
//         var y = document.documentElement.clientHeight - evt.changedTouches[i].pageY;
//         moves.push({ x: x, y: y });
//     }

//     var scene = Halo.Config.scene();
//     if (scene) {
//         scene.onTouchMove(moves);

//         if (touches.length == 2) {
//             t1 = touches[0];
//             t2 = touches[1];
//             var dx = t1.x - t2.x;
//             var dy = t1.y - t2.y;
//             var d = Math.sqrt(dx * dx + dy * dy);
//             if (delta > 0) {
//                 scene.position.z += d - delta;
//             }
//             delta = d;
//         }

//         if (pressed && touches.length == 1 && moves.length == 1) {
//             var x = (moves[0].x - start_x) / document.documentElement.clientWidth * Halo.Math.TWO_PI;
//             start_x = moves[0].x;
//             scene.rotation.y += x;
//         }
//     }
// }

function mainloop() {
    var dt = clock.getDelta();

    Halo.Config.update(dt);

    if (controls) {
        controls.update();
    }

    requestAnimationFrame(mainloop);
}

function takephoto(evt) {
    var video = document.getElementById('app_video');
    var photo = document.getElementById('photo');

    var ss = Halo.Config.renderer().getSize();
    var vw = video.videoWidth;
    var vh = video.videoHeight;
    var cw = video.clientWidth;
    var ch = video.clientHeight;

    photo.width = ss.width;
    photo.height = ss.height;

    var x, y;
    if (ss.width / ss.height > vw / vh) {
        x = 0;
        y = (ss.height - ch) * 0.5;
    } else {
        x = (ss.width - cw) * 0.5;
        y = 0;
    }

    var ctxPhoto = photo.getContext('2d');
    ctxPhoto.drawImage(video, x, y, cw, ch);
    photo.style.zIndex = 2;

    var image = document.createElement('img');
    image.style.position = "absolute";
    image.style.top = "0px";
    image.style.left = "0px";
    image.style.width = ss.width + "px";
    image.style.height = ss.height + "px";
    image.style.zIndex = 3;
    document.body.appendChild(image);

    image.onload = function () {
        ctxPhoto.drawImage(image, 0, 0, ss.width, ss.height);
        image.src = photo.toDataURL("image/png");
    }

    Halo.Config.scene().getWidgetRoot().remove(evt);
    Halo.Config.update(0);
    image.src = Halo.Config.renderer().domElement.toDataURL("image/png");
    Halo.Config.scene().getWidgetRoot().add(evt);
}

function play() {
    Halo.Config.play();

    onResizeWindow();

    var snow = Halo.Config.scene().getObjectByName('snow');
    snow.traverse(function(obj){
        obj.frustumCulled = false;
    });
    // snow.frustumCulled = false;

    Halo.Config.camera().position.set(-300, -100, 0);
    // Halo.Config.scene().position.set(0, 0, 0);
    // Halo.Config.scene().rotation.y = Halo.Math.HALF_PI;
    controls = new THREE.DeviceOrientationControls(Halo.Config.camera());

    var angle = -Halo.Math.HALF_PI;
    if (getMobileOperatingSystem() === "Android") {
        angle -= Halo.Math.HALF_PI;
    }
    controls.updateAlphaOffsetAngle(angle);

    // var uiPhoto = Halo.Config.createWidget('photo');
    // Halo.Config.scene().getWidgetRoot().add(uiPhoto);

    Signals.takephoto.add(takephoto);
}

function init() {
    var progressbar = document.createElement('b');
    document.body.appendChild(progressbar);
    progressbar.zIndex = 10;

    function updateProgress(progress) {
        progressbar.innerHTML = "正在加载 " + Math.floor(progress) + "%";
        progressbar.style.left = (document.documentElement.clientWidth - progressbar.clientWidth) * 0.5 + "px";
        progressbar.style.top = (document.documentElement.clientHeight - progressbar.clientHeight) * 0.5 + "px";
    }

    updateProgress(0);

    Halo.init('webspring', 'webar/xinian/', null, (status) => {
        if (status === 0) {
            window.addEventListener('resize', onResizeWindow, false);
            // document.addEventListener('mousedown', onMouseDown, false);
            // document.addEventListener('mouseup', onMouseUp, false);
            // document.addEventListener('mousemove', onMouseMove, false);
            // document.addEventListener('touchstart', onTouchStart, false);
            // document.addEventListener('touchend', onTouchEnd, false);
            // document.addEventListener('touchmove', onTouchMove, false);

            Halo.Config.start(document.body);

            Halo.ResourceManager.loadList([{ path: 'scn', name: Halo.Config.get().entry_scene }], function (res, status) {
                if (status !== 0) {
                    updateProgress(status*100/22);
                    return;
                }
                document.body.removeChild(progressbar);
                play();
                
                // var video = document.getElementById('app_video');
                // video.addEventListener("canplay", function () { video.play(); })

                // navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { exact: "environment" } } }).then(
                //     (stream) => {
                //         video.srcObject = stream;
                //         play();
                //     }
                // ).catch((err) => {
                //     console.log(err);

                //     navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "user" } }).then(
                //         (stream) => {
                //             video.srcObject = stream;
                //             play();
                //         }
                //     ).catch((err) => {
                //         console.log(err);
                //     });
                // });

                mainloop();
            });
        }
    });
}

document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        init();
    }
}