angular.module('micupon').controller('indexCtrl', ['$scope', '$rootScope', 'globalService', 'indexService', 'AccountService', '$modal', indexCtrl]);

function indexCtrl($scope, $rootScope, globalService, indexService, AccountService, $modal) {
    var vm = this;
    vm.globalService = globalService;
    vm.cupones = [];
    vm.showFiltros = false;
    vm.showNuevo = false;
    vm.filtros = {};
    vm.nuevo = {};
    vm.itemSeleccionado = {};
 
    //$rootScope.user = {"_id":"57feba3ca3b12b294d4891c0","appId":"micupon","displayName":"Gonzalo Aller","name":{"familyName":"Aller","givenName":"Gonzalo"},"pictures":{"google":"https://lh5.googleusercontent.com/-5HPa6h3FB88/AAAAAAAAAAI/AAAAAAAAB_4/i0qyKV7fxjg/photo.jpg"},"givenRole":"57eff5d03054317a6c37998b","email":"gonzaller@gmail.com","identities":{"google":{"googleUid":"108349644188900323702","refreshToken":"1/LVl2DtrAwk_WpPTLe2m-gHY7Zz05Bqou9_shgoaBZwksHjrrZIvuhpe-_ZOYsf0j","_json":{"locale":"es-419","gender":"male","picture":"https://lh5.googleusercontent.com/-5HPa6h3FB88/AAAAAAAAAAI/AAAAAAAAB_4/i0qyKV7fxjg/photo.jpg","link":"https://plus.google.com/108349644188900323702","family_name":"Aller","given_name":"Gonzalo","name":"Gonzalo Aller","verified_email":true,"email":"gonzaller@gmail.com","id":"108349644188900323702"},"emails":[{"value":"gonzaller@gmail.com"}],"accessToken":"ya29.Ci-JA59y1vCARcb5SrKPJsDEx94EHBgxNleqmSBX100uILEO0RGB_RP8LJ18CyxWKA"}},"__v":0,"dt_update":"2016-10-27T23:18:31.741Z","dt_create":"2016-10-12T22:33:32.096Z","emailVerified":true,"verificationCode":"f5f70b492d430bfc262f","profileImg":"https://lh5.googleusercontent.com/-5HPa6h3FB88/AAAAAAAAAAI/AAAAAAAAB_4/i0qyKV7fxjg/photo.jpg","id":"57feba3ca3b12b294d4891c0","perfil":{"_id":"57fec0700d63f676601f24ac","sexo":"male","nombre":"Gonzalo","email":"gonzaller@gmail.com","apellido":"Aller","owner":"57feba3ca3b12b294d4891c0","appId":"micupon","cobjectId":"usuarios","actions":{"comments":[],"ratings":{"users":[],"avg":0,"total":0},"votes":{"users_downvote":[],"users_upvote":[],"users":[],"total":0}},"dt_update":"2016-10-18T00:44:53.929Z","dt_create":"2016-10-12T23:00:00.844Z","__v":0,"push_token":"62fd3d375167014fbc29a812704fb29a5bd6c0a4d791436dd56a5c7d209e4532","id":"57fec0700d63f676601f24ac"}};
    AccountService.currentUser()
        .then(function(user) {
            if (user || $rootScope.user) {
                $rootScope.user = user ? user : $rootScope.user;
                Stamplay.Object("usuarios").get({owner: $rootScope.user._id})
                    .then(function(res) {
                        $rootScope.user.perfil = res.data[0];
                        vm.buscar();
                    }, function(err) {
                        console.log(err);
                    });
            }
        });

    vm.modalEliminar = $modal({
        scope: $scope,
        template: '<div class="modal"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">Eliminar la banda horaria con id {{ctrl.bandaSeleccionada.id}}?</h4></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="$hide()">Cancelar</button><button type="button" class="btn btn-danger" ng-click="ctrl.confirmarElim()">Eliminar</button></div></div></div></div>',
        html: true,
        show: false,
        animation: 'am-slide-top'
    });

    vm.tableConfig = {
        itemsPerPage: 5,
        fillLastPage: true
    };

    vm.ingresar = function(i) {
        indexService.login(i);
    };

    vm.ocultarSide = function() {
        vm.showFiltros = false;
        vm.showNuevo = false;
    };

    vm.buscar = function() {
        indexService.busqueda(vm.filtros, $rootScope.user).then(function(data) {
            vm.cupones = data;
            vm.showFiltros = false;
            $scope.$digest();
            console.log(data);
        });
    };

    vm.eliminar = function(item) {
        vm.itemSeleccionado = item;
        vm.modalEliminar.$promise.then(vm.modalEliminar.show);
    };

    vm.confirmarElim = function() {
        indexService.eliminar(vm.itemSeleccionado).then(function(data) {
            vm.modalEliminar.$promise.then(vm.modalEliminar.hide);
        });
    };

    vm.guardar = function(item) {
        if(!$rootScope.user){
            $('#login-dialog').modal();
        }
        else{
            indexService.nuevo(item,$rootScope.user);
            vm.buscar();
        }
    };

    vm.limpiarFiltros = function() {
        vm.filtros = {};
    };
    //vm.buscar();
}