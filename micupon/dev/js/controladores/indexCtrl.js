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
 

    AccountService.currentUser()
        .then(function(user) {
            if (user || $rootScope.user) {
                $rootScope.user = user ? user : $rootScope.user;
                Stamplay.Object("usuarios").get({owner: $rootScope.user._id})
                    .then(function(res) {
                        $rootScope.user.perfil = res.data[0];
                    }, function(err) {
                        console.log(err);
                    })
            }
			vm.buscar();       
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
            $scope.$apply();
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
        }
    };

    vm.limpiarFiltros = function() {
        vm.filtros = {};
    };
    
}