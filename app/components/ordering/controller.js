(function () {
    'use strict';

    angular.module('centoku').controller('ordering', Controller);

    function Controller($scope, $timeout, $interval, $q, UserService, uiGridConstants, OrderService, FlashService ) {
        var vm = this;

        vm.user = null;
        
        $scope.addinventorytab = true;
        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                console.log(vm.user.username);
                getOrder(vm.user.username);
            });

        };
        
        $scope.submitOrder = function() {
            var inventoryVal = {
                "username": vm.user.username,
                "order_id": $scope.order_id,
                "order_name": $scope.order_name,
                "vendor_id": $scope.vendor_id,
                "order_date": $scope.order_date,
                "delivery_date": $scope.delivery_date
            };
            
            OrderService.CreateOrder(inventoryVal).then(function (data) {
               console.log('updated successfully');
                $scope.order_id = '';
                $scope.order_name = '';
                $scope.vendor_id = '';
                $scope.order_date = '';
                $scope.delivery_date = '';

                FlashService.Success('User updated');
                getOrder(vm.user.username);
            }).catch(function (error) {
                    FlashService.Error(error);
                });
        };
        
        var start = new Date();
          var sec = $interval(function () {
            var wait = parseInt(((new Date()) - start) / 1000, 10);
            $scope.wait = wait + 's';
          }, 1000);

        function rowTemplate() {
            return $timeout(function() {
              $scope.waiting = 'Done!';
              $interval.cancel(sec);
              $scope.wait = '';
              return '<div ng-class="{ \'my-css-class\': grid.appScope.rowFormatter( row ) }">' +
                         '  <div ng-if="row.entity.merge">{{row.entity.title}}</div>' +
                         '  <div ng-if="!row.entity.merge" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                         '</div>';
            }, 6000);
          }
        
        function getOrder(username) {
              OrderService.GetOrder(username).then(function (data) {
               $scope.orderData.data = data.reverse();
               console.log('the data is ', $scope.gridApi);
               $interval( function() {$scope.gridApi.selection.selectRow($scope.orderData.data[0]);}, 0, 1);
               FlashService.Success('User updated');

            }).catch(function (error) {
                    FlashService.Error(error);
                });  
        };


        $scope.orderData = {
        			enableRowSelection: true,
        			enableRowHeaderSelection: false,
        			enableSorting: true,
                    enableFiltering: true,
                    enableGridMenu: true,
                    enablePaginationControls: true,
                    paginationPageSize: 10,
                    exporterCsvFilename: 'order.csv',
                    exporterPdfDefaultStyle: {fontSize: 12},
                    exporterPdfTableStyle: {margin: [0, 30, 0, 0]},
                    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
                    exporterPdfHeader: { text: "Order Report", style: 'headerStyle' },
                    exporterPdfFooter: function ( currentPage, pageCount ) {
                      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                    },
                    exporterPdfCustomFormatter: function ( docDefinition ) {
                      docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                      return docDefinition;
                    },
                    exporterPdfOrientation: 'landscape',
                    exporterPdfPageSize: 'letter',
                    exporterPdfMaxGridWidth: 1000,
                    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                    importerDataAddCallback: function ( grid, newObjects ) {
                      $scope.data = $scope.data.concat( newObjects );
                    },
                    onRegisterApi: function(gridApi){
                      $scope.gridApi = gridApi;
                    },
                    columnDefs: [
                      { name: 'order_id',
                      	desplayName: 'Order ID',
                      	width: '150',
                      	visible: true,
                      	enableCellEdit: false },
                      { name: 'order_name',
                      	desplayName: 'Order Name',
                      	width: '150',
                      	enableCellEdit: false,
                      	enableSorting: false  },
                      { name: 'vendor_id',
                      	desplayName: 'Vendor ID',
                      	width: '150'},
                      { name: 'order_date',
                      	desplayName: 'Order Date',
                      	width: '150' },
                      { name: 'delivery_date',
                      	desplayName: 'Delivery Date',
                      	width: '150',
                      	type: 'boolean' }
                    ]
               };

               $scope.orderData.multiSelect = false;
			   $scope.orderData.modifierKeysToMultiSelect = false;
			   $scope.orderData.noUnselect = true;


			  $scope.toggleRowSelection = function() {
			    $scope.gridApi.selection.clearSelectedRows();
			    $scope.gridOptions.enableRowSelection = !$scope.gridOptions.enableRowSelection;
			    $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.OPTIONS);
			  };
    
    };       

})();