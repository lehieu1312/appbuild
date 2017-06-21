angular.module('myTranslate',['pascalprecht.translate'])
.config(function($translateProvider){
	$translateProvider.translations('en',{
		latest :'LATEST',
		feature :'FEATURE',
		video :'VIDEO',
		photos :'PHOTOS',
		dayago:'days ago',
		bookmark :'BookMark',
		bookmarks :'BookMarks',
		BOOKMARKS :'BOOKMARKS',
		NEWS :'NEWS',
		PHOTOS :'PHOTOS',
		VIDEO :'VIDEO',
		clearAll :'Clear All',
		comments :'Comments',
		resetPassword :'RESET PASSWORD',
		username :'Username',
		email :'Email',
		password :'Password',
		signUp :'SIGN UP',
		signIn :'SIGN IN',
		searchRecent :'RECENT SEARCH',
		textsize :'Text Size',
		pushnotification:'Push Notification',
		share :'Share',
		help :'Help',
		logout:'Log Out',
		login :'Log In',
		category:'Categories',
		all:'All',
		enterYourComment:'Enter Your Comment....',
		search :'Search',
		for:'for',
		noresult :'No Result Availbles',
		keywordIsRequired :'Keyword is required',
		news :'News',
		remove :'Remove',
		addcomment :'ADD A COMMENT',
		relatedStories :'Related Stories',
		save :'Save',
		loading :'Loading....',
		small :'Small',
		normal :'Normal',
		large :'Large',
		extra :'Extra',
		sureDelete :'Are You sure delete',
		profile :'Profile',
		fullname :'Full Name',
		change :'change',
		forgot:'Forgot',
		sucess :'Sucessfully',
		removed :'Removed',
		by :'By',
		thisArticle :'THIS ARTICLE HAS',
		comment :'COMMENT',
		forgotPassword :'Forgot Password',
		signup :'Sign Up',
		signin :'Sign In',
		forgot :'forgot',
		disconnected: "Network disconnected",
		home:"Home",
		version:"Version",
		privacy:"Privacy policy",
		about:"About Us",
		term:"Term And Conditions",
		informations:"Informations",
		shareApp:"Share App",
		rateApp:"Rate App",
		setting:"Setting",
		settings:"Settings",
		pull:"Pull to refresh...",
		seeMore:"See More"
	});
	$translateProvider.useSanitizeValueStrategy('escapeParameters');
	$translateProvider.preferredLanguage("en");
	$translateProvider.fallbackLanguage("en");
});