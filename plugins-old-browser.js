"use strict";

var DOMbody = document.body;
var minDeviceWidth = 768;
var locationData = [],
    //geolocation data
city = void 0;
var params = {
	lang: 'ro',
	minUser: 1000, //Minimum users on site per day
	maxUser: 1600, //Maximum users on site per day
	minUserOnline: 150, //Minimum users online
	maxUserOnline: 200, //Maximum users online
	leads: 123 //Current leads
};
var customCSS = {
	callBackDiam: 150,
	callBackFontSize: 14,
	topPluginHeight: 34
};
var styles = document.createElement("style");

styles.innerHTML = "\
body {\
	margin: 0;\
	/*Padding equals top plugin height*/\
	padding-top: 34px;\
	-webkit-background-size: cover;\
	background-size: cover;\
	background-repeat: no-repeat;\
	\
}\
*{\
	-webkit-box-sizing: border-box;\
	-moz-box-sizing: border-box;\
	box-sizing: border-box;\
}\
\
.topPlugin {\
	font-family: Arial, Helvetica, sans-serif;\
	font-size: 16px;\
	text-align: center;\
	position: fixed;\
	top: 0;\
	left: 0;\
	right: 0;\
	z-index: 1000;\
	padding: 3px;\
	background-color: #f1edee;\
}\
\
.topPlugin__count {\
	margin-right: 30px;\
	padding-left: 35px;\
	position: relative;\
	line-height: 28px;\
	display: inline-block;\
}\
\
.topPlugin__count:last-child {\
	margin-right: 0;\
}\
\
.topPlugin__count:first-child::before,\
.topPlugin__count:nth-child(2)::before,\
.topPlugin__count:last-child::before {\
	content: \"\";\
	position: absolute;\
	left: 0;\
	background-repeat: no-repeat;\
	-webkit-background-size: contain;\
	background-size: contain;\
	background-position: center left;\
	display: inline-block;\
	font-size: 0;\
	width: 28px;\
	height: 28px;\
	opacity: .7;\
}\
\
.topPlugin__count:first-child::before {\
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKnSURBVFiFxddRaJZlFAfw32ObEt7MtlooOS1ZXhSLCgK1WEMQHMS6sAuvggleTbytC2+8DAK7WAR10ZYasSvDihCZ6I0ahVGwDUQxJoNpMKRdbLjHi/f9xreP93ved1/RDpyL7zvn/M95zvM/z/O8IcZoI2XThmZHWzNDCKEXb+U/r8cYZ9YDXDk+xrhG0YExxAYdQ0ejf0H8NoxXjS8CuFgQXNOLFQr4cT3xjcGDieCaDiaSD603vpGE75TvbtLn7fXGN5Lw2QoAT0MIYX+esBu/4ntcx2M8lYhfm6OhhSPS7buGLpwtsM3iID7AcgJjJMWBbjxsEriCHnyeAF/ATnzbxP4A3WVTMIR/CoIn8WJeSKpLX+C9gv8fKSBwMzbvwVf4DVfxUZ78aEnyiN+xGZ/hZo7xJV4qyrWGhCGEvTiMN7E9bykcwryMYGWyRUbuV/NO1hZ0OoTwC36IMU6teucrbscpLCVW9hNeqdCBb9CfsC/ludpXtwCjFYAXZMfshRLw1/BJBbzR2k08oJxYNf0Oz8vmvdG2iGHZBZQaw/qpGmjDMQTlsizb00fYhw+tPYi+jjHOhBDexz0ZaVMS8tymK1T7B3ajD5/iCu5jrk6ncA7HZUT8uALuNOXtv4XnlJO0Xm/gZeUn64oKDm/gZMXE9XobW/FziV/SOCHby8UWCog4IztTWi5gGCdaTB4xl4/afDOfskfpn/kWtCrdIYSeHKdQ2nAEr8sY3ocddfY52e32b2RXjlMvi7iE8bYY44Rsr0EIoauumAXVzoiUBNlj5aps7GbwV6wdgxUemZNa50BEfwp/wz9M/o8CYsoYyr4NQwgv4F0cyHWvNC+WZXfBZZzHZEwkKS2goKBO9KIz12fwN+7gLmZjjFUeLq0V8F/LhpPwCSi32DUjllCvAAAAAElFTkSuQmCC);\
}\
\
.topPlugin__count:nth-child(2)::before {\
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIlSURBVFiF7ZfPS1VBFMc/x6wMy1wFhcTLwkVkkAihkIFB0OIp5L5d/4F/QIuCFq1aFhThpjaVO6GV1qIoioIiELIf7nIREYlgfFvMUBeZmTdv3nu06QuHy51zOOdzz52ZO9ckEZKZ3QCOSRoPBrRJXQnfE+CEmY12EsASHegDHgCTwBrwCfgIrAAf/PWppG8dAfAQ3cA0cBgY9FYDDgI7PURd0tuOACTAzIPMA8uSZkoBUnMgKjmtALeBCQ9UJknZBmwHLgCXKvf9Ff9dYKKZnNkdMLNTuHd+B+j1w5vAgUrYCLBoZo/NbF/bOgBMAeuAvF3149c9xFl//74SswwcarkDZjYO3Ad6Au46sA04F/AdAZbMrDfg+6OcV3DNF9kK1o1bjuCWaUgDwGwxgJmdB8ZCPkmbuDYDvEukmU3Nh0YdqDfwzwE/cDtmTLuB06UAw5HxXQCSrgA1Sc+q4wEdjVZIzPwu4Cd/Z3XV3gTiByOxAu6VrIIdiScaNrOhLWOp7XhvSQd6Ek8k3BdyCrdCLgO/ErEL0TotAAi38dQy4qIARR+jduo/QKsA5q0jADlHpSHgYUZcNFcUQNIG8DUj+fGMmNWmAbxeZCTP0at/DfCyFOBRG4qvAa+j3ozj2C0a73Qpm0nmzwDoAz4XFp9rmD/zUHoS92vWTPEFKkf2lgA8xB7gZkbh78DF3LxN/5qZ2RhwBhj1th/3VXyOWzXzkr7k5vsN04+ax7jHRGkAAAAASUVORK5CYII=);\
}\
\
.topPlugin__count:last-child::before {\
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMZSURBVFiFvZZLSFZBFMd/x0eJRUkhCOZCiB6kkb1RylpEi9pYkKEtWgTVymjRAwIX5j5oE0QE4aaIcBGlZJDRoqSsSEIieklmL7DwVUqnxZzLN17vdz9fnweGmfnPmZkz/znnzIiqIiI5jJcxVR1jDiRDRO4Aw6HyW0SOzIUBAnQCZRFjvapaOBcGZAHLPGwB8BLIBMpU9UVaLVDVCQV4BChwNmp8NksyA86ZAW+B+8AAMDJLZRh4A9QDmckM2GgGpLs0im04TkREgK9APvDJGBkF9gK1wE8gHCVXgTzgEtDq4RtsPkCNMXAI2A/0Jb8baDIr2z1sl2f90pB+n+HHQvhpwz942FHDvmRMOH5CWqwuF5HF1n4C/LP21pi5vmy2usPDdlj9PPIKAEQkH3cNMsmNpiNnkjKgqt+BZ2ncHKA9K4VCCy4iBnGOA1AJnADGgGoSVxLlhNuAk7j7rsY58h6cAw8CT+OTBFSQcLoSw9Z6WGmcEwKNhr2OcO5WVSUVA4+BfjvZYRG5iUvRo0A2cEBEFphuttXFIhI4aKXVPR620+p2IDoThli4wcwTTlSpUFXiwjCQltQqU5YhgrCcBAOFntW1uOs46GGrgALgm/VPWb/O+n+BIsNuGdYWrJ+SAVX9DLyy7hZV7cc9UIEUqWofiWj4bf0V1n+pqj24nBIkpfZgcionRESygV6gFDguInk4CkeAHKBeRPYDi2xKjYisw70bAAtF5AKwhgSbt/0TxtG/1k4/m8530d8jFQMNQAku6XTgwm+68gMXUc3j0JjT5wF/zOp96foRxTlhFjDP2ktmcPJYSfoaAojIQ1w+B3iPY2Qqojbvmqpej9aId8JioIvZcb7ID24sA8bCfNwHohkXdt3AXdyvJhf3ZDd5U7YDVda+DKw0bBTIV9Vfk2bAYyLXO0lV6FW7F9JtMLzLYzGYWx5eO2UiMiOHRKQTWA/U2W9ptw13h9SDr9dqETkJrPPG3kUtPlkWqpl4rwPA8gjdzgjdK5HrTsEAwf1m2oBfwANgUxLdAuA8Lv9/xH1McqblhOmW/9rdk6bCYQ5uAAAAAElFTkSuQmCC);\
}\
/*StatusBar plugin styles*/\
\
.statusPlugin {\
	position: fixed;\
	bottom: 10px;\
	left: 10px;\
	width: 290px;\
	min-height: 75px;\
	padding: 10px 20px 10px 60px;\
	background: #ffffea url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkNWMzY2Y2Ni0yNDUyLWFhNDItOWEwZi04ZWM3ZDAzMzg5ZDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzAzRkY2QTM3MTM5MTFFN0JEQzdBMkEwMTNFNUJBOEMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzAzRkY2QTI3MTM5MTFFN0JEQzdBMkEwMTNFNUJBOEMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZDVjM2NmNjYtMjQ1Mi1hYTQyLTlhMGYtOGVjN2QwMzM4OWQ1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmQ1YzNjZjY2LTI0NTItYWE0Mi05YTBmLThlYzdkMDMzODlkNSIv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\");\
	background-position: 5px center;\
	background-repeat: no-repeat;\
	display: table;\
	-webkit-border-radius: 5px;\
	-moz-border-radius: 5px;\
	border-radius: 5px;\
	border: 1px solid #E9E9C5;\
	z-index: 1000;\
}\
\
.statusPlugin p {\
	font-family: Arial, Helvetica, sans-serif;\
	font-size: 14px;\
	display: table-cell;\
	vertical-align: middle;\
}\
\
.statusPlugin__close {\
	position: absolute;\
	top: 5px;\
	right: 5px;\
	display: inline-block;\
	width: 20px;\
	height: 20px;\
	background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjBDNDE2NjkwNkE1MTFFM0JFQTZGRTA2OTlBNjlBMjAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjBDNDE2NkEwNkE1MTFFM0JFQTZGRTA2OTlBNjlBMjAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGMEM0MTY2NzA2QTUxMUUzQkVBNkZFMDY5OUE2OUEyMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGMEM0MTY2ODA2QTUxMUUzQkVBNkZFMDY5OUE2OUEyMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq/Cl0oAAAa+SURBVHjaxFoJbBVVFJ0OlEJpBQsFkdYNLIIolVAXlhItKhiJBNG4EDG2KuJSoEbrgnVDghhNVDYNURMDihFcsK5VjAQiQlktNIoCYkWkWrRUKKX13HK+GZ73/T8z/zfe5OS38+e9ufe9u5x35ye1tLQ4IgUFBU4C5AQgFUgGOgB9gDrgN+Aw0AjUA4fMgRUVFaEe2D4BSvcFzgbOB4YBZwAZQGfjvv3APqAK+BLYBGyhgaElrAGyupOAfCAP6OdjTHdiADCBO7Ia2AyUA5+EUSQphAvdBEwFznMSJweAlcBsuNKatjJAVvsJukk7p23kIPAk8DIMqU2UAelc9ZlAlxjzfQ/8QkUEOzmmGz/TGSPdYswju3A3jFgfrwGZwHzg6ihzbAU+BzbywT/Sv//zLKArMJABPxQYA3SyzLsHuANGrAhrQE9gCXCxZewGYB7wMfBTCHcRxXOAQmAyU68pf9KIxUENkK1eCoxWxjSIj9JX9yfA72VncrkYF1oC/BYYsUwb7FomnGFRXnz6Omah/QkK3Bbu5ljgdeV7iZ3nsMB5fg24CrhLuS6FZxzwflukH6ywLMitwP3AUePrU2TXYUR2LAP6AwuUwJJAnUgjzN2KV9p5jDgEPI0/H1DuGwTMiWXALAavV34FbqcRXklmTegVJ3e6lNTDK88Cryn3j8cu5NsMGAmMUgY9w5JvUhBxtbnAIlKEoJLJBZPgLYZinT07IS40nWnZXLRS3OtqBkxRCNjbwAvGtVTGQhlwLnO5uN1JAVd+Bp95uhQtoASKdfUY8Ts+bmPW88oI4PLjDMDAASwsXvlbrFWK0gWSFViQIiKF7nmghw/lewOPUrmInAg8JOnSCOytLKReSfMW1sgOXAZkGTe+Smqg5WWNp1wDvBjDnToC9wH3ACnGdz8D25Uxi/hMr4zEovdpNQB/dOS2eEUOHG9ZlKgEipSMFDFivsWIHoynmxUyuEt8Hiteroz7jkXVPIMMiuxAllIBv2Zxsck6brd2zwQlJtKZ3++k/3tlGzAN+MBSH5rw8SlPc8e5sgSzyyA62fhys4+TUmQnNMYYiYnuTMszqbxW2R8ElkPRIzGetdO4Joue1p7FyyztVT6zSSWDUbjRYMWdZIF2W8iaHCcfBt7z8ZwfyE5zPNckiaS5xsVIkO4IkBIrSQE2WXZCU16Metyn8uJGLSyoXpHil+Eq7tMQgqhVMiY2WmizV7YzC70b8BkaZc92leLVqBQPv0ZMsuyEN1VOo/JHAs5frxVEV9neZqApJLepimGA9Ie+CTm3ZnCyy4pr8o2OIbmNkLDxUe7JIfcJw53SlGt/tVeqaoqPw7ujBNR0cptoHQvhUdfyHjlz7A24QKbsdRW6IIQqO8DEsppP0be1CrshSp3oEeA5ZrI5HDGgWum69fU5aSq5zUSF21QxhU62FDs/3ClyXs9Q2K4UtgaXac2Mg4E+2o6ZPCEVK5lsJ/P8R8BaFrug3Mkr5zjHGsUm3akTA2qUbb5EqdAmMSshleig5Hnx7zeVOmHlTljlnlGeN4KU2yurhX64DOI1ioKjLJOdRm4zTVFefP4xCzGLxZ3makbQfcYotaqVeruwoplHRrMTUGwJMjHgBkX5amahN3xwp0qLEYXK9dHKYWtlZCEiB5oK+pRXTjVPSJSNipJCth6hz4flTh8Cnxmr34W0wytSZFdg4ev/NQD/HOAJzKx29wJnGtfqOOlC/r+DZ9qlrOJhuJP0Vougx1rjvlIeYb0ivdfFWmsxha40WNmuccqxLpUnrFXsobaEqK4X0W3mQPlqY/Xl4L6Mz/FS/Sm4d4GtNzrWQnGX8CjYqPSVmp34pHUO7zsy6JLLHTV3fx3uy4vW2Cq3GHA9e0CpCvGLV5qNlZca9IrFdafH6swdpT9vUR5UxIkznDYSKD+UzYRc5esyrP5Xfpq7u+mXu5TvhIgtB85KsO4pUL40ytzvKP0hqwEOObv0Q/cp3+UzcMsUghVUhLoPYAdwlqXufCG62A79sV4xFbDJ2tuiQA1bj2vY/K31qXh/Kn4lT3G2LrfEZCGUt9JuPy/5hnD7hkRRqIlGrGefZy8P4fUkhRlsr8iOyevZYWzn2ESy3WxpYUL5P6KthN/XrL2YAaY6/l6OH6TyjXTTTjxRdfAxVs4nJVDcV8ci6IvuK9jLGeLoL+XikVp29OZB+Rq/g5JC/thDitqNTHfd41T8W+fYbycWQvHNQQcnxflrleGkHsMJv29rNjC7yKfk9l3/169VVhEvkb3Ky7h+/MxiI7eJAb2HJ7VtzF41ifC7fwQYAAE8BAErTV8WAAAAAElFTkSuQmCC\");\
	background-repeat: no-repeat;\
	-webkit-background-size: contain;\
	background-size: contain;\
	opacity: .4;\
	cursor: pointer;\
}\
\
.statusPlugin__close:hover {\
	opacity: .7;\
}\
/*END: StatusBar plugin styles*/\
/*LeadsPlugin styles*/\
\
.leadInfoPlugin {\
	position: fixed;\
	top: 120px;\
	right: 10px;\
	width: 290px;\
	min-height: 100px;\
	padding: 10px 10px 10px 70px;\
	background-color: rgba(0, 0, 0, 0.7);\
	background-image: url(\"data:image/png;base64,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\");\
	background-repeat: no-repeat;\
	background-position: 10px center;\
	display: table;\
	-webkit-border-radius: 10px;\
	-moz-border-radius: 10px;\
	border-radius: 10px;\
	border: 1px solid #E9E9C5;\
	z-index: 1000;\
	color: #fff;\
	-webkit-transform: translateX(105%);\
	-moz-transform: translateX(105%);\
	-ms-transform: translateX(105%);\
	transform: translateX(105%);\
	-webkit-transition: -webkit-transform .7s;\
	-moz-transition: -moz-transform .7s;\
	transition: transform .7s;\
}\
\
.leadInfoPlugin.active {\
	-webkit-transform: translateX(0%);\
	-moz-transform: translateX(0%);\
	-ms-transform: translateX(0%);\
	transform: translateX(0%);\
}\
\
.leadInfoPlugin__text {\
	font-family: Arial, Helvetica, sans-serif;\
	font-weight: bold;\
	font-size: 14px;\
	display: table-cell;\
	vertical-align: middle;\
}\
\
/*callback*/\
\
.callBack {\
	position: fixed;\
	bottom: 2%;\
	right: 2%;\
	width: 120px;\
	height: 120px;\
	z-index: 1000;\
	-webkit-perspective: 500px;\
	-moz-perspective: 500px;\
	perspective: 500px;\
	font-size: 14px;\
}\
\
.callBack__center {\
	font-family: Arial, Helvetica, sans-serif;\
	display: table;\
	position: absolute;\
	width: 80%;\
	height: 80%;\
	left: 10%;\
	right: 10%;\
	top: 10%;\
	bottom: 10%;\
	-webkit-border-radius: 50%;\
	-moz-border-radius: 50%;\
	border-radius: 50%;\
	text-align: center;\
	vertical-align: middle;\
	background-color: rgba(96, 191, 255, 0.9);\
	background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJERDYzRkI2NzJDODExRTdCRDUwQzUyQURDQzFBODY2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJERDYzRkI3NzJDODExRTdCRDUwQzUyQURDQzFBODY2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkRENjNGQjQ3MkM4MTFFN0JENTBDNTJBRENDMUE4NjYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkRENjNGQjU3MkM4MTFFN0JENTBDNTJBRENDMUE4NjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz76YWpfAAADqElEQVR42uydwXIjMQgFDZX//2X2tJeUXYljJB7Qum7VjgZ6GmYsRRYRD8bjVRBs+o1/kfu3wDAAAIhRQABAHhAtYXBymApDYABGKytggOVWAIA7CZIFAQDmwQYAlAUAeGfYZhB4C3gOQVwGwSYAEIJPWaYV4jAEJXHypMnHB3B0gsIu2KAVAJEMSicQbAIEfvCpn2yD0zCEMgDRjfKmJeKKMb0wcVNXopwAQQKAExOZvBypBQQukKjpEJhynFwkQdMXJmaBELcBuP1F7LEABKk4uVhCgOBynFwwEVsgMIU4uWgCtmxWKIfAhQMfF69T+Zm6FAL19QBRcL0KIMp+LfUG2q3uR27BYBUx8iY1V6UvOQ3DdQg6LQlT609iAgTd1gSG4HxCDIK3AYjFEIQwmHZjLqwK1rbBcQi8cbC3zO1oOcAA/ZrEVBC9eZC3zPFYKdhugNMrfBUgAAABGCohCADQgIHt4Z264ycwqECQagEMcB+EwAD9QaiGIM0CvjgJKmWhNAYYoC4JEotunae/NQS2zQDGvPKbQCP5pfO7bYHoaIDpkEalAUh+//n+2QJObZWZd2CAIY1VtyaQ5M+4B5sCwKQn/6MO/fCI7wAYyd9nHefJX20BfgugCUTBm+0WSgbgBMucWNgnBsACfAfAApvKgPM6tnsonhgSAPhxHOyFTa0DAIycB8A+NYAV1uSpFvge0/J7VDbAZAjavAVQi3kN5LVwOwAGBBgACCgBjO0AYAEMQFO4HQADAgyACZYDYECAAYCAEkA52A6AAQEGAAJKAOVgOwAGBH1H1oIQe+id6aP8pmKTDIAJXl8//vBv9ADNIXgnueUgZANgyyGIRqAeM8BWCKIRqMdLgCoEIQ5YTAFAFYITQVb//1Y3gV2f2JgCgIlDEMJJiikGsIE2COG5SZaADhCEWPKvXO9mD9Bhm9lPIFRulh3RBHbZa/gMhBZHwXZ4C+i04TQeQt/tT8yj6jWQXcciEFR+BwACAQiqPwQBQTEECl8CgaAQApVPwUBQBAF/LXw5BGo/BgHB5cGJIcstwJlByyHg1DBKgPQwQNgNADYAACAAACAAAPoCAMAGB2LiA24YEJYaABskxMC3B2D7vfvAQGCDxQBstIEBwF4bGAbYC0LKPW3aHTwJhLT72Lg9vDsIqXPffGSMMWfODOpkgyPz5NCoHiAcmxuHR78OdExPPgD8LvAxMfEAoG2Fa+UIALRguN6HAEBesqJT4v+PfwIMAFQ/3gdIE8f2AAAAAElFTkSuQmCC\");\
	background-repeat: no-repeat;\
	background-position: center;\
	-webkit-background-size: 50%;\
	background-size: 50%;\
	-webkit-box-shadow: 0px 0px 2px 5px rgba(96, 191, 255, 0.47);\
	-moz-box-shadow: 0px 0px 2px 5px rgba(96, 191, 255, 0.47);\
	box-shadow: 0px 0px 2px 5px rgba(96, 191, 255, 0.47);\
	text-transform: uppercase;\
	color: #fff;\
	-webkit-transform-origin: 50%;\
	-moz-transform-origin: 50%;\
	-ms-transform-origin: 50%;\
	transform-origin: 50%;\
	-webkit-animation: touchMe 5s linear infinite;\
	-moz-animation: touchMe 5s linear infinite;\
	animation: touchMe 5s linear infinite;\
}\
.callBack__center:hover {\
	cursor: pointer;\
}\
.spinner {\
	-webkit-animation: spin 1s linear;\
	-moz-animation: spin 1s linear;\
	animation: spin 1s linear;\
}\
\
.text-hide {\
	opacity: 1 !important;\
}\
\
.bg-img-none {\
	background-image: none;\
}\
\
.callBack__center::before,\
.callBack__center::after {\
	content: \"\";\
	position: absolute;\
	left: 0;\
	top: 0;\
	display: block;\
	width: 100%;\
	height: 100%;\
	-webkit-border-radius: 50%;\
	-moz-border-radius: 50%;\
	border-radius: 50%;\
	-webkit-box-shadow: inset 0px 0px 60px 0px rgba(0, 191, 255, 1);\
	-moz-box-shadow: inset 0px 0px 60px 0px rgba(0, 191, 255, 1);\
	box-shadow: inset 0px 0px 60px 0px rgba(0, 191, 255, 1);\
}\
\
.callBack__center::before {\
	-webkit-animation: pulse 3s linear infinite;\
	-moz-animation: pulse 3s linear infinite;\
	animation: pulse 3s linear infinite;\
}\
\
.callBack__center::after {\
	-webkit-animation: pulse-small 3s linear infinite;\
	-moz-animation: pulse-small 3s linear infinite;\
	animation: pulse-small 3s linear infinite;\
}\
\
.callBack__center span {\
	display: table-cell;\
	vertical-align: middle;\
	opacity: 0;\
	transition: opacity .5s;\
	-webkit-user-select: none;\
	-moz-user-select: none;\
	-ms-user-select: none;\
	-o-user-select: none;\
	user-select: none;\
}\
\
/*END: callback*/\
/*popup*/\
\
#m1-form .popup-m1-form button,\
#m1-form .popup-m1-title {\
	text-transform: uppercase;\
	font-weight: 700;\
	letter-spacing: .7px\
}\
\
#m1-form,\
#m1-form .popup-m1-form button,\
#m1-form .popup-m1-form input[type=text],\
#m1-form>div,\
.close-m1,\
.popup-m1-cont,\
.popup-m1-form,\
.popup-m1-text1,\
.popup-m1-text2,\
.popup-m1-title {\
	margin: 0;\
	padding: 0;\
	border: 0;\
	outline: 0;\
	position: relative;\
}\
\
#m1-form {\
	position: fixed;\
	display: none;\
	outline: 0;\
	width: 450px;\
	margin-left: -225px;\
	margin-top: -280px;\
	top: 50%;\
	left: 50%;\
	background: #fff;\
	z-index: 9999;\
	-webkit-border-radius: 8px;\
	-moz-border-radius: 8px;\
	border-radius: 8px;\
	font-family: Arial, Helvetica, sans-serif;\
}\
\
#m1-form span.close-m1 {\
	position: absolute;\
	display: block;\
	width: 28px;\
	height: 28px;\
	line-height: 26px;\
	top: 3px;\
	right: 3px;\
	font-size: 24px;\
	color: #fff;\
	text-align: center;\
	cursor: pointer;\
	z-index: 999;\
}\
\
#m1-form span.close-m1:before {\
	content: \"\\00D7\"\
}\
\
#m1-form>div {\
	position: relative;\
	width: 100%;\
	overflow: hidden;\
	-webkit-border-radius: 8px;\
	-moz-border-radius: 8px;\
	border-radius: 8px\
}\
\
#m1-form .popup-m1-title {\
	position: relative;\
	padding: 20px 0 16px;\
	text-align: center;\
	font-size: 25px;\
	line-height: 1.3em;\
	color: #fff;\
	background: #64ca50\
}\
\
#m1-form .popup-m1-title:after,\
#m1-form .popup-m1-title:before {\
	content: \"\";\
	position: absolute;\
	width: 50%;\
	height: 20px;\
	bottom: -10px;\
	background: #64ca50\
}\
\
#m1-form .popup-m1-title:before {\
	left: 0;\
	-webkit-transform: skew(0deg, 4deg);\
	-moz-transform: skew(0deg, 4deg);\
	-ms-transform: skew(0deg, 4deg);\
	transform: skew(0deg, 4deg)\
}\
\
#m1-form .popup-m1-title:after {\
	right: 0;\
	-webkit-transform: skew(0deg, -4deg);\
	-moz-transform: skew(0deg, -4deg);\
	-ms-transform: skew(0deg, -4deg);\
	transform: skew(0deg, -4deg)\
}\
\
#m1-form .popup-m1-cont {\
	position: relative;\
	padding: 45px 20px 30px;\
	color: #333;\
	font-size: 17px;\
	line-height: 1.5em\
}\
\
#m1-form .popup-m1-cont div.popup-m1-text1 {\
	text-align: center\
}\
\
#m1-form .popup-m1-form {\
	position: relative;\
	display: block;\
	padding: 30px 0;\
}\
\
#m1-form .popup-m1-form:after {\
	content: \"\";\
	display: block;\
	clear: both;\
	height: 0\
}\
\
#m1-form .popup-m1-form button,\
#m1-form .popup-m1-form input[type=text] {\
	padding: 0;\
	background: #fff;\
	position: relative;\
	display: block;\
	margin: 0 auto;\
	text-align: left;\
	-webkit-border-radius: 4px;\
	-moz-border-radius: 4px;\
	border-radius: 4px;\
}\
\
#m1-form .popup-m1-form input[type=text]::-webkit-input-placeholder {\
	color: #a9a9a9;\
	opacity: 1\
}\
\
#m1-form .popup-m1-form input[type=text]:-moz-placeholder {\
	color: #a9a9a9;\
	opacity: 1\
}\
\
#m1-form .popup-m1-form input[type=text]::-moz-placeholder {\
	color: #a9a9a9;\
	opacity: 1\
}\
\
#m1-form .popup-m1-form input[type=text]:-ms-input-placeholder {\
	color: #a9a9a9;\
	opacity: 1\
}\
\
#m1-form .popup-m1-form input[type=text],\
#m1-form .popup-m1-form select {\
	display: block;\
	width: 90%;\
	height: 64px;\
	margin: 0 auto 16px;\
	line-height: 64px;\
	font-size: 17px;\
	color: #222;\
	background: #fff;\
	text-indent: 20px;\
	border: 1px solid #ccc\
}\
\
#m1-form .popup-m1-form input[type=text]:focus {\
	border-color: #aaa\
}\
\
#m1-form .popup-m1-form button {\
	width: 90%;\
	height: 68px;\
	line-height: 68px;\
	color: #fff;\
	text-align: center;\
	text-decoration: none;\
	font-size: 22px;\
	border-bottom: 3px solid #cd6c00;\
	background: #ff8300;\
	cursor: pointer;\
	-webkit-box-shadow: 0 0;\
	-moz-box-shadow: 0 0;\
	box-shadow: 0 0;\
	text-shadow: 0 0 0\
}\
\
#m1-form .popup-m1-form button:hover {\
	background: #ff8f00\
}\
\
#m1-form .popup-m1-form button:active {\
	top: -1px\
}\
\
#m1-form .popup-m1-cont p.popup-m1-text2 {\
	text-align: center\
}\
\
#m1-form .popup-m1-cont p.popup-m1-text2:before {\
	content: \"\";\
	position: relative;\
	display: inline-block;\
	width: 16px;\
	height: 15px;\
	margin: 0 10px 0 0;\
	top: 2px;\
	background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAAA6klEQVR42mJMORXAgAZEgLgIiH2AWA0qdgOINwHxJCB+g6yYCU1zMBDfAeI/QBwNxPxQHA+VvwtVAwcsaJpXA7ErEO9FM/giFB8E4t1AHArEa5FdIArE83BoRgZ7oWpAasWQDcgF4gkENCMb0g/EBcgG+AHxOgbiwVpoIMPDQB+IpwHxPyC2JaD5MBAzArEuzICHUAkrIm23QWI/BHlBjoF8IMfEQCGgigGP0MScSdD/CGSAPJRzBJrmQVHUBA1ldihGBiB1R6FseVg0MmLJTMeBmBtJEyx6bQmFASi3VQHxeSQxRlx+AAgwAF+pKdMzI/goAAAAAElFTkSuQmCC\");\
	background-repeat: no-repeat;\
}\
\
#overlay-popup-m1 {\
	display: none;\
	position: fixed;\
	width: 100%;\
	height: 100%;\
	top: 0;\
	left: 0;\
	background: rgba(0, 0, 0, .6);\
	-ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=60)\";\
	filter: alpha(opacity=0);\
	-moz-opacity: 0;\
	-khtml-opacity: 0;\
	opacity: 0;\
	z-index: 999\
}\
\
.js-show {\
	display: block !important;\
	-webkit-animation: animShow .3s linear;\
	-moz-animation: animShow .3s linear;\
	animation: animShow .3s linear;\
	opacity: 1 !important\
}\
\
/*END: popup*/\
/*animations*/\
\
@-webkit-keyframes spin {\
	0% {\
		-webkit-transform: rotateY(0deg);\
	}\
	100% {\
		-webkit-transform: rotateY(360deg);\
	}\
}\
\
@-moz-keyframes spin {\
	0% {\
		-moz-transform: rotateY(0deg);\
	}\
	100% {\
		-moz-transform: rotateY(360deg);\
	}\
}\
\
@keyframes spin {\
	0% {\
		transform: rotateY(0deg);\
	}\
	100% {\
		transform: rotateY(360deg);\
	}\
}\
\
@-webkit-keyframes touchMe {\
	0%,\
	90% {\
		-webkit-transform: rotate(0deg);\
	}\
	92% {\
		-webkit-transform: rotate(10deg);\
	}\
	94% {\
		-webkit-transform: rotate(-10deg);\
	}\
	96% {\
		-webkit-transform: rotate(5deg);\
	}\
	98% {\
		-webkit-transform: rotate(-5deg);\
	}\
	100% {\
		-webkit-transform: rotate(0deg);\
	}\
}\
\
@-moz-keyframes touchMe {\
	0%,\
	90% {\
		-moz-transform: rotate(0deg);\
	}\
	92% {\
		-moz-transform: rotate(10deg);\
	}\
	94% {\
		-moz-transform: rotate(-10deg);\
	}\
	96% {\
		-moz-transform: rotate(5deg);\
	}\
	98% {\
		-moz-transform: rotate(-5deg);\
	}\
	100% {\
		-moz-transform: rotate(0deg);\
	}\
}\
\
@keyframes touchMe {\
	0%,\
	90% {\
		transform: rotate(0deg);\
	}\
	92% {\
		transform: rotate(10deg);\
	}\
	94% {\
		transform: rotate(-10deg);\
	}\
	96% {\
		transform: rotate(5deg);\
	}\
	98% {\
		transform: rotate(-5deg);\
	}\
	100% {\
		transform: rotate(0deg);\
	}\
}\
\
@-webkit-keyframes pulse {\
	0% {\
		-webkit-transform: scale(1.1);\
		opacity: 0\
	}\
	40% {\
		-webkit-transform: scale(1.2);\
		opacity: .05\
	}\
	50% {\
		-webkit-transform: scale(1.3);\
		opacity: .1\
	}\
	60% {\
		-webkit-transform: scale(1.5);\
		opacity: .3\
	}\
	80% {\
		-webkit-transform: scale(1.7);\
		opacity: .1\
	}\
	100% {\
		-webkit-transform: scale(2);\
		opacity: 0\
	}\
}\
\
@-moz-keyframes pulse {\
	0% {\
		-moz-transform: scale(1.1);\
		opacity: 0\
	}\
	40% {\
		-moz-transform: scale(1.2);\
		opacity: .05\
	}\
	50% {\
		-moz-transform: scale(1.3);\
		opacity: .1\
	}\
	60% {\
		-moz-transform: scale(1.5);\
		opacity: .3\
	}\
	80% {\
		-moz-transform: scale(1.7);\
		opacity: .1\
	}\
	100% {\
		-moz-transform: scale(2);\
		opacity: 0\
	}\
}\
\
@keyframes pulse {\
	0% {\
		transform: scale(1.1);\
		opacity: 0\
	}\
	40% {\
		transform: scale(1.2);\
		opacity: .05\
	}\
	50% {\
		transform: scale(1.3);\
		opacity: .1\
	}\
	60% {\
		transform: scale(1.5);\
		opacity: .3\
	}\
	80% {\
		transform: scale(1.7);\
		opacity: .1\
	}\
	100% {\
		transform: scale(2);\
		opacity: 0\
	}\
}\
\
@-webkit-keyframes pulse-small {\
	0%,\
	40% {\
		-webkit-transform: scale(1);\
		opacity: .3\
	}\
	50% {\
		-webkit-transform: scale(1.1);\
		opacity: .5\
	}\
	60% {\
		-webkit-transform: scale(1.20);\
		opacity: .7\
	}\
	80% {\
		-webkit-transform: scale(1.3);\
		opacity: .4\
	}\
	100% {\
		-webkit-transform: scale(1.5);\
		opacity: 0\
	}\
}\
\
@-moz-keyframes pulse-small {\
	0%,\
	40% {\
		-moz-transform: scale(1);\
		opacity: .3\
	}\
	50% {\
		-moz-transform: scale(1.1);\
		opacity: .5\
	}\
	60% {\
		-moz-transform: scale(1.20);\
		opacity: .7\
	}\
	80% {\
		-moz-transform: scale(1.3);\
		opacity: .4\
	}\
	100% {\
		-moz-transform: scale(1.5);\
		opacity: 0\
	}\
}\
\
@keyframes pulse-small {\
	0%,\
	40% {\
		transform: scale(1);\
		opacity: .3\
	}\
	50% {\
		transform: scale(1.1);\
		opacity: .5\
	}\
	60% {\
		transform: scale(1.20);\
		opacity: .7\
	}\
	80% {\
		transform: scale(1.3);\
		opacity: .4\
	}\
	100% {\
		transform: scale(1.5);\
		opacity: 0\
	}\
}\
\
@-webkit-keyframes animShow {\
	0% {\
		opacity: .3\
	}\
	50% {\
		opacity: .5;\
		-webkit-transform: scale(1.1);\
	}\
	100% {\
		-webkit-transform: scale(1);\
		opacity: 1\
	}\
}\
\
@-moz-keyframes animShow {\
	0% {\
		opacity: .3\
	}\
	50% {\
		opacity: .5;\
		-moz-transform: scale(1.1);\
	}\
	100% {\
		-moz-transform: scale(1);\
		opacity: 1\
	}\
}\
\
@keyframes animShow {\
	0% {\
		opacity: .3\
	}\
	50% {\
		opacity: .5;\
		transform: scale(1.1);\
	}\
	100% {\
		transform: scale(1);\
		opacity: 1\
	}\
}\
@media screen and (max-width:1023px){\
	body{\
		padding-top: 62px;\
	}\
}\
@media screen and (max-width:767px){\
	body{\
		padding-top: 0;\
	}\
}\
";
DOMbody.appendChild(styles);

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
//Common text for Leads Plugin 
var leadPluginText = {
	'ru': ['Москва', 'с города', 'Упаковок заказано', 'На сумму'],
	'ro': ['București', 'din', 'Pachetele comandate', 'La valoarea']
};
var usersData = {
	'ru': ['Вадим', 'Владимир', 'Александр', 'Антон', 'Кирилл'],
	'ro': ['Ștefan', 'Bogdan', 'Andrei', 'Aurelian', 'Constantin', 'Daniel', 'Corneliu', 'Beniamin']
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

//get geolocation data using IP adress
var getLocation = function () {
	var xmlhttp = new XMLHttpRequest();
	var url = "http://freegeoip.net/json/";
	xmlhttp.open("GET", url, false);
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			locationData = JSON.parse(this.responseText);
			city = locationData['city'];
		}
	};
	try {
		xmlhttp.send();
	} catch (err) {
		city = leadPluginText[params.lang][0];
	}
}();

