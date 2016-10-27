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
                    for (var i = res.data.length - 1; i >= 0; i--) {
                        cupon = res.data[i]; // tomamos el cupon
                        cupon.flag = false; // seteamos que sea editable
                        if(user){ // si hay usuario logueado
                            Stamplay.Object("cupones_usuarios").get({usuario:user._id}) // buscamos los codigos que tiene enviados el usuario
                            .then(function(response) {
                                if(response){
                                    for (var j = response.data.length - 1; j >= 0; j--) {
                                       for (var k = response.data[j].codigos.length - 1; k >= 0; k--) {
                                           if(cupon._id == response.data[j].codigos[k]){ // si alguno de los codigos que vienen ya fue enviado para el usuario, lo deshabilitamos
                                            cupon.flag = true; // seteamos que no sea editable porque ya se envió este cupon
                                        }
                                       }                                       
                                    } 
                                }                          
                            }, function(err) {
                                // TODO MOSTRAR ERROR
                            })
                        } 
                        cupones.push(cupon); // agregamos el cupon modificado
                    }
                }
                res.data = cupones; // pisamos los cupones
                return res.data;

            }, function(err) {
                // TODO MOSTRAR ERROR
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
        Stamplay.Object("cupones_usuarios").get({usuario:user._id}) // buscamos codigos enviados del usuario
        .then(function(response) {
            if(response && response.length > 0){ // si hay registro para el usuario
                response.codigos.push(codeId); // agregamos uno más a la lista de codigos
                Stamplay.Object("cupones_usuarios").patch(response._id,{codigos:response.codigos}) // actualizamos los codigos enviados del usuario
                .then(function(res) {
                    notificaciones(user);
                }, function(err) {
                   console.log(err);
                }) 
            }else{
                var data = {usuario:[user._id], codigos:[codeId]};
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