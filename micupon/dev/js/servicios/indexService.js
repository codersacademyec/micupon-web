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
    };

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

    function saveItem(code){

        Stamplay.Object("cupones_usuarios").save({usuario:'57feba3ca3b12b294d4891c0',codigo:code})
        .then(function(res) {
           addAlert();
        }, function(err) {
            // TODO MOSTRAR ERROR
        })       
    }


}