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
    
    function getItems(filter, user) {
        var data = {filtro: filter};
        if(user){
            data = {user : { _id: user._id, perfil: user.perfil }, filtro: filter};
        }
        var codeblock = new Stamplay.Codeblock("cuponespersonas");
        return codeblock.run(data).then(function (response) {
          return response;
        }, function( err ){
          console.error(err);
          return null;
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
        Stamplay.Object("cupones_usuarios").get({usuario:user.perfil.id}) // buscamos codigos enviados del usuario
        .then(function(response) {
            if(response.data && response.data.length > 0){ // si hay registro para el usuario
                response.data[0].codigos.push(codeId); // agregamos uno más a la lista de codigos
                console.log(response.data[0].codigos);
                Stamplay.Object("cupones_usuarios").update(response.data[0].id,response.data[0]) // actualizamos los codigos enviados del usuario
                .then(function(res) {
                    notificaciones(user);
                }, function(err) {
                   console.log(err);
                }) 
            }else{
                var data = {usuario:[user.perfil.id], codigos:[codeId]};
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