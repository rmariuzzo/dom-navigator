// JavaScript Document
var app = {
	initialize: function(){

		//Evento escucha redimensión de la pantalla
		window.onresize = function(event){ app.resizeScreen(); };

		//Evento escucha al botón de mostrar menú
		document.querySelector('div.header-wrapper div.header div.displaymenu').addEventListener('click', function(event){
			
			var element = document.querySelector('div.header-wrapper div.header ul.menu');
			if (element.classList && element.classList.contains('show')){
					element.className = 'menu';
					document.getElementById('mavirasBACK').style.display = "none";
			}else{
					document.querySelector('div.header-wrapper div.header ul.menu').className = 'menu show';
					document.getElementById('mavirasBACK').style.display = "block";
			}

		}, false);

	},
	resizeScreen: function(){
		//Dimensionar alto del menú
		document.querySelector('div.header-wrapper div.header ul.menu').style.height = (window.innerHeight-60) + "px";
	}
};

document.addEventListener('DOMContentLoaded', function(){
	app.initialize();
});