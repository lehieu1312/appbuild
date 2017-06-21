// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'myService', 'ngStorage', 'ngCordova', 'myTranslate'])

.run(function($ionicPlatform, $ionicSideMenuDelegate, $rootScope, $ionicHistory, $ionicLoading, $ionicTabsDelegate, $ionicPopup, $ionicScrollDelegate, $state, $cordovaNetwork) {
    if(rtl_language){
        $rootScope.app_direction = "rtl";
    }
    $ionicPlatform.ready(function(){
        
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        if (navigator.splashscreen) {
            setTimeout(function() {
                navigator.splashscreen.hide();
            }, 100);
        }
        // google
        if (window.ga) {
            window.ga.startTrackerWithId(google_analytics, 30);
            if (ionic.Platform.isAndroid()) window.ga.trackView('Android');
            else window.ga.trackView('iOS');
        }
        //notification

        if (window.plugins) {
            window.plugins.OneSignal
			.startInit(your_appId, your_googleProject)
			.inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
			.handleNotificationOpened(function(jsonData) {
				if (ionic.Platform.isAndroid()) {
					var addData = JSON.parse(jsonData.notification.payload.additionalData);
				} else {
					var addData = jsonData.notification.payload.additionalData;
				}
				if (typeof addData != 'undefined') {
					if (typeof addData.posts != 'undefined') {
						var idadd = Number(addData.posts);
						$state.go('app.details', { idPost: idadd });
					} else if (typeof addData.category != 'undefined') {
						var idcategory = addData.category;
						$state.go('app.detailsCategory', { idCategory: idcategory })
					}
				}
			})
			.endInit();
        }
		//open link
			$rootScope.openLink = function (link) {
				if (link.indexOf("link://") == 0) {
					link = link.replace("link://", "");
					var data = link.split("/");
					if (data[0] == "posts")
						$state.go("app.details", {
							idPost: data[1]
						});
					else if (data[0] == "category")
						$state.go("app.detailsCategory", {
							idCategory: data[1]
						});
					else if (data[0] == "bookmark") {
						if (data[1])
							$state.go("app.bookmark", {
								type: data[1]
							});
						else
							$state.go("app.bookmark");
					} else if (data[0] == "about-us")
						$state.go("app.about");
					else if (data[0] == "term-and-conditions")
						$state.go("app.term");
					else if (data[0] == "privacy-policy")
						$state.go("app.privacy");
				} else {
					if (window.cordova) {
						if (open_link_inappbrowser)
							cordova.InAppBrowser.open(link, '_blank', 'location=yes');
						else
							cordova.InAppBrowser.open(link, '_system', 'location=yes');
					}
				}
			};
		//offline
		document.addEventListener("offline", onOffline, false);
		function onOffline(){
			$rootScope.isOffline = true;
			$rootScope.$apply();
		}
		document.addEventListener("online", onOnline, false);
		function onOnline(){
			$rootScope.isOffline = false;
			$rootScope.$apply();
		}
    });
    $rootScope.activemenu = false;
    //activemenu
    $rootScope.activeMenu = function() {
            $rootScope.activemenu = !$rootScope.activemenu;


        }
        // share
    $rootScope.share = function(url) {
            window.plugins.socialsharing.share(null, null, null, url);

        }
        // go back
    $rootScope.comeBack = function() {
            $ionicHistory.goBack();
            // console.log($ionicHistory.backView());
        }
        // show-load
    $rootScope.showLoad = function() {
            $ionicLoading.show({
                templateUrl: 'templates/options/loadding.html'
            });
			setTimeout(function(){$rootScope.hideLoad()}, 30000);
			$rootScope.hideLoad = function(){
				$ionicLoading.hide();
			}
        }
        //hide-load
        //go-tab
    $rootScope.goTab = function(index) {
            $ionicTabsDelegate.$getByHandle('my-tabs').select(index);
        }
        // croll top
    $rootScope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

    //show erorr
    $rootScope.showErorr = function(temp) {
        $ionicPopup.alert({
            template: '<div class="popup-erorr"><img src="img/erorr.png"></img></div>' + temp,
            buttons: [
                { text: 'Close' }
            ]
        })
    }
    $rootScope.showSucess = function(temp) {
        $ionicPopup.alert({
            template: '<div class="popup-erorr"><img src="img/ok.png"></img></div>' + temp,
            buttons: [
                { text: 'Close' }
            ]
        })
    }
    // go-category
    $rootScope.goCate = function() {
        delete $rootScope.childId;
        if ($ionicHistory.currentView().stateName == 'app.category') {
            $state.reload();
        } else {
            $state.go('app.category');
        }
    }
})

