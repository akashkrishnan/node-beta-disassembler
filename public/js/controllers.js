'use strict';

angular.module('myApp.controllers', [])
  .controller('mainCtrl', mainCtrl);

function mainCtrl($scope, $socket, $log, $window) {

  var socket = new $socket($scope);

  // Assemble textarea change event
  $scope.disassemble = function () {
    socket.emit('disassemble', $scope.output);
  };

  // Reconnect event from server
  socket.on('reconnect', function () {
    $window.location.href = '/';
  });

  // Assemble event from server
  socket.on('disassemble', function (data) {
    if (data) {
      if (data.err) $log.warn(err);
      $scope.$apply(function () {
        $scope.assembly = data.assembly;
      });
    }
  });

}
