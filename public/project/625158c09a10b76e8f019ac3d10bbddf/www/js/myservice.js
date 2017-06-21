angular.module('myService', ['ngStorage'])
    .directive('hideTabs', function($rootScope, $ionicTabsDelegate) {
        return {
            restrict: 'A',
            link: function($scope, $el) {
                $scope.$on("$ionicView.beforeEnter", function() {
                    $ionicTabsDelegate.showBar(false);
                });
                $scope.$on("$ionicView.beforeLeave", function() {
                    $ionicTabsDelegate.showBar(true);
                });
            }
        };

    })
    .filter('datePost', function() {
        return function(x) {
            date1 = new Date(x)
            date = new Date();
            var txt = '';
            var y = date - date1;
            if (y < (60 * 1000 * 60) && y > 0) {
                y = Math.floor(y / 60000);
                txt = y + ' mins';
            }
            if (y > (60 * 1000) && y < (60 * 60 * 1000 * 24)) {
                y = Math.floor(y / (60 * 60 * 1000))
                txt = y + ' hours';
            }
            if (y > (60 * 60 * 1000 * 24)) {
                y = Math.floor(y / (60 * 60 * 1000 * 24))
                txt = y + ' days';
            }
            /*if(y>(60*60*1000*24*30)){
                 y = Math.floor(y/(60*60*1000*24*30))
                 txt = y +' mounths';
               }*/
            return txt;

        }
    })
    .filter('dateToString', function() {
        return function(x) {
            var date1 = new Date(x);
            var txt = '';
            var day = date1.getDate();
            var mounth = date1.getMonth();
            var year = date1.getFullYear();

            txt = (day + 1) + '-' + (mounth + 1) + '-' + (year);
            return txt;
        }

    })
    .directive('hideFooters', function($rootScope) {
        return {
            link: function($scope, $el) {
                // $rootScope.hideFooter =
             //    $scope.$on('$destroy', function() {
             //  $rootScope.hideFooter = false;
             // });
                $scope.$on("$ionicView.beforeEnter", function() {
                    $rootScope.hideFooter = true;
                    console.log('$rootScope.hideFooter', $rootScope.hideFooter);
                });
              
            }
        }
    })  
    .directive('hideFooters1', function($rootScope) {
        return {
            link: function($scope, $el) {
                // $rootScope.hideFooter =
             //    $scope.$on('$destroy', function() {
             //  $rootScope.hideFooter = false;
             // });
                $scope.$on("$ionicView.enter", function() {
                    $rootScope.hideFooter = true;
                    console.log('$rootScope.hideFooter1', $rootScope.hideFooter);
                });
                // $scope.$on("$ionicView.beforeLeave", function() {
                //     $rootScope.hideFooter = false;
                //     console.log('$rootScope.hideFooter', $rootScope.hideFooter);
                // })
            }
        }
    })
    .service('getObject', function() {

    })
    .service('getData', function($http, $ionicSlideBoxDelegate, $timeout, getObject, $q, $rootScope,$state,$localStorage) {
        var data = {};
        var dataPost = [];
        data.slide = function(idSlide) {
            var deffered = $q.defer();
            var dataSlide = {};
			dataSlide.list = [];
            $http.get(hostName + '/' + idSlide).then(function(res) {
				dataSlide.data = res.data;
                var tmp = document.createElement('div');
                var data = res.data.content.rendered;
                tmp.innerHTML = data;
                var img = tmp.querySelectorAll('img');
                angular.forEach(img, function(item) {
                    var imgObj = {};
                    if (item.getAttribute('title') != undefined) {
                        imgObj.title = item.getAttribute('title');
                    }
                    if (item.getAttribute('alt') != undefined) {
                        imgObj.alt = item.getAttribute('alt');
                    }
                    if (item.getAttribute('src') != undefined) {
                        imgObj.src = item.getAttribute('src');
                    }
                    imgObj.link = res.data.link;
                    dataSlide.list.push(imgObj);
                    deffered.resolve(dataSlide);
                  
                });

            },function(e){
                $rootScope.hideLoad();
            })
            return deffered.promise;
        }
        data.posts = function(page, perPage, format, orderBy) {
                var deffered = $q.defer();
                $http.get(hostName, {
                    params: {
                        'page': page,
                        'per_page': perPage,
                        'filter[post_format]=': format,
                        'filter[orderby]=': orderBy,
                        'order': 'desc'
                    }
                }).then(function(res) {
                    deffered.resolve(res.data);
                })
                return deffered.promise;
            }
            //category
        data.category = function(page, groupId, parent) {
            var deffered = $q.defer();
            $http.get(url + endPointCategory, {
                params: {
                    'page': page,
                    'per_page': 100,
                    'includes': groupId,
                    'parent': parent
                }
            }).then(function(res) {
                deffered.resolve(res.data);
            })
            return deffered.promise;
        }
        data.userInfo = function(user) {
                var deffered = $q.defer();
                $http.post(url + endPointGetUser + '=' + user).then(function(res) {
                    console.log(res.data);
                    deffered.resolve(res.data);
                });
                return deffered.promise;
            }
            // Update info user
        data.updateUser = function(token, email, pass, fullname) {
            if(typeof pass=='undefined'){
                pass = $localStorage.pass;
            }
                var deffered = $q.defer();
                $http({
                    method: 'POST',
                    url: url + '/wp-json/mobiconnector/user/update_profile',
                    data: {
                        'display_name': fullname,
                        'user_email': email,
                        'user_pass': pass,

                    },
                    cache: false,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token },
                    withCredentials: true,
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        console.log(str.join("&"));
                        return str.join("&");
                    }

                }).then(function(res) {
                    console.log(res)
                    deffered.resolve(res.data);
                })
                return deffered.promise;
            }
            // update avata
        data.updateAvata = function(token, avata) {
                $http({
                    method: 'POST',
                    url: url + '/wp-json/mobiconnector/user/update_profile',
                    data: {
                        'user_profile_picture': avata
                    },
                    cache: false,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token },
                    withCredentials: true,
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        console.log(str.join("&"));
                        return str.join("&");
                    }

                })
            }
            // get-comment
        data.getComment = function(id) {
                $rootScope.showLoad();
                var deffered = $q.defer();
                $http.get(url + endPointGetComment, {
                    params: { 'post': id }
                }).then(function(res) {
                    deffered.resolve(res.data);
                    $rootScope.hideLoad();
                })
                return deffered.promise;
            }
            // send Comment

        var showE = "<p>Unable to update. Please try again later.</p>"
        data.sendComment = function(dataSend, id, token) {
            $http({
                method: 'POST',
                url: url + 'wp-json/wp/v2/comments',
                data: { 'content': dataSend, 'post': id },
                cache: false,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer '+token},
                withCredentials: true,
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    console.log(str.join("&"));
                    return str.join("&");
                }

            }).then(function(res) {
                $rootScope.hideLoad();
                console.log(token);
                $state.reload();
            }, function(res) {
                $rootScope.hideLoad();
                $rootScope.showErorr(showE);
            })
        }
        return data;

    })
    .run(function($rootScope, $http, $ionicSlideBoxDelegate, $ionicPopup,$localStorage) {
        var dataSlide = [];
        $rootScope.getDataSlide = function(idSlide, name) {

            $http.get(hostName + '/' + idSlide).then(function(res) {
                var tmp = document.createElement('div');
                var data = res.data.content.rendered;
                tmp.innerHTML = data;
                var img = tmp.querySelectorAll('img');
                angular.forEach(img, function(item) {
                    var imgObj = {};
                    if (item.getAttribute('title') != undefined) {
                        imgObj.title = item.getAttribute('title');
                    }
                    if (item.getAttribute('alt') != undefined) {
                        imgObj.alt = item.getAttribute('alt');
                    }
                    if (item.getAttribute('src') != undefined) {
                        imgObj.src = item.getAttribute('src');
                    }
                    dataSlide.push(imgObj);
                    $timeout(function(){ $ionicSlideBoxDelegate.$getByHandle(name).update();},1000)
                   

                });

            })
            return dataSlide;
        }
        $rootScope.showConfirm = function(temp) {
            var showComfirm = $ionicPopup.confirm({
                cssClass:'popup-confirm',
                template: '<p>Are You Sure Delete?</p>'
            });
            showComfirm.then(function(res) {
                if (res) {
                    temp();
                }
            })
        }

    });
