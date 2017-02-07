(function () {
    'use strict';

    angular.module('centoku').controller('setting', Controller);

    function Controller($window, UserService, FlashService, $scope, $rootScope) {
        var vm = this;
        $scope.update = true;
        vm.user = null;

        initController();
        
        $scope.userupdate = function() {
            $scope.save = true;
            $scope.update = false;
            $('.user-setting').removeAttr('disabled');
            $('.upload-btn').removeAttr('disabled');
            $('.user-setting').removeClass('disable-color');
        }
        
        $scope.cancel = function() {    
            $scope.save = false;
            $scope.update = true;
            $('.user-setting').attr('disabled', 'disabled');
            $('.upload-btn').attr('disabled', 'disabled');
            $('.user-setting').addClass('disable-color');
        }

        function initController() {
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }
        
        $scope.saveUser = function() {
            UserService.Update(vm.user).then(function (data) {
               console.log('updated successfully');
               FlashService.Success('User updated');
                $scope.cancel();
            }).catch(function (error) {
                    FlashService.Error(error);
                });
        }

        $('.upload-btn').on('click', function (){
            $('#upload-input').click();
        });

        $('#upload-input').on('change', function() {

              var files = $(this).get(0).files;

              if (files.length > 0){
                // create a FormData object which will be sent as the data payload in the
                // AJAX request
                var formData = new FormData();

                // loop through all the selected files and add them to the formData object
                for (var i = 0; i < files.length; i++) {
                  var file = files[i];

                  // add the files to formData object for the data payload
                  formData.append('uploads[]', file, file.name);
                }

                $.ajax({
                  url: '/upload/'+vm.user.username,
                  type: 'POST',
                  data: formData,
                  processData: false,
                  contentType: false,
                  success: function(data){
                      var resData = JSON.parse(JSON.stringify(data));
                      $scope.$apply(function () {
                           $rootScope.profilePicURL = "/uploads/"+ vm.user.username + "/"+ resData.profileName +".png";
                      });
                  },
                  xhr: function() {
                    // create an XMLHttpRequest
                    var xhr = new XMLHttpRequest();

                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function(evt) {

                      if (evt.lengthComputable) {
                        // calculate the percentage of upload completed
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);

                        // update the Bootstrap progress bar with the new percentage
                        $('.progress-bar').text(percentComplete + '%');
                        $('.progress-bar').width(percentComplete + '%');

                        // once the upload reaches 100%, set the progress bar text to done
                        if (percentComplete === 100) {
                          $('.progress-bar').html('Done');
                        }

                      }

                    }, false);

                    return xhr;
                  }
                });

              }
         });
    }

})();