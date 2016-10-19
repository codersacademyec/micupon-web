angular.module('micupon').controller('indexCtrl',['$scope','globalService','bandasService','$modal',indexCtrl]);

function indexCtrl($scope,globalService,indexService,$modal) {
	var vm = this;
	vm.bandas = [];
	vm.globalService = globalService;
	vm.showFiltros = false;
	vm.showNuevo = false;
	vm.filtros = {};
	vm.nuevo = {};
	vm.bandaSeleccionada = {};
	vm.modalEliminar = $modal({scope:$scope, template: '<div class="modal"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">Eliminar la banda horaria con id {{ctrl.bandaSeleccionada.id}}?</h4></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="$hide()">Cancelar</button><button type="button" class="btn btn-danger" ng-click="ctrl.confirmarElim()">Eliminar</button></div></div></div></div>', html:true, show: false,animation:'am-slide-top'});
	vm.tableConfig = {
	    itemsPerPage: 5,
	    fillLastPage: true
	  };

	vm.ingresar = function(i){
		indexService.login(i);
	};
	vm.ocultarSide = function(){
		vm.showFiltros = false;
		vm.showNuevo = false;
	};

	vm.buscar = function(){
		bandasService.busqueda(vm.filtros).then(function(data){
			vm.bandas = data;
			vm.showFiltros = false;
		});	
	};

	vm.eliminar = function(item){
		vm.bandaSeleccionada = item;
		vm.modalEliminar.$promise.then(vm.modalEliminar.show);
	};

	vm.confirmarElim = function(){
		bandasService.eliminar(vm.bandaSeleccionada).then(function(data){
			vm.modalEliminar.$promise.then(vm.modalEliminar.hide);
		});
	};

	vm.guardar = function(){
		bandasService.nuevo(vm.nuevo).then(function(data){
			vm.ocultarSide();
		});
	};
	
	vm.limpiarFiltros = function(){
		vm.filtros = {};
	};

	vm.buscar();

}