(function () {
    'use strict';

    angular.module('centoku').controller('inventory', Controller);

    function Controller($scope, $timeout, $interval, UserService, InventoryService, FlashService ) {
        var vm = this;

        vm.user = null;
        
        $scope.addinventorytab = true;
        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                console.log(vm.user.username);
                getInventory(vm.user.username);
            });

        };
        
        $scope.submitInventory = function() {
            var inventoryVal = {
                "username": vm.user.username,
                "item_id": $scope.item_id,
                "order_id": $scope.order_id,
                "group_id": $scope.group_id,
                "time_stamp": $scope.time_stamp,
                "privilege": $scope.privilege,
                "current_quantity": $scope.current_quantity,
                "description" : $scope.description,
                "last_update" : $scope.last_update,
                "vendor_id" : $scope.vendor_id
            };
            
            InventoryService.CreateInventory(inventoryVal).then(function (data) {
               console.log('updated successfully');
                $scope.item_id = '';
                $scope.order_id = '';
                $scope.group_id = '';
                $scope.time_stamp = '';
                $scope.privilege = '';
                $scope.current_quantity = '';
                $scope.description = '';
                $scope.last_update = '';
                $scope.vendor_id = '';

               FlashService.Success('User updated');
               getInventory(vm.user.username);
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
        
        function getInventory(username) {
              InventoryService.GetInventory(username).then(function (data) {
               $scope.data = data.reverse();
               FlashService.Success('User updated');

            }).catch(function (error) {
                    FlashService.Error(error);
                });  
        };
        
        $scope.inventoryData = {
                    enableFiltering: true,
                    enableGridMenu: true,
                    enableSelectAll: true,
                    enablePaginationControls: true,
                    paginationPageSize: 10,
                    rowTemplate: rowTemplate(),
                    exporterCsvFilename: 'myFile.csv',
                    exporterPdfDefaultStyle: {fontSize: 9},
                    exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
                    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
                    exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
                    exporterPdfFooter: function ( currentPage, pageCount ) {
                      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                    },
                    exporterPdfCustomFormatter: function ( docDefinition ) {
                      docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                      return docDefinition;
                    },
                    exporterPdfOrientation: 'portrait',
                    exporterPdfPageSize: 'LETTER',
                    exporterPdfMaxGridWidth: 500,
                    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                    importerDataAddCallback: function ( grid, newObjects ) {
                      $scope.data = $scope.data.concat( newObjects );
                    },
                    onRegisterApi: function(gridApi){
                      $scope.gridApi = gridApi;
                    },
                    data: 'data',
                    columnDefs: [
                      { name: 'item_id' },
                      { name: 'order_id' },
                      { name: 'group_id' },
                      { name: 'time_stamp'},
                      { name: 'privilege' },
                      { name: 'current_quantity' },
                      { name: 'description' },
                      { name: 'last_update'},
                      { name: 'vendor_id'}
                    ]
               };
    };       

})();