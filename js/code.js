window.onload = () => {
	init();
}

//paramètres 
const intervalleRafraichissement = Math.floor(1000/120); ;
const intervalleNouvelleBulle = 150;
const proportionBullesNoires = 3;
const tempsLimite = 2000000;
const listeCouleurs = {"B":"#0000ff","V": "#00c000","N": "#555"} ;
const intervalleChangementVitesse = 10000;
const incrementVitesse =  10 ;
const rayonBulleBleue = 10 ;

function init() {
	
	//initialisation des variables
	const monCanvas = document.getElementById('dessin');
	var ctx = monCanvas.getContext('2d');
	let tempsJeu, ecranCourant, score, listeBulles, vitesse, nombreVies, niveauCourant;
	
	function reinitialisation () {
		tempsJeu=0 ;
		ecranCourant= null;
		niveauCourant = 1;
		score= 0; 
		//position de la souris
		xSourisCanvas = monCanvas.width/2;
		ySourisCanvas = monCanvas.height/2;
		//liste des bulles 
		listeBulles = [];
		//nb total de bulles (sans la bulle bleue)
		nbBulles =0 ;
		//vitesse initiale des bulles en pixels par seconde
		vitesse = 25 ;
		//nb initial de vies
		nombreVies = 3 ;
	}
		
	//gestionnaires
	
	monCanvas.addEventListener('mousemove', positionSouris, false);
	document.getElementById("boutonJouer").addEventListener('click', afficheEcranJeu, false);
	document.getElementById("boutonQuitter").addEventListener('click', afficheEcranAccueil, false);
	document.getElementById("boutonRejouer").addEventListener('click', afficheEcranJeu, false);
	document.getElementById("boutonAccueil").addEventListener('click', afficheEcranAccueil, false);
	inter= setInterval(regles, intervalleRafraichissement);
	//moteur de règles
	
	function positionSouris(event) {
		xSourisCanvas = event.clientX - monCanvas.offsetLeft;
		ySourisCanvas = event.clientY - monCanvas.offsetTop;
	}
	
	
	function regles() {
	if (ecranCourant === "ecranJeu") {
		//animation
		animer();
		document.getElementById("score").innerHTML=score ;
		document.getElementById("temps").innerHTML=Math.floor(tempsJeu / 1000);
		document.getElementById("vies").innerHTML=nombreVies ;
		document.getElementById("niveau").innerHTML=niveauCourant ;
	}
	if (ecranCourant === "ecranBilan") {
		document.getElementById("scoreFinal").innerHTML=score ;
		document.getElementById("niveauFinal").innerHTML=niveauCourant ;
		
	}
	}

function creeBulle(couleur) {
	const bulle = {                                //on définit les différentes composantes de la bulle 
		x: Math.random() * monCanvas.width ,
		y :  Math.random() * monCanvas.height /10, 
		couleur : couleur ,
		rayon: Math.random() *20 + 5,
		estVisible : true ,
	}
	listeBulles.push(bulle);
	nbBulles++ ; 
}
function distanceABleue(bulle){
	return Math.sqrt(Math.pow(bulle.x - xSourisCanvas,2) + Math.pow(bulle.y - ySourisCanvas,2));
}
function dessineBulle(bulle) {
	
	if (bulle.couleur!=="B" && bulle.estVisible && distanceABleue(bulle)< rayonBulleBleue + bulle.rayon ) {
		switch (bulle.couleur){
			case "N":
				nombreVies--;
				break;
			case "V":
				score++;
				break;
			default:
				break;
		
		}
		bulle.estVisible = false ;
	}
	
	if (bulle.estVisible && bulle.x > 0  && bulle.x < monCanvas.width && bulle.y > 0  && bulle.y < monCanvas.height ) {
		console.log('ici');
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 2;
		ctx.fillStyle = listeCouleurs[bulle.couleur] ;
		ctx.beginPath();
		ctx.arc(bulle.x,bulle.y,bulle.rayon, 0, 2*Math.PI);
		ctx.stroke();
		ctx.fill();
	}
	
	if (bulle.couleur !== "B") {
		bulle.y += vitesse*intervalleRafraichissement / 1000 ;
	}
}

function animer() {
	if (tempsJeu >= tempsLimite || nombreVies <= 0) {
		afficheEcranBilan();
		return;
	}

	tempsJeu = tempsJeu + intervalleRafraichissement ;
	if (tempsJeu % intervalleChangementVitesse === 0) {
		niveauCourant++; 
		vitesse+=incrementVitesse ;
		
	}
	//création des bulles N et V - test sur le temps 
	if (tempsJeu % intervalleNouvelleBulle === 0) {
		//création d'une nouvelle bulle -> teste s'il est temps d'en créer une verte 
		if (listeBulles.length % proportionBullesNoires === 0 && listeBulles.length !== 0) {
		creeBulle("V");
		} else {
			creeBulle("N");
		}
	}
	
	//dessin des bulles 
	ctx.clearRect(0, 0, monCanvas.width, monCanvas.height);
	
	for (let bulle of listeBulles){
		dessineBulle(bulle);
	}
	
	//dessin de la bulle bleue (ne fait pas partie de la liste)
	dessineBulle({x: xSourisCanvas, y: ySourisCanvas, couleur : "B", rayon : rayonBulleBleue, estVisible : true});
	
	//affichages
}


function afficheEcranAccueil() {
		reinitialisation();
		ecranCourant ="ecranAccueil" ;
		document.getElementById("ecranAccueil").style.display = "block";
		document.getElementById("ecranJeu").style.display = "none";
		document.getElementById("ecranBilan").style.display = "none";
}

function afficheEcranJeu() {
		reinitialisation();
		ecranCourant ="ecranJeu" ;
		document.getElementById("ecranAccueil").style.display = "none";
		document.getElementById("ecranJeu").style.display = "block";
		document.getElementById("ecranBilan").style.display = "none";
}

function afficheEcranBilan() {
		ecranCourant ="ecranBilan" ;
		document.getElementById("ecranAccueil").style.display = "none";
		document.getElementById("ecranJeu").style.display = "none";
		document.getElementById("ecranBilan").style.display = "block";
}


	//lancement : affichage de l'écran d'accueil 
	afficheEcranAccueil();
}
