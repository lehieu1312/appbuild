angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPopup, $rootScope, $ionicSideMenuDelegate) {
	//version
	$scope.version = version;
	$scope.font = {};
	$scope.checkPush = $localStorage.allow || true;
	//active-menu
	$scope.allowNotifi = function (check) {
		if (window.plugins) {
			window.plugins.OneSignal.setSubscription(check);
		}
		$localStorage.allow = check;
		console.log(check);
	}
	// Rate app
	$scope.rateApp = function () {
		if (ionic.Platform.isAndroid())
			cordova.InAppBrowser.open("market://details?id=" + android_packageName, "_system");
		else
			cordova.InAppBrowser.open("itms-apps://itunes.apple.com/app/id" + apple_id + "?mt=8", "_system");
	};
	//text size
	$scope.font.s = $localStorage.textSize || 'normal';
	$rootScope.textSize = $scope.font.s;
	$scope.textSize = function () {
		var myPopup1 = $ionicPopup.confirm({
				templateUrl: 'templates/options/textsize.html',
				title: 'Text Size',
				scope: $scope,
				cssClass: 'PopupT'
				// buttons: [{
				//     text: 'Cancel',
				// }, {
				//     text: 'Ok',

				// }]
			})
			myPopup1.then(function (res) {
				if (res) {
					$localStorage.textSize = $scope.font.s;
					$rootScope.textSize = $scope.font.s;
				} else {
					$scope.font.s = $localStorage.textSize || 'normal';
				}
			})
	}

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});
})
/*-------------------------------Post-Ctrl-------------------------*/
.controller('postCtrl', function ($scope, $http, $timeout, $ionicSlideBoxDelegate, getData, $interval, $rootScope) {
	var page = 1;
	var topId;
	$scope.topLatest = [];
	$scope.checkLoad = true;
	$scope.checkMore = true;
	$scope.checkMoreVideo = true;
	$scope.checkMoreImage = true;
	$scope.topSlide = [];

	// latest-image
	// $http.get(hostName, {
	//         params: { 'page': 1, 'per_page': 3, 'filter[post_format]': 'post-format-image,post-format-gallery' }
	//     }).then(function(res) {
	//         $scope.latestImage = res.data;
	//         $scope.show = true;
	//         $scope.idSlide = res.data[0].id;
	//         $scope.topSlide = getData.slide($scope.idSlide, "image-viewer1");
	//     })
	// setInterval(function(){$scope.hideLoad()},4000);

	// top-slide
	function load(refresh){
		$http.get(url + endPointPost, {
			params: {
				'sticky': 1,
				'per_page': 5,
				'order': 'desc',
				'orderby': 'date'
			}
		}).then(function (data) {
			if (refresh) {
				$scope.topSlide = [];
			}
			$scope.topSlide = data.data;
			$timeout(function () {
				$ionicSlideBoxDelegate.$getByHandle('image-viewer1').update();
			}, 10);
			
				
			
		})
		getData.posts(1, 5, "post-format-image,post-format-gallery").then(function (data) {
			if (refresh) {
				$scope.latestImage = [];
			}
			$scope.latestImage = data;
			if (data.length < 5) {
				$scope.checkMoreImage = false;
			}
			// if (data.length > 0) {
			//     $scope.idSlide = data[0].id;
			//     getData.slide($scope.idSlide).then(function(data) {
			//         $timeout(function() { $ionicSlideBoxDelegate.$getByHandle('image-viewer1').update(); }, 2000);
			//         $scope.topSlide = data;
			//         $scope.hideLoad();
			//     });

			// }
		})
		// latest-video
		getData.posts(1, 4, "post-format-video").then(function (data) {
			if (refresh) {
				$scope.latestVideo = [];
			}
			$scope.latestVideo = data;
			if (data.length < 4) {
				$scope.checkMoreVideo = false;
			}
		})
		// latest-data
		getData.posts(1, 4).then(function (data) {
			if (refresh) {
				$scope.topLatest = [];
			}
			angular.forEach(data, function (item) {
				if (item.format == 'standard') {
					$scope.topLatest.push(item);
				}
			});
			topId = data[0].id;
			$scope.hideLoad();
			$scope.show = true;
			$scope.$broadcast('scroll.refreshComplete');
		})
		// category
		$http.get(url + endPointCategory, {
			params: {
				'page': 1,
				'per_page': 100,
				'parent': 0
			}
		}).then(function (res) {
			if (refresh){
				$scope.dataCategory = [];
			}
			$scope.dataCategory = res.data;
			$scope.categoryWidth = $scope.dataCategory.length * 95;
		})
	}
	load();
	//load-more
	$scope.loadMore = function () {
		page += 1;
		if ($scope.checkMore) {
			$scope.showLoad();
			getData.posts(page, 10).then(function (data) {
				if (data.length == 0) {
					$scope.checkMore = false;
				}
				angular.forEach(data, function (item) {
					$scope.topLatest.push(item);
				});
				$scope.hideLoad();
			})
		}
	}
	// load-more video
	$scope.loadMoreVideo = function () {
		page += 1;
		if ($scope.checkMoreVideo) {
			$scope.showLoad();
			getData.posts(page, 4, 'post-format-video').then(function (data) {
				if (data.length < 4) {
					$scope.checkMoreVideo = false;
				}
				angular.forEach(data, function (item) {
					$scope.latestVideo.push(item);
				});
				$scope.hideLoad();
			})
		}
	}
	// load-more image
	$scope.loadMoreImage = function () {
		page += 1;
		if ($scope.checkMoreImage) {
			$scope.showLoad();
			getData.posts(page, per_page / 2, 'post-format-image,post-format-gallery').then(function (data) {
				if (data.length < 5) {
					$scope.checkMoreImage = false;
				}
				angular.forEach(data, function (item) {
					$scope.latestImage.push(item);
				});
				$scope.hideLoad();
			})
		}
	}
	// refresh
	$scope.doRefresh = function(){
		var page = 1;
		load(true);
	};
})
/*--------------------------------Feature-Ctrl----------------------------*/
.controller('featureCtrl', function ($scope, $http, getData) {
	$scope.showLoad();
	function load(refresh){
		// feature data
		getData.posts(1, 4, "", "post_views").then(function (data) {
			if(refresh) {
				$scope.topFeature = [];
			}
			$scope.topFeature = data;
			$scope.$broadcast('scroll.refreshComplete');
		})

		// feature video
		getData.posts(1, 10, "post-format-video", "post-views").then(function (data) {
			if(refresh){
				$scope.featureVideo = [];
			}
			$scope.featureVideo = data;
		})
		//feature image-gallery
		getData.posts(1, 10, "post-format-image,post-format-gallery", "post-views").then(function (data) {
			if (refresh){
				$scope.featureImage = [];
			}
			$scope.featureImage = data;
			$scope.hideLoad();
		})
	}
	load();
	$scope.doRefresh = function(){
		load(true);
	};
})
/*---------------------------------Photo-Ctrl----------------------------*/
.controller('photoCtrl', function ($scope, $http, getData, $rootScope) {
	var page = 1;
	$scope.checkMore = true;
	$scope.showLoad();
	function load(refresh){
		getData.posts(page, per_page / 2, "post-format-image,post-format-gallery").then(function (data) {
			if (refresh) {
				$scope.dataImage = [];
			}
			$scope.dataImage = data;
			if (data.length == 0) {
				$scope.checkMore = false;
			}
			$scope.$broadcast('scroll.refreshComplete');
			$scope.hideLoad();
		})
	}
	load();
	$scope.loadMore = function () {
		$scope.showLoad();
		page += 1;
		getData.posts(page, per_page / 2, "post-format-image,post-format-gallery").then(function (data) {
			if (data.length > 0) {
				$scope.checkMore = true;
			} else {
				$scope.checkMore = false;
			}
			angular.forEach(data, function (item) {
				$scope.dataImage.push(item);
			});
			$scope.hideLoad();
		})
	}
	// update
	$rootScope.$on('update', function (event, data) {
		if (data.format == 'gallery' || data.format == 'image') {
			$scope.dataImage.unshift(data);
		}
	})
	$scope.doRefresh = function(){
		var page = 1;
		load(true);
	};
})
/*---------------------------------Video-Ctrl-------------------------*/
.controller('videoCtrl', function ($scope, $http, getData, $rootScope) {
	var page = 1;
	$scope.checkMore = true;
	$scope.showLoad();
	function load(refresh){
		getData.posts(page, per_page / 2, "post-format-video").then(function (data) {
			if (refresh) {
				$scope.dataVideo = [];
			}
			$scope.dataVideo = data;
			if (data.length == 0) {
				$scope.checkMore = false;
			}
			$scope.$broadcast('scroll.refreshComplete');
			$scope.hideLoad();
		})
	}
	load();
	// Load More
	$scope.loadMore = function () {
		page += 1;
		$scope.showLoad();
		getData.posts(page, per_page / 2, "post-format-video").then(function (data) {
			if (data.length == 0) {
				$scope.checkMore = false;
			}
			angular.forEach(data, function (item) {
				$scope.dataVideo.push(item);
			});
			$scope.hideLoad();
		})

	}
	// update
	$rootScope.$on('update', function (event, data) {
		if (data.format == 'video') {
			$scope.dataVideo.unshift(data);
		}
	})
	$scope.doRefresh = function(){
		var page = 1;
		load(true);
	};
})
/*-----------------------Tab-Ctrl-----------------------------------------*/
.controller('tabCtrl', function ($scope, $rootScope, $ionicTabsDelegate, $timeout, $localStorage, $ionicPopup, $state) {

	$scope.showLoad();
	// active
	$scope.$on("$ionicView.beforeEnter", function () {
		$rootScope.hideFooter = false;
	});

	$scope.$on('$ionicView.enter', function (event, data) {
		$rootScope.activehome = true;
	})
	$scope.$on('$ionicView.leave', function (event, data) {
		$rootScope.activehome = false;
	})
	//get Index Tab
	$scope.getIndexTab = function () {
		$timeout(function () {
			$rootScope.checkBar = $ionicTabsDelegate.$getByHandle('my-tabs').selectedIndex();
		}, 100);
	}
	// checkLog
	$scope.$watch('checkLog', function (newValue, oldValue) {
		if (newValue = !oldValue) {
			console.log($rootScope.checkLog);
		}
	});
	if (typeof $localStorage.login != 'undefined') {
		$rootScope.checkLog = true;
	}

	// logOut
	$scope.logOut = function () {
		var confirm = $ionicPopup.confirm({
				template: '<p>Are You Sure Log Out ?</p>',
				cssClass: 'popup-confirm'
			});
		confirm.then(function (res) {
			if (res) {
				$rootScope.checkLog = false;
				delete $localStorage.login;
				$state.reload();
			}
		})
	}
	//check profile
	$scope.checkProfile = function () {
		if (typeof $localStorage.login == 'undefined') {
			$state.go('app.login');
		} else {
			$state.go('app.profile');
		}
	}
})
.controller('signupCtrl', function ($scope) {
	/*----------------------------Slide-boxctrl-------------------------*/
}).controller('slideboxCtrl', function ($scope, $http, $stateParams, $localStorage, $timeout, $ionicSlideBoxDelegate, getData, $state, $ionicHistory) {
	$scope.idSlide = $stateParams.idSlide;
	$scope.data = [];
	//get-data-slide
	$scope.showLoad();
	if ($localStorage.bookMark != undefined) {
		angular.forEach($localStorage.bookMark, function (item) {
			if (item == $scope.idSlide) {
				$scope.bookMarked = true;
			}
		});
	}
	getData.slide($scope.idSlide).then(function (data) {
		$timeout(function () {
			$ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
		}, 2000);
		$scope.list = data.list;
		$scope.data = data.data;
		$scope.hideLoad();
	});

	$scope.bookMark = function () {
		$scope.bookMarked = !$scope.bookMarked;
		$scope.popBook = true;
		if ($localStorage.bookMark == undefined) {
			$localStorage.bookMark = [];
		}
		if ($scope.bookMarked == true) {
			$localStorage.bookMark.push($scope.idSlide);
			$scope.tmp = "BookMark SucessFully ";
		} else {
			$scope.tmp = "BookMark Removed";
			angular.forEach($localStorage.bookMark, function (item) {
				if (item == $scope.idSlide) {
					var index = $localStorage.bookMark.indexOf(item);
					$localStorage.bookMark.splice(index, 1);
				}
			});
		}
		$timeout(function () {
			$scope.popBook = false
		}, 5000);
	}
	$scope.onRelease = function(e, index){
		if(index != 0 && index != $scope.list.length-1) return;
		switch(e.gesture.direction){
			case "left":
				if(Math.abs(e.gesture.deltaX) > 100 && Math.abs(e.gesture.deltaY) < 50){
					if(index == $scope.list.length-1 && $scope.data.mobiconnector_next_id){
						$ionicHistory.currentView($ionicHistory.backView());
						$state.go('app.slidebox', {idSlide:$scope.data.mobiconnector_next_id});
					}
				}
				break;
			case "right":
				if(Math.abs(e.gesture.deltaX) > 100 && Math.abs(e.gesture.deltaY) < 50){
					if(index == 0 && $scope.data.mobiconnector_previous_id){
						$ionicHistory.currentView($ionicHistory.backView());
						$state.go('app.slidebox', {idSlide:$scope.data.mobiconnector_previous_id});
					}
				}
				break;
		}
	};
	//check-comment
	$scope.checkComment = function () {
		if (typeof $localStorage.login == 'undefined') {
			$state.go('app.login');
		} else {
			$state.go('app.comment', {
				idComment: $scope.idSlide
			});
		}
	}
})
/*---------------------------------Details-Ctrl-------------------------*/
.controller('detailsCtrl', function ($scope, $http, $stateParams, $localStorage, $timeout, $state, $sce, $cordovaSocialSharing, $ionicHistory) {
	var idPost = $stateParams.idPost;
	$scope.limit = 5;
	var length;
	$scope.$sce = $sce;
	$scope.dataIncate = [];
	if ($localStorage.bookMark != undefined) {
		angular.forEach($localStorage.bookMark, function (item) {
			if (item == idPost) {
				$scope.bookMarked = true;
			}
		});
	}
	// opnen external link

	$scope.onDrag = function(e){
		switch(e.gesture.direction){
			case "left":
				if(Math.abs(e.gesture.deltaX) > 5 && Math.abs(e.gesture.deltaY) < 50){
					if($scope.data.mobiconnector_next_id){
						$ionicHistory.currentView($ionicHistory.backView());
						$state.go('app.details', {idPost:$scope.data.mobiconnector_next_id}, {location:'replace'});
					}
				}
				break;
			case "right":
				if(Math.abs(e.gesture.deltaX) > 5 && Math.abs(e.gesture.deltaY) < 50){
					if($scope.data.mobiconnector_previous_id){
						$ionicHistory.currentView($ionicHistory.backView());
						$state.go('app.details', {idPost:$scope.data.mobiconnector_previous_id}, {location:'replace'});
					}
				}
				break;
		}
	};
	// share via twiter
	$scope.shareViaTwitter = function (link) {
		$cordovaSocialSharing
		.shareViaTwitter(null, null, link)
		.then(function (result) {
			// Success!
		}, function (err) {
			// An error occurred. Show a message to the user
		});
	}
	$scope.shareViaFacebook = function (link) {
		$cordovaSocialSharing
		.shareViaFacebook(null, null, link)
		.then(function (result) {
			// Success!
		}, function (err) {
			// An error occurred. Show a message to the user
		});
	}
	$scope.shareViaGoogle = function (link) {
		$cordovaSocialSharing
		.shareViaGoogle(null, null, link)
		.then(function (result) {
			// Success!
		}, function (err) {
			// An error occurred. Show a message to the user
		});
	}
	// book-mark
	$scope.bookMark = function () {
		var obj = {};
		$scope.bookMarked = !$scope.bookMarked;
		$scope.popBook = true;
		if ($localStorage.bookMark == undefined) {
			$localStorage.bookMark = [];
		}
		if ($scope.bookMarked == true) {

			$localStorage.bookMark.push(idPost);
			$scope.tmp = "BookMark SucessFully ";
		} else {
			$scope.tmp = "BookMark Removed";
			angular.forEach($localStorage.bookMark, function (item) {
				if (item == idPost) {
					item = item.toString();
					var index = $localStorage.bookMark.indexOf(item);
					$localStorage.bookMark.splice(index, 1);
				}
			});
		}
		$timeout(function () {
			$scope.popBook = false
		}, 5000);
	}
	// get data details
	$scope.showLoad();
	$http.get(url + '/wp-json/mobiconnector/post/counter_view?post_id=' + idPost);
	$http.get(hostName + '/' + idPost).then(function (res) {
		var tmp = document.createElement('div');
		tmp.innerHTML = res.data.content.rendered;
		var a = tmp.querySelectorAll('a');
		for (var i = 0; i < a.length; i++) {
			var attributes = "openLink('" + a[i].getAttribute('href') + "')";
			a[i].setAttribute("ng-click", attributes);
			a[i].setAttribute("href", "javascipt:void(0)");
			console.log(a[i]);
		}
		var iframe = tmp.querySelectorAll('iframe');
		for (var i = 0; i < iframe.length; i++) {
			//nếu đường dẫn thẻ iframe từ Youtube
			if (iframe[i].src.indexOf("youtube.com") != -1) {
				//thêm đối số enablejsapi=1 vào đường dẫn thẻ iframe để kích hoạt jsapi Youtube
				if (iframe[i].src.split('?').length > 1)
					iframe[i].src += "&enablejsapi=1";
				else
					iframe[i].src += "?enablejsapi=1";
			}
		}
		res.data.content.rendered = tmp.innerHTML;
		$scope.data = res.data;
		$http.get(url + endPointCategory + '/' + res.data.categories[0]).then(function (res) {
			$scope.nameCate = res.data.name
				var idCate = res.data.id;
			$scope.goCategory = function () {
				$state.go('app.detailsCategory', {
					idCategory: idCate
				});
			}
		})
		length = res.data.mobiconnector_posts_incategory.length;
		angular.forEach(res.data.mobiconnector_posts_incategory, function (item) {
			$http.get(hostName + '/' + item.ID).then(function (res) {
				$scope.dataIncate.push(res.data);
			})
		});
		$scope.hideLoad();
	});
	$scope.$on('$stateChangeStart', function (event, toState, toParams) {
		//biến iframe là mảng tất cả các thẻ iframe trong nội dung bài viết
		var iframe = document.querySelectorAll('iframe');
		//dùng for lặp các thẻ iframe
		for (var i = 0; i < iframe.length; i++) {
			//nếu đường dẫn thẻ iframe từ Youtube
			if (iframe[i].src.indexOf("youtube.com") != -1) {
				//postMessage để chạy func tắt video
				iframe[i].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
			}
		}
	});

	//load-more
	$scope.loadMore = function () {
		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.limit += 5;
		console.log('$scope.limit', $scope.limit);
	}
	// check-coment
	$scope.checkComment = function () {
		$state.go('app.comment', {
			idComment: idPost
		});
	}
})
/*-----------------------------Category-Ctrl---------------------------------*/
.controller('categoryCtrl', function ($scope, $http, getData, $rootScope, $state, $rootScope) {
	$scope.dataCate = [];
	var arrayId = [];
	var idParent;
	// active
	$scope.$on('$ionicView.enter', function (event, data) {
		$rootScope.activecate = true;
	})
	$scope.$on('$ionicView.leave', function (event, data) {
		$rootScope.activecate = false;
	})
	$scope.showLoad();
	// if (angular.isDefined($rootScope.childId)) {
	//     $scope.showLoad();
	//     if ($rootScope.childId.length == 0) {
	//         getData.category(1, "", 0).then(function(data) {
	//             $scope.dataCate = data;
	//             $scope.hideLoad();
	//         })
	//     } else {
	//         var idChild = $rootScope.childId.toString();
	//         $http.get(url + endPointCategory + "?include=" + idChild).then(function(data) {
	//             $scope.dataCate = data.data;
	//             $scope.hideLoad();
	//         });
	//     }
	// } else {
	//     $scope.showLoad();
	//     getData.category(1, "", 0).then(function(data) {
	//         $scope.dataCate = data;
	//         angular.forEach(data, function(item) {
	//             arrayId.push(item.id);
	//         });
	//         $scope.hideLoad();
	//     })
	// }
	// back
	if (angular.isUndefined($rootScope.childId)) {
		getData.category(1, "", 0).then(function (data) {
			$scope.dataCate = data;
			$scope.hideLoad();
		})
	} else {
		var idChild = $rootScope.childId.toString();
		$http.get(url + endPointCategory + "?include=" + idChild).then(function (data) {
			$scope.dataCate = data.data;
			idParent = data.data[0].parent;
			console.log('data.data.parent', data.data[0].parent);
			$scope.hideLoad();
		});

	}
	// back
	$scope.back = function () {
		$state.go('app.detailsCategory', {
			idCategory: idParent
		});
	}
})
/*------------------------------Details-Category---------------------------------*/
.controller('detailsCategoryCtrl', function ($scope, $http, $stateParams, getData, $rootScope, $state, $ionicHistory, $ionicScrollDelegate) {
	var id = $stateParams.idCategory;
	console.log('id', id);
	var childId = [];
	$scope.$on('$ionicView.enter', function (event, data) {
		$rootScope.activecate1 = true;
	})
	$scope.$on('$ionicView.beforeLeave', function (event, data) {
		$rootScope.activecate1 = false;
	})
	$http.get(url + endPointCategory + "/" + id).then(function (data) {
		$scope.name = data.data.name;
		// if (data.data.parent == 0) {
		//     $scope.c1 = true;
		// } else {
		//     idParent = data.data.parent;
		//     $scope.c1 = false;
		//     getData.category().then(function(data) {
		//         angular.forEach(data, function(item) {
		//             if (item.parent == idParent) {
		//                 $rootScope.childId.push(item.id);
		//             }
		//         });
		//         if ($rootScope.childId.length > 0) {
		//             $scope.check = true;
		//         }
		//     });
		// }
	});
	$scope.page = 1;
	$scope.data = [];
	$scope.load = function(){
		$http.get(hostName + '?categories=' + id, {
			params:{"page":$scope.page,"per_page":per_page}
		}).then(function(response){
			if(response.data.length == 0) {
				$scope.page = $scope.page -1;
				$scope.over = true;
			}
			angular.forEach(response.data, function(item){
				item.time = new Date(item.date_gmt).getTime();
				$scope.data.push(item);
			});
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page = $scope.page +1;
		});
	};
	$scope.doRefresh = function(){
		$scope.data = [];
		$scope.page = 1;
		$scope.over = false;
		$scope.$broadcast('scroll.refreshComplete');
		$ionicScrollDelegate.$getByHandle('content').scrollBottom();
	};
	$scope.showLoad();
	getData.category().then(function (data) {
		angular.forEach(data, function (item) {
			if (item.parent == id) {
				childId.push(item.id);
				console.log('item.id', item.id);
			}
		});
		if (childId.length > 0) {
			$scope.check = true;
			var idChild = childId.toString();
			$http.get(url + endPointCategory + "?include=" + idChild).then(function (data) {
				$scope.dataCate = data.data;
				idParent = data.data[0].parent;
				$scope.hideLoad();
			});
		}
	});
	// go cate child
	$scope.goCateChild = function (id) {
		$state.go('app.detailsCategory', {
			idCategory: id
		})
	}
	// back
	$scope.back = function () {
		if ($ionicHistory.backView().stateName == 'app.category') {
			if ($scope.c1) {
				$state.go('app.category');
			} else {
				$state.go('app.category');
			}
		} else ($ionicHistory.goBack());
	}
	// update
	$rootScope.$on('update', function (e, data) {
		console.log('data', data);
		if (data.categories[0] == id) {
			$scope.data.unshift(data);
		}
	})
	// back
})
/*-----------------------------BookMark-Ctrl----------------------------*/
.controller('bookMarkCtrl', function ($scope, $http, $localStorage, $state, $stateParams, $ionicTabsDelegate, $timeout, $rootScope) {
	if ($stateParams.type == "photo")
		setTimeout(function () {
			$ionicTabsDelegate.select(1);
		}, 10);
	else if ($stateParams.type == "video")
		setTimeout(function () {
			$ionicTabsDelegate.select(2);
		}, 10);
	// $localStorage.$reset();
	// get bookmark
	$scope.bookNews = [];
	$scope.bookVideo = [];
	$scope.bookImage = [];
	$scope.limitImage = 10;
	$scope.limitNews = 10;
	$scope.limitVideo = 10;
	var select;
	//active
	$scope.$on('$ionicView.enter', function (event, data) {
		$rootScope.activebook = true;
	})
	$scope.$on('$ionicView.leave', function (event, data) {
		$rootScope.activebook = false;
	})
	if ($localStorage.bookMark != undefined) {
		var id = $localStorage.bookMark.toString();
		$scope.showLoad();
		$http.get(hostName, {
			params: {
				'include': id
			}
		}).then(function (res) {
			$scope.data = res.data;
			angular.forEach(res.data, function (item) {
				if (item.format == 'video') {
					$scope.bookVideo.push(item.id);
					$scope.checkVideo = true;
				}
				if (item.format == 'standard') {
					$scope.bookNews.push(item.id);
					$scope.checkNews = true;
				}
				if (item.format == 'image' || item.format == 'gallery') {
					$scope.bookImage.push(item.id);
					$scope.checkImage = true;
				}
			});
			$scope.hideLoad();
		})
	}
	$scope.tmp = [];

	// storage delete
	$scope.bookDelete = function (check, id) {
		if (check == true) {
			$scope.tmp.push(id);
		} else {
			var index = $scope.tmp.indexOf(id);
			$scope.tmp.splice(index, 1);
		}
	}
	// delete book
	var deleteBook = function () {
		for (var i = 0; i < $scope.tmp.length; i++) {
			var tmp1 = [];
			for (var j = 0; j < $localStorage.bookMark.length; j++) {
				if ($scope.tmp[i] != $localStorage.bookMark[j]) {
					tmp1.push($localStorage.bookMark[j]);
				}
			}
			$localStorage.bookMark = tmp1;
		}
		$state.reload();
	}
	$scope.deleteBook = function () {
		$scope.showConfirm(deleteBook);
	}
	// delete news
	$scope.deleteNews = function (id) {

		var deleteNews = function () {
			angular.forEach($localStorage.bookMark, function (item) {
				if (item == id) {
					id = id.toString();
					var index = $localStorage.bookMark.indexOf(id);
					$localStorage.bookMark.splice(index, 1);
				}
			});
			$state.reload();
		}
		$scope.showConfirm(deleteNews);
	}
	// delete all
	$scope.getIndexTab = function () {
		$timeout(function () {
			$scope.select = $ionicTabsDelegate.$getByHandle('tab-bookmark').selectedIndex();
			console.log($scope.select);
		}, 100);
	}
	$scope.clearAll = function () {
		var clearAll = function () {
			if (select == 0) {
				console.log('dan');
				for (var i = 0; i < $scope.bookNews.length; i++) {
					for (var j = 0; j < $localStorage.bookMark.length; j++) {
						if ($localStorage.bookMark[j] == $scope.bookNews[i]) {
							$localStorage.bookMark[j] = $localStorage.bookMark[j].toString();
							var index = $localStorage.bookMark.indexOf($localStorage.bookMark[j]);
							$localStorage.bookMark.splice(index, 1);
						}
					}
				}
			}
			if (select == 1) {
				for (var i = 0; i < $scope.bookImage.length; i++) {
					for (var j = 0; j < $localStorage.bookMark.length; j++) {
						if ($localStorage.bookMark[j] == $scope.bookImage[i]) {
							$localStorage.bookMark[j] = $localStorage.bookMark[j].toString();
							var index = $localStorage.bookMark.indexOf($localStorage.bookMark[j]);
							$localStorage.bookMark.splice(index, 1);
						}
					}
				}
				console.log($localStorage.bookMark);
			}
			if (select == 2) {
				for (var i = 0; i < $scope.bookVideo.length; i++) {
					for (var j = 0; j < $localStorage.bookMark.length; j++) {
						if ($localStorage.bookMark[j] == $scope.bookVideo[i]) {
							$localStorage.bookMark[j] = $localStorage.bookMark[j].toString();
							var index = $localStorage.bookMark.indexOf($localStorage.bookMark[j]);
							$localStorage.bookMark.splice(index, 1);
						}
					}
				}
			}
			$state.reload();
		}
		$scope.showConfirm(clearAll);
	}
	// load-more
	$scope.loadMore = function () {

		$scope.$broadcast('scroll.infiniteScrollComplete');
		if (select == 0) {
			$scope.limitNews += 10;
		}
		if (select == 1) {
			$scope.limitVideo += 10;
		}
		if (select == 2) {
			$scope.limitImage += 10;
		}
	}
})
/*-----------------------------------Login-Ctrl-------------------------------*/
.controller('loginCtrl', function ($scope, $http, $state, $localStorage, $rootScope, $ionicHistory) {
	var tempE = "<p>Sign In Unsucessfully</p>";
	$scope.user = {};
	$scope.logIn = function () {
		$scope.showLoad();
		$http.post(url + 'wp-json/jwt-auth/v1/token', $scope.user, {
			cache: false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			withCredentials: true,
			transformRequest: function (obj) {
				var str = [];
				for (var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
				console.log('str', str);
			}
		}).then(function (res) {
			$localStorage.login = res.data;
			$rootScope.login = res.data;
			$localStorage.user = $scope.user.username;
			$localStorage.token = res.data.token;
			$localStorage.pass = $scope.user.password;
			$rootScope.checkLog = true;
			$scope.hideLoad();
			$ionicHistory.goBack();
		}, function (e) {
			$scope.showErorr(tempE);
			$scope.hideLoad();
		})
	}
})
/*---------------------------------SignUp-Ctrl-------------------------*/
.controller('signupCtrl', function ($scope, $http, $state) {
	var tempE = "<p>Register Unsucessfully</p>";
	var tempS = "<p>Register SucessFully</p>";
	$scope.signUp = {};
	$scope.logUp = function () {
		$scope.showLoad();
		$http.post(url + 'wp-json/mobiconnector/user/register', {
			username: $scope.signUp.username,
			password: $scope.signUp.password,
			email: $scope.signUp.email,
			display_name: $scope.signUp.name
		}, {
			cache: false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			withCredentials: true,
			transformRequest: function (obj) {
				var str = [];
				for (var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		}).then(function (res) {
			$scope.hideLoad();
			console.log(res.data);
			$scope.showSucess(tempS);
		}, function (res) {
			$scope.hideLoad();
			$scope.showErorr(tempE);
		})
	}
}) /*-------------------------------Forgot-Pass--------------------------*/
.controller('forgotPassCtrl', function ($http, $scope) {
	$scope.forGot = {};
	var tempE = "<p>Unable Reset,Please Check Your Email</p>";
	var tempS = "<p>Reset SucessFully,Please Check Your Email</p>";
	$scope.resetPass = function () {
		console.log($scope.forGot.email);
		$scope.showLoad();
		$http.post(url + 'wp-json/mobiconnector/user/forgot_password', {
			username: $scope.forGot.email
		}, {
			cache: false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			withCredentials: true,
			transformRequest: function (obj) {
				var str = [];
				for (var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		})
		.then(function (res) {
			$scope.hideLoad();
			$scope.showSucess(tempS);
		}, function (res) {
			$scope.hideLoad();
			$scope.showErorr(tempE);
		})
	}
})
/*---------------------------------Profile-Ctrl------------------------*/
.controller('profileCtrl', function ($scope, $localStorage, $http, getData, $cordovaCamera) {
	var tempE = "<p>Unable to update. Please try again later.</p>";
	var tempS = "<p>Update SucessFully </p>";
	var base64;
	$scope.user = {};
	// get avata
	document.addEventListener("deviceready", function () {
		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 100,
			targetHeight: 100,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false,
			correctOrientation: true
		};
		$scope.getAvata = function () {
			$cordovaCamera.getPicture(options).then(function (imageData) {
				$scope.avata = "data:image/jpeg;base64," + imageData;
				base64 = "data:image/jpeg;base64," + imageData;
			}, function (err) {
				// error
			});
		}
	}, false);
	// get total bookmark
	if (angular.isDefined($localStorage.bookMark)) {
		$scope.totalBook = $localStorage.bookMark.length;
	}
	// get info user
	console.log(typeof $localStorage.login);
	if (typeof $localStorage.login != 'undefined') {
		getData.userInfo($localStorage.user).then(function (data) {
			$scope.user.name = data.display_name;
			$scope.user.email = data.user_email;
			$scope.avata = data.wp_user_avatar;
			$scope.name = data.display_name;
		})
	}
	// upadate user
	if (typeof $localStorage.login != 'undefined') {
		$scope.update = function () {
			$scope.showLoad();
			getData.updateUser($localStorage.token, $scope.user.email, $scope.user.password, $scope.user.name)
			.then(function (res) {
				console.log(res);
				$scope.hideLoad();
				$scope.showSucess(tempS);
			}, function (res) {
				console.log('res', res);
				$scope.hideLoad();
				$scope.showErorr(tempE);
			});
			if (typeof base64 != 'undefined') {
				getData.updateAvata($localStorage.token, base64);
				console.log('dan');

			}
		}
	}

})
/*-----------------------------Comment-Ctrl-------------------------*/
.controller('commentCtrl', function ($scope, getData, $stateParams, $localStorage, $state) {
	var id = $stateParams.idComment;
	var tempW = "<p>Please Enter Your Text !</p>"
		// get data comment
		$scope.showLoad();
	getData.getComment(id).then(function (data) {
		$scope.data = data;
		$scope.dataLength = data.length;
		$scope.hideLoad();
	});
	// send comment
	$scope.send = function () {
		if (typeof $localStorage.login == 'undefined') {
			$state.go('app.login');
		}
		if ($scope.dataComment == undefined || $scope.dataComment.length == 0) {
			$scope.showErorr(tempW);
		} else {
			getData.sendComment($scope.dataComment, id, $localStorage.token);
		}
	}
})
/*------------------------------Search-Ctrl-------------------------------*/
.controller('searchCtrl', function ($scope, $http, $localStorage, $state, $rootScope) {
	$scope.data1 = [];
	$scope.s = {};
	$scope.noResult = true;
	// get data
	//active
	$scope.$on('$ionicView.enter', function (event, data) {
		$rootScope.activesearch = true;
	})
	$scope.$on('$ionicView.leave', function (event, data) {
		$rootScope.activesearch = false;
	})
	$scope.search = function () {
		if (typeof $scope.s.dataSearch == 'undefined' || $scope.s.dataSearch.length == 0) {
			$scope.require = true;
		} else {
			$scope.over = false;
			$scope.require = false;
			page = 1;
			$scope.showLoad();
			$http.get(hostName, {
				params: {
					'search': $scope.s.dataSearch,
					'page': page,
					'per_page': per_page
				}
			}).then(function (res) {
				$scope.data = res.data;
				$scope.hideLoad();
				page = 2;
				$scope.noResult = false;
			})
		}
	}
	// load-More
	$scope.loadMore = function () {
		$http.get(hostName, {
			params: {
				'search': $scope.s.dataSearch,
				'page': page,
				'per_page': per_page
			}
		}).then(function (res) {
			if (res.data.length == 0) {
				$scope.over = true;
			}
			angular.forEach(res.data, function (item) {
				$scope.data.push(item);
			});
			$scope.$broadcast('scroll.infiniteScrollComplete');
		})
	}
	//     //recent-search

	if (typeof $localStorage.search != 'undefined') {
		$scope.data1 = $localStorage.search;
	} else {
		$scope.data1 = [];
	}
	// save recent search
	$scope.save = function (id, name, format) {
		var check = false;
		if (typeof $localStorage.search == 'undefined') {
			$localStorage.search = [];
		}
		angular.forEach($localStorage.search, function (item) {
			if (item.id == id) {
				check = true;
			}
		});
		if (check == false) {
			var obj = {};
			obj.id = id;
			obj.name = name;
			obj.format = format;
			$localStorage.search.push(obj);

		}
		console.log($localStorage.search);
	}
	// delete recent search
	$scope.delete  = function () {
		delete $localStorage.search;
		$state.reload();
		console.log($localStorage.search);
	}
})
