'use strict';
let isStorage = false; //Variable detect localStorage support default localStorage is not supported
window.localStorage ? isStorage = true : isStorage = false;

let params = {
	lang: 'ru',
	minUser: 1000, //Minimum users on site per day
	maxUser: 1200, //Maximum users on site per day
	minUserOnline: 150, //Minimum users online
	maxUserOnline: 320, //Maximum users online
	leads: +localStorage.getItem("leadsCount") || 123 //Current leads 
}

const DOMbody = document.body;

//Text for Top Plugin
const topPluginText = {
	'ro': ['Număr de vizitatori astăzi', 'Număr de utilizatori online', 'Număr de articole cumpărate astăzi'],
	'ru': ['Количество посетителей сегодня', 'Сейчас на сайте', 'Количество покупок сегодня']
}
const statusBarText = {
	'ro': ['În acest moment, sunt', 'de utilizatori care navighează pe această pagină'],
	'ru': ['На данный момент', 'пользователей просматривают эту страницу']
}
const usersData = {
	'ru': [{'text1':'Вадим Во*** с города', 
			'city':'Москва', 
			'text2':'Упаковок заказано',
			'text3':'На сумму'
			},
			{'text1':'Владимир Ла*** с города', 
			'city':'Волга', 
			'text2':'Упаковок заказано',
			'text3':'На сумму'
			},
			{'text1':'Александр Ка*** с города', 
			'city':'Припять', 
			'text2':'Упаковок заказано',
			'text3':'На сумму'
			}
		],
	'ro': [{'text1':'Ștefan Go*** din',  
			'city':'București', 
			'text2':'Pachetele comandate',
			'text3':'La valoarea'
		}]
}

let usersNum = getAllUsersCount(),
	onlineUsersNum = getOnlineUsers(),
	randomUser = 0,
	boughtNow = 1,
	locationData = '',
	todayLeads = params.leads,
	rndNumArr = [],	//showed users in lead-popup
	userArray = usersData[params.lang],
	leadText1 = usersData[params.lang][randomUser].text1,
	leadText2 = usersData[params.lang][randomUser].text2,
	leadText3 = usersData[params.lang][randomUser].text3;

let getLocation = function(){
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

let city = locationData['city'] || usersData[params.lang][0]['city'];

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
function AddStatusBar(){
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
function getStrLeadInfo(){
	randomUser = function(){
		let rndNum = getRandomInt(0, userArray.length-1);
		while(rndNumArr.includes(rndNum)){
			rndNum = getRandomInt(0, userArray.length-1);
			if (rndNumArr.length == userArray.length) {
				stopTimer(updLead);
				break;
			}
		}
		rndNumArr.push(rndNum);
		console.log(rndNumArr);
		return rndNum;
	}();
	boughtNow = function(){
		return getRandomInt(1, 5)
	}();
	leadText1 = usersData[params.lang][randomUser].text1,
	leadText2 = usersData[params.lang][randomUser].text2,
	leadText3 = usersData[params.lang][randomUser].text3;
	todayLeads += boughtNow;
	if (isStorage) {localStorage.setItem('leadsCount', todayLeads);}
	return leadText1 +' ' + city +'. '+ leadText2 + ': ' + boughtNow +'. '+ leadText3+': ';
};
const leadInfo = document.createElement("div");
function AddLeadInfo(){
	leadInfo.className = "leadInfoPlugin";
	leadInfo.innerHTML = `<p class="leadInfoPlugin__text">${getStrLeadInfo()}</p>`;
	DOMbody.appendChild(leadInfo);
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

closeButton.addEventListener('click', function(){DOMbody.removeChild(statusBar);});

setInterval(function() {usersNum = getAllUsersCount(); updateValue(allUsers, usersNum); }, 15000);
setInterval(function() {onlineUsersNum = getOnlineUsers(); 
						updateValue(onlineUsers, onlineUsersNum); 
						updateValue(onlineUsers2, onlineUsersNum);}, 
						getRandomInt(5000, 10000));
let updLead = setInterval(function() {
						leadInfo.classList.add("active");
						setTimeout(function(){leadInfo.classList.remove("active")}, 7000);
						updateValue(leadText, getStrLeadInfo());
						updateValue(leadsNode, todayLeads);}, 
						getRandomInt(8000, 30000));
function stopTimer(timer){
	clearInterval(timer);
}

