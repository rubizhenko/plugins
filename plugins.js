"use strict";
const DOMbody = document.body;
const minDeviceWidth = 768;

const priceNode = document.getElementsByClassName('al-raw-cost-promo')[0];
const currencyNode = document.getElementsByClassName('al-raw-currency')[0];
const priceNode2 = document.getElementsByClassName('al-cost')[0];
let price, currency;

function isMobile(){
	if (window.innerWidth < minDeviceWidth) {
		return true;
	} else{
		return false;
	}
}
function hideOnMobile(){
	if (isMobile()) {
		document.getElementsByClassName('topPlugin')[0].style.display = "none";
		document.getElementsByClassName('statusPlugin')[0].style.display = "none";
		document.getElementsByClassName('leadInfoPlugin')[0].style.display = "none";
	} else {
		document.getElementsByClassName('topPlugin')[0].style.display = "block";
		document.getElementsByClassName('statusPlugin')[0].style.display = "block";
		document.getElementsByClassName('leadInfoPlugin')[0].style.display = "block";
	}
}

window.addEventListener("resize", hideOnMobile)

if (DOMbody.contains(priceNode)) {
	price = parseInt(priceNode.textContent.trim());
	currency = currencyNode.textContent.trim();
}
if (DOMbody.contains(priceNode2)) {
	price = parseInt(priceNode2.textContent.trim().split(' ')[0]);
	currency = (priceNode2.textContent).trim().split(' ')[1];
}
if (!isNaN(price) && !isMobile()) {
	let isStorage = false; //Variable detect localStorage support default localStorage is not supported
	window.localStorage != undefined ? isStorage = true : isStorage = false;

	let params = {
		lang: 'ru',
		minUser: 1000, //Minimum users on site per day
		maxUser: 1600, //Maximum users on site per day
		minUserOnline: 150, //Minimum users online
		maxUserOnline: 320, //Maximum users online
		leads: +localStorage.getItem("leadsCount") || 123 //Current leads 
	}
	//Text for Top Plugin
	const topPluginText = {
		'ro': ['Număr de vizitatori astăzi', 'Număr de utilizatori online', 'Număr de articole cumpărate astăzi'],
		'ru': ['Количество посетителей сегодня', 'Сейчас на сайте', 'Количество покупок сегодня']
	}
	//Text for Status bottom Plugin 
	const statusBarText = {
		'ro': ['În acest moment, sunt', 'de utilizatori care navighează pe această pagină'],
		'ru': ['На данный момент', 'пользователей просматривают эту страницу']
	}
	//Text for Leads Plugin 
	const usersData = {
		'ru': [{
				'text1': 'Вадим с города',
				'city': 'Москва',
				'text2': 'Упаковок заказано',
				'text3': 'На сумму'
			},
			{
				'text1': 'Владимир с города',
				'city': 'Волга',
				'text2': 'Упаковок заказано',
				'text3': 'На сумму'
			},
			{
				'text1': 'Александр с города',
				'city': 'Припять',
				'text2': 'Упаковок заказано',
				'text3': 'На сумму'
			},
			{
				'text1': 'Антон с города',
				'city': 'Москва',
				'text2': 'Упаковок заказано',
				'text3': 'На сумму'
			},
			{
				'text1': 'Кирилл с города',
				'city': 'Москва',
				'text2': 'Упаковок заказано',
				'text3': 'На сумму'
			}
		],
		'ro': [{
			'text1': 'Ștefan din',
			'city': 'București',
			'text2': 'Pachetele comandate',
			'text3': 'La valoarea'
		}]
	}

	let usersNum = getAllUsersCount(), //Users on site during a day
		onlineUsersNum = getOnlineUsers(), //Online users
		randomUser = 0, //user in Lead plugin
		boughtNow = 1, //user bought {boughtNow} items
		evaluateSum = price,
		locationData = [], //geolocation data
		todayLeads = params.leads, //leads
		rndNumArr = [], //showed users in lead-popup
		userArray = usersData[params.lang], //info from common array about some random user
		leadText1 = usersData[params.lang][randomUser].text1,
		leadText2 = usersData[params.lang][randomUser].text2,
		leadText3 = usersData[params.lang][randomUser].text3;

	//get geolocation data using IP adress
	let getLocation = function() {
		let xmlhttp = new XMLHttpRequest();
		let url = "http://freegeoip.net/json/";
		xmlhttp.open("GET", url, false);
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				locationData = JSON.parse(this.responseText);
			}
		};
		xmlhttp.send();
	}();

	let city = locationData['city'] || usersData[params.lang][randomUser]['city'];

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getAllUsersCount() {
		let allUsers = getRandomInt(params.minUser, params.maxUser);
		if (isStorage) {
			let storageCount = localStorage.getItem("allUsersCount");
			storageCount > allUsers ? allUsers = storageCount : localStorage.setItem("allUsersCount", allUsers);
		}
		return allUsers;
	}

	function getOnlineUsers() {
		let onlineUsers = getRandomInt(params.minUserOnline, params.maxUserOnline);
		return onlineUsers;
	}

	function updateValue(element, value) {
		element.innerHTML = ' ' + value;
	}
	//Add horizontal top line to page with users/leads status
	function AddTopPlugin() {
		const topPlugin = document.createElement("div");
		topPlugin.className = "topPlugin";
		const countText1 = topPluginText[params.lang][0],
			countText2 = topPluginText[params.lang][1],
			countText3 = topPluginText[params.lang][2];

		let topPluginInner =
			`<span class="topPlugin__count">${countText1}:<strong> ${usersNum}</strong></span>
				<span class="topPlugin__count">${countText2}:<strong> ${onlineUsersNum}</strong></span>
				<span class="topPlugin__count">${countText3}:<strong> ${todayLeads}</strong></span>`;

		topPlugin.innerHTML = topPluginInner;
		DOMbody.appendChild(topPlugin);
	}

	function AddStatusBar() {
		const statusBar = document.createElement("div");
		statusBar.className = "statusPlugin";
		const text1 = statusBarText[params.lang][0],
			text2 = statusBarText[params.lang][1];
		let statusBarInner =
			`<p>${text1} <strong> ${onlineUsersNum}</strong> ${text2}</p>
			<span class="statusPlugin__close"></span>`;
		statusBar.innerHTML = statusBarInner;
		DOMbody.appendChild(statusBar);
	}

	function getStrLeadInfo() {
		randomUser = function() {
			let rndNum = getRandomInt(0, userArray.length - 1);
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
			return getRandomInt(1, 5)
		}();
		evaluateSum = function() {
			return boughtNow*price;
		}();
		leadText1 = usersData[params.lang][randomUser].text1,
			leadText2 = usersData[params.lang][randomUser].text2,
			leadText3 = usersData[params.lang][randomUser].text3;
		todayLeads += boughtNow;
		if (isStorage) { localStorage.setItem('leadsCount', todayLeads); }
		return leadText1 + ' ' + city + '. ' + leadText2 + ': ' + boughtNow + '. ' + leadText3 + ': '+evaluateSum+' '+currency;
	};
	const leadInfo = document.createElement("div");

	function AddLeadInfo() {
		leadInfo.className = "leadInfoPlugin";
		leadInfo.innerHTML = `<p class="leadInfoPlugin__text"></p>`;
		DOMbody.appendChild(leadInfo);
	}

	function showLeadInfo() {
		leadInfo.classList.add("active");
	}

	function hideLeadInfo() {
		setTimeout(function() { leadInfo.classList.remove("active") }, 7000);
	}

	function addCallBackPlugin(){
		const callBackPlugin = document.createElement("div");
		callBackPlugin.className = "callBack";
		leadInfo.innerHTML = `<div class="callBack__center"><span>Заказать</span></div>
        						<div class="callBack__shadow"></div>`;
	}

	AddTopPlugin();
	AddStatusBar();
	AddLeadInfo();

	const allUsers = document.querySelector('.topPlugin__count:first-child strong'),
		onlineUsers = document.querySelector('.topPlugin__count:nth-child(2) strong'),
		leadsNode = document.querySelector('.topPlugin__count:last-child strong'),
		onlineUsers2 = document.querySelector('.statusPlugin strong'),
		leads = document.querySelector('.topPlugin__count:last-child strong'),
		statusBar = document.querySelector('.statusPlugin'),
		closeButton = document.querySelector('.statusPlugin__close'),
		leadText = document.querySelector('.leadInfoPlugin__text');

	setInterval(function() {
		usersNum = getAllUsersCount();
		updateValue(allUsers, usersNum);
	}, 15000);

	setInterval(function() {
		onlineUsersNum = getOnlineUsers();
		updateValue(onlineUsers, onlineUsersNum);
		updateValue(onlineUsers2, onlineUsersNum);
	}, getRandomInt(5000, 10000));

	let updLead = setInterval(function() {
		showLeadInfo();
		hideLeadInfo();
		updateValue(leadText, getStrLeadInfo());
		updateValue(leadsNode, todayLeads);
	}, getRandomInt(14000, 30000));

	closeButton.addEventListener('click', function() { DOMbody.removeChild(statusBar); });
}

const callBack = document.getElementsByClassName('callBack')[0];
const callBackCenter = document.getElementsByClassName('callBack__center')[0];
const callBackText = document.querySelector('.callBack__center span');
let spinnerTimer;
function animateCallBack(flag){
	if (flag) {
		spinnerTimer = setInterval(function(){callBack.classList.toggle('spinner'); 
											callBackCenter.classList.toggle('bg-img-none'); 
											callBackText.classList.toggle('text-hide')}, 5000);
	} else {clearInterval(spinnerTimer);}
}
animateCallBack(true);
callBack.addEventListener('mouseover', function(){animateCallBack(false)});
callBack.addEventListener('mouseleave', function(){animateCallBack(true)});
