'use strict';

angular.module('fireTicToeApp')
  .factory('user', ['$q', 'ref', function ($q, ref) {
      var defered = $q.defer();
      var user = {
          isLoggedIn: false, //change
          uid: null, //change
          login: function (name) {
              var users = ref.player;
              console.log(users);
          },
          setUser: function (id) {
              if (id<1 || id>2) {
                  console.log('wrong id');
                  return;
              }
              user.displayName = ref.player[id-1].value;
              user.uid = id;
              user.isLoggedIn = true;
          }
      };

      return user;
  }]);
