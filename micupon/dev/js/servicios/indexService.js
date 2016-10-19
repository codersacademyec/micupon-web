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
        return globalService.post('mocks/bandas.json', {
            filtro: filtro
        }).then(function(resp) {
            return resp;
        });
    }

    function updateItem(item){
        return globalService.post('backend', {
            item: item
        }).then(function(resp) {
            return resp;
        });
    }

    function deleteItem(item){
        return globalService.post('backend', {
            item: item
        }).then(function(resp) {
            return resp;
        });
    }

    function saveItem(item){
        return globalService.post('backend', {
            item: item
        }).then(function(resp) {
            return resp;
        });        
    }
}