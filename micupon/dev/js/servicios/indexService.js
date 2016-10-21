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
    
    function getItems(filtro) {
        return Stamplay.Object("cupones").get(filtro)
        .then(function(res) {
          return res.data;
        }); 
    }

    function updateItem(item){
       Stamplay.Object("cupones").update("codigo",item)
        .then(function(res) {
          // success
        }, function(err) {
          // error
        }) 
    }

    function deleteItem(item){
       Stamplay.Object("cupones").remove("codigo")
        .then(function(res) {
          // success
        }, function(err) {
          // error
        }) 
    }

    function saveItem(code, user){
        Stamplay.Object("cupones_usuarios").save({usuario:user._id,codigo:code})
        .then(function(res) {
            globalService.sendPush(user.perfil.push_token,'El cupón ha sido enviado a su movil.');
            addAlert();
        }, function(err) {
            // TODO MOSTRAR ERROR
        })       
    }


}