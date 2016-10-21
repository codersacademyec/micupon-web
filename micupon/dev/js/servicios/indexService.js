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
                for (var i = res.data.length - 1; i >= 0; i--) {
                    if(user){
                        Stamplay.Object("cupones_usuarios").get({usuario:user._id,codigo:res.data[i].codigo})
                        .then(function(res) {
                            if(res){
                                res.data[i].disable = true;
                            }else{
                                res.data[i].disable = false;
                            }
                        }, function(err) {
                            // TODO MOSTRAR ERROR
                        })
                    } else{
                        res.data[i].disable = false;
                    }             
                }                
            }
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
        .then(function(response) {
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