angular.module('micupon').factory('indexService', ['globalService',indexService]);

function indexService(globalService) {
    var service = {
        busqueda: getItems,
        modificar: updateItem,
        eliminar: deleteItem,
        nuevo: saveItem
    };

    return service;

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