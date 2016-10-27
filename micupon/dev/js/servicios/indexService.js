angular.module('micupon').factory('indexService', ['globalService','socialProvider',indexService]);

function indexService(globalService,socialProvider) {
    var service = {
        busqueda: getItems,
        modificar: updateItem,
        eliminar: deleteItem,
        nuevo: saveItem,
        login: login
    };

    return service;
    function login(i){
        Stamplay.User.socialLogin(socialProvider[i]);    
    }
    
    function getItems(filter, user) {  //TODO VER PORQUE CONSULTA PRIMERO Y LUEGO VERIFICA SI EL USER ESTÁ LOGUEADO - HACE QUE NUNCA LLEGUE EL USER Y SE PUEDAN DESHABILITAR LOS CUPONES ENVIADOS
        
        /*var codeblock = new Stamplay.Codeblock("cuponespersonas");
        var data = {user : user, filtro: filter};

        codeblock.run(data, {}, function (err, response) {
            if(response.length > 0){
                console.log(response);
                return response;
            }else if (err != null) {                        
                console.log(err);
                return null;
            }
        });*/

        return Stamplay.Object("cupones").get(filter)
        .then(function(res) {
                if(res.data){
                    cupones = [];
                    //if(user){ // si hay usuario logueado
                        Stamplay.Object("cupones_usuarios").get({usuario:'580a08882be61c073254b8d6'}) // buscamos los codigos que tiene enviados el usuario
                        .then(function(response) {
                            if(response.data.length > 0){
                                var cuponesEnviados = response.data;
                                for (var i = res.data.length - 1; i >= 0; i--) {
                                    var cupon = res.data[i]; // tomamos el cupon
                                    cupon.flag = false; // seteamos que sea editable

                                    for (var j = cuponesEnviados.length - 1; j >= 0; j--) {
                                       for (var k = cuponesEnviados[j].codigos.length - 1; k >= 0; k--) {
                                            console.log(cupon._id);
                                            console.log(cuponesEnviados[j].codigos[k]);
                                            console.log(cupon._id == cuponesEnviados[j].codigos[k]);
                                           if(cupon._id == cuponesEnviados[j].codigos[k]){ // si alguno de los codigos que vienen ya fue enviado para el usuario, lo deshabilitamos
                                            cupon.flag = true; // seteamos que no sea editable porque ya se envió este cupon
                                        }
                                       }                                       
                                    }
                                    cupones.push(cupon); // agregamos el cupon modificado
                                }
                                return cupones;
                            }                  
                        }, function(err) {
                            console.log(err);
                        })
                    //}                    
                }
                return res.data;

            }, function(err) {
              console.log(err);
        });
    }

    function updateItem(item){
       Stamplay.Object("cupones").patch("codigo",item)
        .then(function(res) {
          // success
        }, function(err) {
            console.log(err);
        }) 
    }

    function deleteItem(item){
       Stamplay.Object("cupones").remove("codigo")
        .then(function(response) {
            // success
        }, function(err) {
           console.log(err);
        }) 
    }

    function saveItem(codeId, user){
        Stamplay.Object("cupones_usuarios").get({usuario:'580a08882be61c073254b8d6'}) // buscamos codigos enviados del usuario
        .then(function(response) {
            if(response.data && response.data.length > 0){ // si hay registro para el usuario
                response.data[0].codigos.push(codeId); // agregamos uno más a la lista de codigos
                console.log(response.data[0].codigos);
                Stamplay.Object("cupones_usuarios").patch('580a08882be61c073254b8d6',{codigos:response.data[0].codigos}) // actualizamos los codigos enviados del usuario
                .then(function(res) {
                    notificaciones(user);
                }, function(err) {
                   console.log(err);
                }) 
            }else{
                var data = {usuario:['580a08882be61c073254b8d6'], codigos:[codeId]};
                Stamplay.Object("cupones_usuarios").save(data) // creamos un registro para el usuario en cupones_usuario
                .then(function(res) {
                    notificaciones(user);
                }, function(err) {
                    console.log(err);
                }) 
            }
        }, function(err) {
            console.log(err);
        })      
    }

    function notificaciones(user){
        globalService.sendPush(user.perfil.push_token,'El cupón ha sido enviado a su movil.'); // enviamos la notificación push
        addAlert(); // mostramos mensaje en pantalla
    }
    
}