.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

        .state('app.tabs', {
            url: '/tabs',
            views: {
                'menuContent': {
                    templateUrl: 'templates/tab/tabs.html',
                    controller: 'tabCtrl'
                }
            }
        })

        .state('app.profile', {
			url: '/profile',
			views: {
				'menuContent': {
					templateUrl: 'templates/profile/index.html',
					controller: 'profileCtrl'
				}
			}
		})
		.state('app.login', {
			url: '/login',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'templates/login/index.html',
					controller: 'loginCtrl'
				}
			}
		})

        .state('app.details', {
            url: '/details/:idPost',
            views: {
                'menuContent': {
                    templateUrl: 'templates/details/index.html',
                    controller: 'detailsCtrl'
                }
            }
        }).state('app.signup', {
            url: '/signup',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/signup/index.html',
                    controller: 'signupCtrl'
                }
            }
        })
		.state('app.term', {
            url: '/term',
            views: {
                'menuContent': {
                    templateUrl: 'templates/signup/term.html',
                }
            }
        })
		.state('app.about', {
            url: '/about',
            views: {
                'menuContent': {
                    templateUrl: 'templates/signup/about.html',
                }
            }
        })
		.state('app.privacy', {
            url: '/privacy',
            views: {
                'menuContent': {
                    templateUrl: 'templates/signup/privacy.html',
                }
            }
        })
		.state('app.forgot', {
            url: '/forgot',
            views: {
                'menuContent': {
                    templateUrl: 'templates/signup/forgot.html',
                    controller: 'forgotPassCtrl'
                }
            }
        })
		.state('app.category', {
            url: '/category',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/category/index.html',
                    controller: 'categoryCtrl'
                }
            }
        })
		.state('app.detailsCategory', {
            url: '/detailsCategory/:idCategory',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/category/details.html',
                    controller: 'detailsCategoryCtrl'
                }
            }
        })
		.state('app.comment', {
            url: '/comment/:idComment',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/comment/index.html',
                    controller: 'commentCtrl'
                }
            }
        })
		.state('app.bookmark', {
            url: '/bookmark/:type',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/bookmark/index.html',
                    controller: 'bookMarkCtrl'
                }
            }
        })
		.state('app.search', {
            url: '/search',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/search/index.html',
                    controller: 'searchCtrl'
                }
            }
        })
		.state('app.slidebox', {
            url: '/slidebox/:idSlide',
            views: {
                'menuContent': {
                    templateUrl: 'templates/slidebox/index.html',
                    controller: 'slideboxCtrl'
                }
            }
        });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/tabs');
    })
.config(function($ionicConfigProvider) {
	$ionicConfigProvider.tabs.position('top');

	$ionicConfigProvider.tabs.style("standard");
})
.directive('detail', function($compile, $parse) {
	return {
		restrict: 'E',
		link: function(scope, element, attr) {
			scope.$watch(attr.content, function() {
				element.html($parse(attr.content)(scope));
				$compile(element.contents())(scope);
			}, true);
		}
	}
})
.directive('menuCloseKeep', ['$ionicHistory', function($ionicHistory) {
    return {
        restrict: 'AC',
        link: function($scope, $element) {
            $element.bind('click', function() {
                var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
                if (sideMenuCtrl) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: false,
                        disableAnimate: true,
                        expire: 300
                    });
                    sideMenuCtrl.close();
                }
            });
        }
    };
}])	