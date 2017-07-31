"use strict";

var DOMbody = document.body;
var minDeviceWidth = 768;
var locationData = [],
	//geolocation data
	city = void 0;
var params = {
	lang: 'ru',
	minUser: 1000, //Minimum users on site per day
	maxUser: 1600, //Maximum users on site per day
	minUserOnline: 150, //Minimum users online
	maxUserOnline: 320, //Maximum users online
	leads: 123 //Current leads
};
//Text for Top Plugin
var topPluginText = {
	'ro': ['Număr de vizitatori astăzi', 'Număr de utilizatori online', 'Număr de articole cumpărate astăzi'],
	'ru': ['Количество посетителей сегодня', 'Сейчас на сайте', 'Количество покупок сегодня']
};
//Text for Status bottom Plugin 
var statusBarText = {
	'ro': ['În acest moment, sunt', 'de utilizatori care navighează pe această pagină'],
	'ru': ['На данный момент', 'пользователей просматривают эту страницу']
};
//Text for Leads Plugin 
var usersData = {
	'ru': [{
		'text1': 'Вадим с города',
		'city': 'Москва',
		'text2': 'Упаковок заказано',
		'text3': 'На сумму'
	}, {
		'text1': 'Владимир с города',
		'city': 'Волга',
		'text2': 'Упаковок заказано',
		'text3': 'На сумму'
	}, {
		'text1': 'Александр с города',
		'city': 'Припять',
		'text2': 'Упаковок заказано',
		'text3': 'На сумму'
	}, {
		'text1': 'Антон с города',
		'city': 'Москва',
		'text2': 'Упаковок заказано',
		'text3': 'На сумму'
	}, {
		'text1': 'Кирилл с города',
		'city': 'Москва',
		'text2': 'Упаковок заказано',
		'text3': 'На сумму'
	}],
	'ro': [{
		'text1': 'Ștefan din',
		'city': 'București',
		'text2': 'Pachetele comandate',
		'text3': 'La valoarea'
	}]
};
//Text for CallBack Plugin
var callBackPluginText = {
	'ro': 'Сomanda',
	'ru': 'Заказать'
};
//Text for PopupForm
var popupText = {
	'ru': {
		'title': 'Нравится ли вам это предложение?',
		'desc': 'Мы будем предоставлять информацию о продукции и лучшие условия, и мы представим специальные предложения!',
		'name': 'Ваше имя',
		'phone': 'Телефон',
		'order': 'Заказать',
		'desc2': 'Оператор позвонит Вам в течение 5-10 минут.'
	},
	'ro': {
		'title': 'ÎȚI PLACE ACEASTĂ OFERTĂ?',
		'desc': 'Îți vom furniza informații despre produs și cele mai bune condiții și îți vom prezenta oferte speciale!',
		'name': 'Nume',
		'phone': 'Telefon',
		'order': 'CONTACTEAZĂ-MĂ TELEFONIC',
		'desc2': 'Operatorul te va contacta telefonic în 5-10 minute.'
	}
};
//Check window width
function isMobile() {
	if (window.innerWidth < minDeviceWidth) {
		return true;
	} else {
		return false;
	}
}
//Check local storage support
function isStorage() {
	if (window.localStorage != undefined) {
		return true;
	} else {
		return false;
	}
}
//Change display property
function displayOnMobile() {
	if (isMobile()) {
		document.getElementsByClassName('topPlugin')[0].style.display = "none";
		document.getElementsByClassName('statusPlugin')[0].style.display = "none";
		document.getElementsByClassName('leadInfoPlugin')[0].style.display = "none";
		document.getElementsByClassName('callBack')[0].style.display = "none";
	} else {
		document.getElementsByClassName('topPlugin')[0].style.display = "block";
		document.getElementsByClassName('statusPlugin')[0].style.display = "block";
		document.getElementsByClassName('leadInfoPlugin')[0].style.display = "block";
		document.getElementsByClassName('callBack')[0].style.display = "block";
	}
}
window.addEventListener("resize", displayOnMobile);

//get geolocation data using IP adress
var getLocation = function() {
	var xmlhttp = new XMLHttpRequest();
	var url = "http://freegeoip.net/json/";
	xmlhttp.open("GET", url, false);
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			locationData = JSON.parse(this.responseText);
			city = locationData['city'];
		}
	};
	try {
		xmlhttp.send();
	} catch (err) {
		city = usersData[params.lang][0]['city'];
	}
}();

var priceNode = document.getElementsByClassName('al-raw-cost-promo')[0];
var currencyNode = document.getElementsByClassName('al-raw-currency')[0];
var priceNode2 = document.getElementsByClassName('al-cost')[0];
var price = void 0,
	currency = void 0;
