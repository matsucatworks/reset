/*globals THREE */
(() => {
    var dom = document.querySelector('canvas'),
    width = window.innerWidth,
    height = window.innerHeight,
    mp = Math.PI,
    y = 1,
    z = 10,
    reqRet,
    rad = function(r){return r * (Math.PI / 180);};



    (function(w,r){
        w['r'+r] = w['r'+r] ||
        w['webkitR'+r] ||
        w['mozR'+r] ||
        w['oR'+r] ||
        w['msR'+r] ||
        function(callback){w.setTimeout(callback,1000/60);};
    })(window,'equestAnimationFrame');

    (function(w,c){
        w['c'+c] = w['c'+c] ||
        w['webkitC'+c] ||
        w['mozC'+c] ||
        w['oC'+c] ||
        w['msC'+c] ||
        function(callback){w.clearTimeout(callback);};
    })(window,'ancelAnimationFrame');

    var renderer = new THREE.WebGLRenderer({
        canvas:dom
    });
    renderer.setSize(width,height);
    renderer.setPixelRatio(window.devicePixelRatio);

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(60,width / height,1,10000);
    camera.position.set(0, y, z);

    var draw_meta = [],
        pos = [];
        pos[0] = [7,0,-15];
        pos[1] = [3,3,-8];
        pos[2] = [3,-4,-12];
        pos[3] = [-4,0,-10];
        pos[4] = [-4,-6,-2];
        pos[5] = [-7,5,-15];
        pos[6] = [-14,5,-10];
        pos[7] = [-12,0,-15];
        pos[8] = [-9,-4,-1];
        pos[9] = [-5,5,-1];

        pos[10] = [14,5,-10];
        pos[11] = [12,0,-15];
        pos[12] = [9,-4,-1];
        pos[13] = [5,5,-1];
    var draw = function(n){
        var name = '_'+n,
            rotation = (Math.random() * (50 - 1) + 1 | 0) / 10000,
            rot_x = (Math.random() * 12 | 0) / 10,
            rot_y = (Math.random() * 12 | 0) / 10,
            rot_z = (Math.random() * 12 | 0) / 10,
            x = (Math.random() * 10 | 0) - 5,
            y = (Math.random() * 10 | 0) - 5,
            z = (Math.random() * 10 | 0) - 5,
            size = Math.random() * (4 - 1) + 1 | 0;

        var mesh = new THREE.Mesh(
            new THREE.BoxGeometry(size,size,size,8,8),
            new THREE.MeshPhongMaterial({color:0xf8b500,shininess:2})
        );
        draw_meta[name] = {};
        draw_meta[name].rotation = rotation;
        draw_meta[name].move = rotation * 10;
        mesh.rotation.x += rot_x;
        mesh.rotation.y += rot_y;
        mesh.rotation.z += rot_z;
        mesh.name = name;
        // mesh.position.set(x,y,z);
        mesh.position.set(pos[n - 1][0],pos[n - 1][1],pos[n - 1][2]);
        scene.add(mesh);
    };

    var i = 0,
        draw_cnt = 14;
    while(i < draw_cnt){
        draw(i + 1);
        i = (i + 1)|0;
    }


    //ライト
    var light_1 = new THREE.DirectionalLight(0xffffff,0.1);
    var light_2 = new THREE.AmbientLight(0xffffff,0.9);
    light_1.position.set(0,100,100);
    scene.add(light_1);
    scene.add(light_2);

    //OrbitControls
    var ctrl = new THREE.OrbitControls(camera,dom);
    ctrl.enableZoom = false;
    ctrl.enablePan = false;
    ctrl.autoRotate = true;

    //背景色
    renderer.setClearColor(0xffffff, 1.0);

    //毎秒描画
    var load = function(){
        scene.traverse(function(obj){
            if(obj instanceof THREE.Mesh === true){
                obj.rotation.x += draw_meta[obj.name].rotation;
                obj.rotation.y += draw_meta[obj.name].rotation;
                obj.rotation.z += draw_meta[obj.name].rotation;
                // obj.position.x += draw_meta[obj.name].move;
                // if(obj.position.x > 20){
                //     obj.position.x = -20;
                // }
            }
        });

        ctrl.update();
        renderer.render(scene,camera);
        requestAnimationFrame(load);
    };
    load();

    //カメラリセット
    var reset_obj ={};
    var cam = {};
    var reset = function(){
        var move_num = 8;
        reset_obj.id = requestAnimationFrame(reset);
        reset_obj.num_x = reset_obj.x_dir?(camera.position.x - cam.x) / move_num:(cam.x - camera.position.x) / move_num;
        reset_obj.num_y = reset_obj.y_dir?(camera.position.y - cam.y) / move_num:(cam.y - camera.position.y) / move_num;
        reset_obj.num_z = reset_obj.z_dir?(camera.position.z - cam.z) / move_num:(cam.z - camera.position.z) / move_num;


        if(reset_obj.x_dir){
            if(camera.position.x > cam.x){
                camera.position.x = camera.position.x - reset_obj.num_x;
            }
            camera.position.x = Math.floor(camera.position.x * 100) / 100;

            reset_obj.x_flg = (cam.x | 0) >= camera.position.x;
        }else {
            if(cam.x > camera.position.x){
                camera.position.x = camera.position.x + reset_obj.num_x;
            }
            camera.position.x = Math.ceil(camera.position.x * 100) / 100;

            reset_obj.x_flg = camera.position.x >= (cam.x | 0);
        }

        if(reset_obj.y_dir){
            if(camera.position.y > cam.y){
                camera.position.y = camera.position.y - reset_obj.num_y;
            }
            camera.position.y = Math.floor(camera.position.y * 100) / 100;

            reset_obj.y_flg = (cam.y | 0) >= camera.position.y;
        }else {
            if(cam.y > camera.position.y){
                camera.position.y = camera.position.y + reset_obj.num_y;
            }
            camera.position.y = Math.ceil(camera.position.y * 100) / 100;

            reset_obj.y_flg = camera.position.y >= (cam.y | 0);
        }

        if(reset_obj.z_dir){
            if(camera.position.z > cam.z){
                camera.position.z = camera.position.z - reset_obj.num_z;
            }
            camera.position.z = Math.floor(camera.position.z * 100) / 100;

            reset_obj.z_flg = (cam.z | 0) >= camera.position.z;
        }else {
            if(cam.z > camera.position.z){
                camera.position.z = camera.position.z + reset_obj.num_z;
            }
            camera.position.z = Math.ceil(camera.position.z * 100) / 100;

            reset_obj.z_flg = camera.position.z >= (cam.z | 0);
        }

        if(reset_obj.x_flg && reset_obj.y_flg && reset_obj.z_flg){
            camera.position.x = cam.x;
            camera.position.y = cam.y;
            camera.position.z = cam.z;
            cancelAnimationFrame(reset_obj.id);
            ctrl.autoRotate = true;
        }
    };

    $(window).on('resize',function(){
        var w = window.innerWidth,
        h = window.innerHeight;
        renderer.setSize(w,h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    })
    .on('mousedown',function(){
        cancelAnimationFrame(reset_obj.id);

        cam.x = camera.position.x | 0;
        cam.y = camera.position.y | 0;
        cam.z = camera.position.z | 0;
    })
    .on('mouseup',function(){
        if((camera.position.x | 0) !== cam.x || (camera.position.y | 0) !== cam.y || (camera.position.z | 0) !== cam.z){
            reset_obj.x_dir = camera.position.x > cam.x;
            reset_obj.y_dir = camera.position.y > cam.y;
            reset_obj.z_dir = camera.position.z > cam.z;
            cancelAnimationFrame(reset_obj.id);
            ctrl.autoRotate = false;
            reset();
        }
    });
})();
