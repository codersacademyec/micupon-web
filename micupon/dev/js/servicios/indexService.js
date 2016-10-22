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
    
    function getItems(filtro, user) {
        return Stamplay.Object("cupones").get(filtro)
        .then(function(res) {
                if(res.data){
                    cupones = [];                    
                    for (var i = res.data.length - 1; i >= 0; i--) {
                        cupon = res.data[i];
                        cupon.flag = "0";
                        if(user){ // si hay usuario logueado
                            Stamplay.Object("cupones_usuarios").get({usuario:user._id}) // traemos los codigos que tiene enviados el usuario
                            .then(function(response) {
                                if(response){
                                    for (var j = res.codigos.length - 1; j >= 0; j--) {
                                       if(cupon.codigo == response.data[j].codigo){ // si alguno de los codigos que vienen ya fue enviado para el usuario, lo deshabilitamos
                                            cupon.flag = "1";
                                        }
                                    } 
                                }                          
                            }, function(err) {
                                // TODO MOSTRAR ERROR
                            })
                        } 
                        cupones.push(cupon);
                    }
                }
                res.data = cupones;
                return res.data;    
            }, function(err) {
                // TODO MOSTRAR ERROR
            });
    }

    function updateItem(item){
       Stamplay.Object("cupones").patch("codigo",item)
        .then(function(res) {
          // success
        }, function(err) {
          // error
        }) 
    }

    function deleteItem(item){
       Stamplay.Object("cupones").remove("codigo")
        .then(function(response) {
            // success
        }, function(err) {
          // error
        }) 
    }

    function saveItem(code, user){
        Stamplay.Object("cupones_usuarios").get({usuario:user._id}) // buscamos codigos enviados del usuario
        .then(function(response) {
            if(response){ // si hay registro para el usuario
                response.codigos.push(code); // agregamos uno más a la lista de codigos
                Stamplay.Object("cupones_usuarios").patch({usuario:user._id,codigos:response.codigos}) // actualizamos los codigos enviados del usuario
                .then(function(res) {
                    globalService.sendPush(user.perfil.push_token,'El cupón ha sido enviado a su movil.'); // enviamos la notificación push
                    addAlert(); // mostramos mensaje en pantalla
                }, function(err) {
                    // TODO MOSTRAR ERROR
                }) 
            }else{
                Stamplay.Object("cupones_usuarios").save({usuario:user._id, codigos:code}) // creamos un registro para el usuario en cupones_usuario
                .then(function(res) {
                    globalService.sendPush(user.perfil.push_token,'El cupón ha sido enviado a su movil.'); // enviamos la notificación push
                    addAlert(); // mostramos mensaje en pantalla
                }, function(err) {
                    // TODO MOSTRAR ERROR
                }) 
            }
        }, function(err) {
            // TODO MOSTRAR ERROR
        })      
    }

    
}