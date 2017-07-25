let isStorage = false; //Variable detect localStorage support default localStorage is not supported
window.localStorage ? isStorage = true : isStorage = false;

let params = JSON.parse(localStorage.getItem("parameters")) || {
	lang: 'ro',
	minUser: 1000, //Minimum users on site per day
	maxUser: 1200, //Maximum users on site per day
	minUserOnline: 150, //Minimum users online
	maxUserOnline: 320, //Maximum users online
	leads: 123 //Current leads 
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

let usersNum = getAllUsersCount();
let onlineUsersNum = getOnlineUsers();

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
				<span class="topPlugin__count">${countText3}:<strong> ${params.leads}</strong></span>`;

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
function AddLeadInfo(){
	const leadInfo = document.createElement("div");
	leadInfo.className = "leadInfoPlugin";
}

AddTopPlugin();
AddStatusBar();

const allUsers = document.querySelector('.topPlugin__count:first-child strong');
const onlineUsers = document.querySelector('.topPlugin__count:nth-child(2) strong');
const onlineUsers2 = document.querySelector('.statusPlugin strong');
const leads = document.querySelector('.topPlugin__count:last-child strong');
const statusBar = document.querySelector('.statusPlugin');
const closeButton = document.querySelector('.statusPlugin__close');

closeButton.addEventListener('click', function(){DOMbody.removeChild(statusBar);});


setInterval(function() {usersNum = getAllUsersCount(); updateValue(allUsers, usersNum); }, 15000);
setInterval(function() {onlineUsersNum = getOnlineUsers(); 
						updateValue(onlineUsers, onlineUsersNum); 
						updateValue(onlineUsers2, onlineUsersNum);}, 
						getRandomInt(5000, 10000));