angular.module('micupon').factory('globalService', ['$http','$rootScope',globalService]);

function globalService($http,$rootScope) {
    var successMessage = '';
    var loadText = '';
    var blockActions = false;
    var waiting = false;
    var service = {
        get: doGet,
        post: doPost,
        wait: isWaiting,
        loadingText: loadingText,
        blockActions: isBlocked,
        logout: logout,
        sendPush: sendPush       
    };

    function sendPush(token,mensaje){
        $http.post('https://micupon.stamplayapp.com/api/codeblock/v1/run/pushcercanos',{
                    "token" : token,
                    "mensaje" : mensaje
                });
    }

    function logout() {
        var jwt = window.location.origin + "-jwt";
        window.localStorage.removeItem(jwt);
        $rootScope.user = false;
    }

    function manageSuccess(response){
        dismissWait();
        if(successMessage != ""){showNot(successMessage,'success');}
        return response.data;
    }

    function manageError(response,a,b){
        dismissWait();
        if(response.status != 200){
            if(response.status == 999){
                location.href = '/login';
                dismissWait();
                return;
            }
            var msg;
            if(response.status == 406){
                msg = response.data;
            }else{
                msg = "Ocurrio un error inesperado.";
            }
            showNot(msg,'danger');
        }
    }

    function doGet(url,msg,successMessage){
        showWait(!msg ? 'Procesando...':msg);
        successMessage = "";
        if(successMessage){successMessage = successMessage;}
        return $http.get(url).then(manageSuccess,manageError);
    }

    function doPost(url,data,msg,successMessage){
        showWait(!msg ? 'Procesando...':msg);
        successMessage = "";
        if(successMessage){successMessage = successMessage;}
        return $http.post(url,data).then(manageSuccess,manageError);
    }

    function showWait(text){
        blockActions = true;
        waiting = true;
        loadText = text;
    }

    function dismissWait(){
        waiting = false;
        blockActions = false;
    }

    function isWaiting(){
        return waiting;
    }

    function loadingText(){
        return loadText;
    }

    function isBlocked(){
        return blockActions;
    }

    return service;
}