(function() {
	if (DOMbody.contains(priceNode)) {
		price = parseInt(priceNode.textContent.trim());
		currency = currencyNode.textContent.trim();
	}
	if (DOMbody.contains(priceNode2)) {
		price = parseInt(priceNode2.textContent.trim().split(' ')[0]);
		currency = priceNode2.textContent.trim().split(' ')[1];
	}
})();

if (!isNaN(price) && !isMobile()) {
	(function() {
		var getRandomInt = function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		var getAllUsersCount = function getAllUsersCount() {
			var allUsers = getRandomInt(params.minUser, params.maxUser);
			if (isStorage()) {
				var storageCount = localStorage.getItem("allUsersCount");
				storageCount > allUsers ? allUsers = storageCount : localStorage.setItem("allUsersCount", allUsers);
			}
			return allUsers;
		};

		var getOnlineUsers = function getOnlineUsers() {
			var onlineUsers = getRandomInt(params.minUserOnline, params.maxUserOnline);
			return onlineUsers;
		};

		var updateValue = function updateValue(element, value) {
			element.innerHTML = ' ' + value;
		};
		//Add horizontal top line to page with users/leads status


		var AddTopPlugin = function AddTopPlugin() {
			var topPlugin = document.createElement("div");
			topPlugin.className = "topPlugin";
			var countText1 = topPluginText[params.lang][0],
				countText2 = topPluginText[params.lang][1],
				countText3 = topPluginText[params.lang][2];

			var topPluginInner = '<span class="topPlugin__count">' + countText1 + ':<strong> ' + usersNum + '</strong></span>\n\t\t\t\t<span class="topPlugin__count">' + countText2 + ':<strong> ' + onlineUsersNum + '</strong></span>\n\t\t\t\t<span class="topPlugin__count">' + countText3 + ':<strong> ' + todayLeads + '</strong></span>';

			topPlugin.innerHTML = topPluginInner;
			DOMbody.appendChild(topPlugin);
		};

		var AddStatusBar = function AddStatusBar() {
			var statusBar = document.createElement("div");
			statusBar.className = "statusPlugin";
			var text1 = statusBarText[params.lang][0],
				text2 = statusBarText[params.lang][1];
			var statusBarInner = '<p>' + text1 + ' <strong> ' + onlineUsersNum + '</strong> ' + text2 + '</p>\n\t\t\t<span class="statusPlugin__close"></span>';
			statusBar.innerHTML = statusBarInner;
			DOMbody.appendChild(statusBar);
		};

		var getStrLeadInfo = function getStrLeadInfo() {
			randomUser = function() {
				var rndNum = getRandomInt(0, userArray.length - 1);
				while (rndNumArr.includes(rndNum)) {
					rndNum = getRandomInt(0, userArray.length - 1);
					if (rndNumArr.length == userArray.length) {
						clearInterval(updLead);
						break;
					}
				}
				rndNumArr.push(rndNum);
				return rndNum;
			}();
			boughtNow = function() {
				return getRandomInt(1, 5);
			}();
			evaluateSum = function() {
				return boughtNow * price;
			}();
			leadText1 = usersData[params.lang][randomUser].text1, leadText2 = usersData[params.lang][randomUser].text2, leadText3 = usersData[params.lang][randomUser].text3;
			todayLeads += boughtNow;
			if (isStorage()) {
				localStorage.setItem('leadsCount', todayLeads);
			}
			return leadText1 + ' ' + city + '. ' + leadText2 + ': ' + boughtNow + '. ' + leadText3 + ': ' + evaluateSum + ' ' + currency;
		};

		var AddLeadInfo = function AddLeadInfo() {
			leadInfo.className = "leadInfoPlugin";
			leadInfo.innerHTML = '<p class="leadInfoPlugin__text"></p>';
			DOMbody.appendChild(leadInfo);
		};

		var showLeadInfo = function showLeadInfo() {
			leadInfo.classList.add("active");
		};

		var hideLeadInfo = function hideLeadInfo() {
			setTimeout(function() {
				leadInfo.classList.remove("active");
			}, 7000);
		};

		var addCallBackPlugin = function addCallBackPlugin() {
			var callBackPlugin = document.createElement("div");
			callBackPlugin.className = "callBack";
			callBackPlugin.innerHTML = '<div class="callBack__center"><span>' + callBackPluginText[params.lang] + '</span></div>\n\t\t\t\t\t\t\t\t<div class="callBack__shadow"></div>';
			DOMbody.appendChild(callBackPlugin);
		};

		var addOverlay = function addOverlay() {
			overlay.setAttribute('id', 'overlay-popup-m1');
			DOMbody.appendChild(overlay);
		};

		var addPopupForm = function addPopupForm() {
			addOverlay();
			popupForm.className = "m1modal";
			popupForm.setAttribute('id', 'm1-form');
			popupForm.innerHTML = '<span class="close-m1"></span>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<h2 class="popup-m1-title">' + popupText[params.lang].title + '</h2>\n\t\t\t\t\t\t\t\t\t<div class="popup-m1-cont">\n\t\t\t\t\t\t\t\t\t\t<p class="popup-m1-text1">' + popupText[params.lang].desc + '</p>\n\t\t\t\t\t\t\t\t\t\t<form method="POST" action="/land/order" class="popup-m1-form al-form">\n\t\t\t\t\t\t\t\t\t\t\t<select class="al-country" style="display: none;"></select>\n\t\t\t\t\t\t\t\t\t\t\t<input type="text" name="name" placeholder="' + popupText[params.lang].name + '" required="">\n\t\t\t\t\t\t\t\t\t\t\t<input type="text" name="phone" placeholder="' + popupText[params.lang].phone + '" required="">\n\t\t\t\t\t\t\t\t\t\t\t<button type="submit">' + popupText[params.lang].order + '</button>\n\t\t\t\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t\t\t\t\t<p class="popup-m1-text2">' + popupText[params.lang].desc2 + '</p>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>';
			DOMbody.appendChild(popupForm);
		};

		var showPopupForm = function showPopupForm() {
			overlay.classList.add('js-show');
			popupForm.classList.add('js-show');
		};

		var hidePopupForm = function hidePopupForm() {
			overlay.classList.remove('js-show');
			popupForm.classList.remove('js-show');
		};

		var animateCallBack = function animateCallBack(flag) {
			if (flag) {
				spinnerTimer = setInterval(function() {
					callBack.classList.toggle('spinner');
					callBackCenter.classList.toggle('bg-img-none');
					callBackText.classList.toggle('text-hide');
				}, 5000);
			} else {
				clearInterval(spinnerTimer);
			}
		};

		var usersNum = getAllUsersCount(),
			//Users on site during a day
			onlineUsersNum = getOnlineUsers(),
			//Online users
			randomUser = 0,
			//user in Lead plugin
			boughtNow = 1,
			//user bought {boughtNow} items
			evaluateSum = price,
			todayLeads = params.leads,
			//leads
			rndNumArr = [],
			//showed users in lead-popup
			userArray = usersData[params.lang],
			//info from common array about some random user
			leadText1 = usersData[params.lang][randomUser].text1,
			leadText2 = usersData[params.lang][randomUser].text2,
			leadText3 = usersData[params.lang][randomUser].text3;
		if (isStorage() && localStorage.getItem("leadsCount")) {
			todayLeads = parseInt(localStorage.getItem("leadsCount"));
		}

		;
		// lead popup wrapper
		var leadInfo = document.createElement("div");

		var overlay = document.createElement("div");

		var popupForm = document.createElement("div");

		AddTopPlugin();
		AddStatusBar();
		AddLeadInfo();
		addCallBackPlugin();
		addPopupForm();

		var allUsers = document.querySelector('.topPlugin__count:first-child strong'),
			onlineUsers = document.querySelector('.topPlugin__count:nth-child(2) strong'),
			leadsNode = document.querySelector('.topPlugin__count:last-child strong'),
			onlineUsers2 = document.querySelector('.statusPlugin strong'),
			leads = document.querySelector('.topPlugin__count:last-child strong'),
			statusBar = document.querySelector('.statusPlugin'),
			closeButton = document.querySelector('.statusPlugin__close'),
			leadText = document.querySelector('.leadInfoPlugin__text'),
			closePopupBtn = document.querySelector('.close-m1');

		setInterval(function() {
			usersNum = getAllUsersCount();
			updateValue(allUsers, usersNum);
		}, 15000);

		setInterval(function() {
			onlineUsersNum = getOnlineUsers();
			updateValue(onlineUsers, onlineUsersNum);
			updateValue(onlineUsers2, onlineUsersNum);
		}, getRandomInt(5000, 10000));

		var updLead = setInterval(function() {
			showLeadInfo();
			hideLeadInfo();
			updateValue(leadText, getStrLeadInfo());
			updateValue(leadsNode, todayLeads);
		}, getRandomInt(14000, 30000));

		closeButton.addEventListener('click', function() {
			DOMbody.removeChild(statusBar);
		});

		var callBack = document.getElementsByClassName('callBack')[0];
		var callBackCenter = document.getElementsByClassName('callBack__center')[0];
		var callBackText = document.querySelector('.callBack__center span');

		var spinnerTimer = void 0;


		animateCallBack(true);
		callBack.addEventListener('mouseover', function() {
			animateCallBack(false);
		});
		callBack.addEventListener('mouseleave', function() {
			animateCallBack(true);
		});
		callBackCenter.addEventListener('click', showPopupForm);
		closePopupBtn.addEventListener('click', hidePopupForm);
		overlay.addEventListener('click', hidePopupForm);

		window.addEventListener('mouseout', function(event) {
			var comebacker = true;
			if (event.pageY - window.scrollY < 1 && comebacker) {
				comebacker = false;
				showPopupForm();
				return false;
			}
		});
	})();
}