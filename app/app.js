var app = angular.module('StarterApp', ['ngMaterial']);

app.controller('AppController', ['$mdSidenav', '$mdDialog', '$scope', '$location', '$anchorScroll', function ($mdSidenav, $mdDialog, $scope, $location, $anchorScroll) {
    var remote = require('remote');
    var dialog = remote.require('dialog');
    var fs = require('fs');
    var vm = this;

    vm.basepath = "";
    vm.sourceFiles = [];
    vm.filters = [];
    // Should this two be [{id: XX, selected: true}] ?
    vm.current = [];
    vm.selection = [];

    //   var remote = require('remote');
    //var globalShortcut = remote.require('global-shortcut');

    //// Register a 'ctrl+x' shortcut listener.
    //var ret = globalShortcut.register('CmdOrCtrl+x', function() { alert('ctrl+x is pressed'); })
    //if (!ret)
    //  console.log('registerion fails');


    vm.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };

    vm.openFolder = function () {
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }, function (folder) {
            vm.basepath = folder[0];
            vm.sourceFiles = fs.readdirSync(folder[0]);
            console.log(vm.sourceFiles);
            // The first choosen filter is the original set of images
            vm.filters[0] = vm.sourceFiles;
            // Current holds the photos chosed but not yet sent to be a filter
            vm.current = [];
            $scope.$apply();
        })
    };

    //    vm.toFilter = function (arrayOfFileNames) {
    //        return _.transform(arrayOfFileNames, function (result, n) {
    //            result.push({
    //                fileName: n,
    //                choosed: false
    //            });
    //        });
    //    };
    vm.showFilter = function (filter) {
        vm.current = vm.filters[filter];
    };
    vm.showSelection = function (filter) {
        vm.current = vm.selection;
    };
    vm.clearSelection = function () {
//        vm.current = [];
        vm.selection = [];
    };

    vm.promoteSelectionToFilter = function () {
        vm.filters.push(vm.selection);
        vm.clearSelection();
    };

    vm.gotoNext = function (id) {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash(id + 1);

        // call $anchorScroll()
        $anchorScroll();
    };

    vm.pickPhoto = function (fileName, id) {
        if (!_.contains(vm.selection, fileName)) {
            vm.selection.push(fileName);
        }
        vm.gotoNext(id);
    };


    vm.showConfirm = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Would you like to delete your debt?')
            .content('All of the banks have agreed to <span class="debt-be-gone">forgive</span> you your debts.')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Please do it!')
            .cancel('Sounds like a scam');
        $mdDialog.show(confirm).then(function () {
            $scope.status = 'You decided to get rid of your debt.';
        }, function () {
            $scope.status = 'You decided to keep your debt.';
        });
    };

    vm.showAdvanced = function (ev) {
        $mdDialog.show({
                controller: DialogController,
                templateUrl: 'dialog1.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function (answer) {
                vm.status = 'You said the information was "' + answer + '".';
            }, function () {
                vm.status = 'You cancelled the dialog.';
            });
    };

    function DialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };

        $scope.buildList = function (folder) {

            //      for (var i = 0, file; file = self.fileList[i]; ++i) {
            //        pathList_.push(file.webkitRelativePath);
            //      }
            console.log(folder.files);
        }
    }
}]);