var priceNode = document.getElementsByClassName('al-raw-cost-promo')[0];
var currencyNode = document.getElementsByClassName('al-raw-currency')[0];
var priceNode2 = document.getElementsByClassName('al-cost')[0];
var price = void 0,
    currency = void 0;
(function () {
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
	(function () {
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
			topPlugin.className = "topPlugin";
			var countText1 = topPluginText[params.lang][0],
			    countText2 = topPluginText[params.lang][1],
			    countText3 = topPluginText[params.lang][2];

			var topPluginInner = "<span class=\"topPlugin__count\">" + countText1 + ":<strong> " + usersNum + "</strong></span>\n\t\t\t\t<span class=\"topPlugin__count\">" + countText2 + ":<strong> " + onlineUsersNum + "</strong></span>\n\t\t\t\t<span class=\"topPlugin__count\">" + countText3 + ":<strong> " + todayLeads + "</strong></span>";

			topPlugin.innerHTML = topPluginInner;
			DOMbody.appendChild(topPlugin);
		};

		var AddStatusBar = function AddStatusBar() {
			var statusBar = document.createElement("div");
			statusBar.className = "statusPlugin";
			var text1 = statusBarText[params.lang][0],
			    text2 = statusBarText[params.lang][1];
			var statusBarInner = "<p>" + text1 + " <strong> " + onlineUsersNum + "</strong> " + text2 + "</p>\n\t\t\t<span class=\"statusPlugin__close\"></span>";
			statusBar.innerHTML = statusBarInner;
			DOMbody.appendChild(statusBar);
		};

		var getStrLeadInfo = function getStrLeadInfo() {
			var str = '';
			randomUser = function () {
				var rndNum = getRandomInt(0, userArray.length - 1);
				while (!(rndNumArr.indexOf(rndNum) === -1)) {
					rndNum = getRandomInt(0, userArray.length - 1);
					if (rndNumArr.length == userArray.length) {
						clearInterval(updLead);
						break;
					}
				}
				rndNumArr.push(rndNum);
				return rndNum;
			}();
			boughtNow = function () {
				return getRandomInt(1, 5);
			}();
			evaluateSum = function () {
				return boughtNow * price;
			}();
			user = userArray[randomUser];
			todayLeads += boughtNow;
			if (isStorage()) {
				localStorage.setItem('leadsCount', todayLeads);
			}
			str = user + ' ' + leadText1 + ' ' + city + '. ' + leadText2 + ': ' + boughtNow + '. ' + leadText3 + ': ' + evaluateSum + '&nbsp;' + currency;
			return str;
		};

		var AddLeadInfo = function AddLeadInfo() {
			leadInfo.className = "leadInfoPlugin";
			leadInfo.innerHTML = "<p class=\"leadInfoPlugin__text\"></p>";
			DOMbody.appendChild(leadInfo);
		};

		var showLeadInfo = function showLeadInfo() {
			leadInfo.classList.add("active");
		};

		var hideLeadInfo = function hideLeadInfo() {
			setTimeout(function () {
				leadInfo.classList.remove("active");
			}, 7000);
		};

		var addCallBackPlugin = function addCallBackPlugin() {
			var callBackPlugin = document.createElement("div");
			callBackPlugin.className = "callBack";
			callBackPlugin.innerHTML = "<div class=\"callBack__center\"><span>" + callBackPluginText[params.lang] + "</span></div>\n\t\t\t\t\t\t\t\t<div class=\"callBack__shadow\"></div>";
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
			popupForm.innerHTML = "<span class=\"close-m1\"></span>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<h2 class=\"popup-m1-title\">" + popupText[params.lang].title + "</h2>\n\t\t\t\t\t\t\t\t\t<div class=\"popup-m1-cont\">\n\t\t\t\t\t\t\t\t\t\t<p class=\"popup-m1-text1\">" + popupText[params.lang].desc + "</p>\n\t\t\t\t\t\t\t\t\t\t<form method=\"POST\" action=\"/land/order\" class=\"popup-m1-form al-form\">\n\t\t\t\t\t\t\t\t\t\t\t<select class=\"al-country\" style=\"display: none;\"></select>\n\t\t\t\t\t\t\t\t\t\t\t<input type=\"text\" name=\"name\" placeholder=\"" + popupText[params.lang].name + "\" required=\"\">\n\t\t\t\t\t\t\t\t\t\t\t<input type=\"text\" name=\"phone\" placeholder=\"" + popupText[params.lang].phone + "\" required=\"\">\n\t\t\t\t\t\t\t\t\t\t\t<button type=\"submit\">" + popupText[params.lang].order + "</button>\n\t\t\t\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t\t\t\t\t<p class=\"popup-m1-text2\">" + popupText[params.lang].desc2 + "</p>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>";
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
				spinnerTimer = setInterval(function () {
					callBack.classList.toggle('spinner');
					callBackCenter.classList.toggle('bg-img-none');
					callBackText.classList.toggle('text-hide');
				}, 5000);
			} else {
				clearInterval(spinnerTimer);
			}
		};

		//Change display property
		var displayOnMobile = function displayOnMobile() {
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
		user = userArray[0],
		    leadText1 = leadPluginText[params.lang][1],
		    //с города
		leadText2 = leadPluginText[params.lang][2],
		    //Упаковок заказано
		leadText3 = leadPluginText[params.lang][3]; //На сумму
		if (isStorage() && localStorage.getItem("leadsCount")) {
			todayLeads = parseInt(localStorage.getItem("leadsCount"));
		}

		var topPlugin = document.createElement("div");
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

		setInterval(function () {
			usersNum = getAllUsersCount();
			updateValue(allUsers, usersNum);
		}, 15000);

		setInterval(function () {
			onlineUsersNum = getOnlineUsers();
			updateValue(onlineUsers, onlineUsersNum);
			updateValue(onlineUsers2, onlineUsersNum);
		}, getRandomInt(10000, 15000));

		var updLead = setInterval(function () {
			showLeadInfo();
			hideLeadInfo();
			updateValue(leadText, getStrLeadInfo());
			updateValue(leadsNode, todayLeads);
		}, getRandomInt(14000, 30000));

		closeButton.addEventListener('click', function () {
			DOMbody.removeChild(statusBar);
		});

		var callBack = document.getElementsByClassName('callBack')[0];
		var callBackCenter = document.getElementsByClassName('callBack__center')[0];
		var callBackText = document.querySelector('.callBack__center span');

		var spinnerTimer = void 0;


		animateCallBack(true);
		callBack.addEventListener('mouseover', function () {
			animateCallBack(false);
		});
		callBack.addEventListener('mouseleave', function () {
			animateCallBack(true);
		});
		callBackCenter.addEventListener('click', showPopupForm);
		closePopupBtn.addEventListener('click', hidePopupForm);
		overlay.addEventListener('click', hidePopupForm);

		window.addEventListener('mouseout', function (event) {
			var comebacker = true;
			if (event.pageY - window.scrollY < 1 && comebacker) {
				comebacker = false;
				showPopupForm();
				return false;
			}
		});
		window.addEventListener("resize", displayOnMobile);

		var setCustomStyles = function () {
			DOMbody.style.paddingTop = topPlugin.style.height + 'px';
			callBack.style.width = customCSS.callBackDiam / Math.sqrt(2) + 'px';
			callBack.style.height = customCSS.callBackDiam / Math.sqrt(2) + 'px';
			callBack.style.fontSize = customCSS.callBackFontSize + 'px';
		}();
	})();
}