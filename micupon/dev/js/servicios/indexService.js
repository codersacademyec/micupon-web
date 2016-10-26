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
    
    function getItems(filtro, user) {  //TODO VER PORQUE CONSULTA PRIMERO Y LUEGO VERIFICA SI EL USER ESTÁ LOGUEADO - HACE QUE NUNCA LLEGUE EL USER Y SE PUEDAN DESHABILITAR LOS CUPONES ENVIADOS
        return Stamplay.Object("cupones").get(filtro)      
            .then(function(res) {
                
                Stamplay.Codeblock("cuponespersonas").get({result: res, user : user}, function(err, resCB) {
                    if(resCB){
                        return resCB;
                    }
                    if(err){
                        //Console.log(err);
                    }
                });

            }, function(err) {
              //Console.log(err);
            })
    }

    function updateItem(item){
       Stamplay.Object("cupones").patch("codigo",item)
        .then(function(res) {
          // success
        }, function(err) {
            //Console.log(err);
        }) 
    }

    function deleteItem(item){
       Stamplay.Object("cupones").remove("codigo")
        .then(function(response) {
            // success
        }, function(err) {
          //Console.log(err);
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
                   //Console.log(err);
                }) 
            }else{
                var data = {usuario:user._id, codigos:[codeId]};
                Stamplay.Object("cupones_usuarios").save(data) // creamos un registro para el usuario en cupones_usuario
                .then(function(res) {
                    notificaciones(user);
                }, function(err) {
                    //Console.log(err);
                }) 
            }
        }, function(err) {
            //Console.log(err);
        })      
    }

    function notificaciones(user){
        globalService.sendPush(user.perfil.push_token,'El cupón ha sido enviado a su movil.'); // enviamos la notificación push
        addAlert(); // mostramos mensaje en pantalla
    }
    
}