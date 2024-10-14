var scormAPI;

// Fonction pour récupérer l'API SCORM (version 1.2)
function getAPI() {
  if (window.parent && window.parent !== window) {
    return window.parent.API;
  } else if (window.top && window.top.opener && window.top.opener.API) {
    return window.top.opener.API;
  }
  return null;
}

// Initialiser l'API SCORM
function initializeScorm() {
  scormAPI = getAPI();
  if (scormAPI) {
    scormAPI.LMSInitialize("");
    //console.log("SCORM API initialisée");
    debugLog("SCORM API initialisée");
  } else {
    alert("Impossible de trouver l'API SCORM");
    debugLog("API SCORM non initialisée - 1 -");
  }
}

// Fonction pour afficher des informations de débogage
function debugLog(message) {
  var debugDiv = document.getElementById("debug");
  debugDiv.innerHTML += "<p>" + message + "</p>";
}

// Envoyer un score à Moodle
function sendScore(score) {
  if (scormAPI) {
    var minScore = "0";
    var maxScore = "100";
    var currentScore = score.toString();

    scormAPI.LMSSetValue("cmi.core.score.raw", currentScore);
    scormAPI.LMSSetValue("cmi.core.score.min", minScore);
    scormAPI.LMSSetValue("cmi.core.score.max", maxScore);

    scormAPI.LMSCommit("");
    debugLog("Score envoyé : " + score + "%");
  } else {
    alert("API SCORM non initialisée - 2 -");
  }
}

// Envoyer le statut de progression
function sendLessonStatus(status) {
  if (scormAPI) {
    scormAPI.LMSSetValue("cmi.core.lesson_status", status);
    scormAPI.LMSCommit("");
    debugLog("Statut de la leçon envoyé : " + status);
  } else {
    alert("API SCORM non initialisée - 3 -");
  }
}

// Envoyer le temps passé
function sendSessionTime(time) {
  if (scormAPI) {
    scormAPI.LMSSetValue("cmi.core.session_time", time);
    scormAPI.LMSCommit("");
    debugLog("Temps de session envoyé : " + time);
  } else {
    alert("API SCORM non initialisée - 4 -");
  }
}

//

function recordInteraction(interactionId, response, correctResponse) {
  if (scormAPI) {
    // Interaction ID (par ex. Question 1)
    scormAPI.LMSSetValue("cmi.interactions.0.id", interactionId);

    // Réponse de l'apprenant
    scormAPI.LMSSetValue("cmi.interactions.0.student_response", response);

    // Bonne réponse
    scormAPI.LMSSetValue(
      "cmi.interactions.0.correct_responses.0.pattern",
      correctResponse
    );

    // Résultat de l'interaction (correct ou incorrect)
    var result = response === correctResponse ? "correct" : "incorrect";
    scormAPI.LMSSetValue("cmi.interactions.0.result", result);

    scormAPI.LMSCommit(""); // Enregistre les données
    debugLog("Interaction enregistrée : " + interactionId);
  } else {
    alert("API SCORM non initialisée - 5 -");
  }
}

//

// Terminer la session SCORM
function finishScorm() {
  if (scormAPI) {
    scormAPI.LMSFinish("");
    debugLog("Session terminée !");
  }
}

// Fonction pour récupérer le score SCORM
function getScore() {
  var score = scormAPI.LMSGetValue("cmi.core.score.raw");
  return score ? parseInt(score, 10) : 0; // Renvoie 0 si aucun score
}

// Fonction pour mettre à jour l'affichage de la barre de score
function updateScoreBar(score) {
  var maxScore = 100; // Supposons que le score max est 100
  var scoreFill = document.querySelector(".score-fill");
  var scoreText = document.getElementById("score-text");
  var iconElement = document.getElementById("icon");
  var scoreIconContainer = document.querySelector(".score-icon");

  // Calculer la largeur en pourcentage
  var scorePercent = (score / maxScore) * 100;

  // Mettre à jour la largeur de la barre
  scoreFill.style.width = scorePercent + "%";

  // Changer la couleur de la barre en fonction des seuils
  if (scorePercent <= 25) {
    scoreFill.style.backgroundColor = "red"; // Rouge pour les scores entre 0 et 25%
    iconElement.className = "fas fa-times-circle"; // Icône rouge pour score bas
  } else if (scorePercent <= 50) {
    scoreFill.style.backgroundColor = "yellow"; // Jaune pour les scores entre 26 et 50%
    iconElement.className = "fas fa-book"; // Icône de livre pour score moyen
  } else if (scorePercent <= 75) {
    scoreFill.style.backgroundColor = "orange"; // Orange pour les scores entre 51 et 75%
    iconElement.className = "fas fa-award"; // Icône intermédiaire
  } else {
    scoreFill.style.backgroundColor = "green"; // Vert pour les scores entre 76 et 100%
    iconElement.className = "fas fa-graduation-cap"; // Diplôme pour 100%
    triggerFireworks(); // Déclencher les feux d'artifice si 100%
  }

  // Afficher l'icône
  scoreIconContainer.style.display = "block";

  // Mettre à jour le texte
  scoreText.textContent = "Score : " + score + " / " + maxScore;
}

// Appel de la fonction au chargement de la page
window.onload = function () {
  initializeScorm(); // Initialiser SCORM
  var score = getScore(); // Récupérer le score SCORM
  updateScoreBar(score); // Mettre à jour la barre de score avec l'animation
};

// Fonction pour déclencher les feux d'artifice
function triggerFireworks_old() {
  var fireworksContainer = document.getElementById("fireworks-container");
  fireworksContainer.style.display = "block"; // Afficher les feux d'artifice

  // Ajouter des "explosions" visibles à des positions aléatoires
  for (var i = 0; i < fireworksContainer.children.length; i++) {
    var firework = fireworksContainer.children[i];
    firework.style.left = Math.random() * 100 + "%"; // Positionner aléatoirement les explosions
    firework.style.top = Math.random() * 100 + "%";
    firework.style.backgroundColor = ["red", "yellow", "blue", "green"][i]; // Couleur différente par explosion
  }

  // Faire disparaître les feux d'artifice après 2 secondes
  setTimeout(function () {
    fireworksContainer.style.display = "none";
  }, 2000);
}

function triggerFireworks() {
  const canvas = document.getElementById("fireworksCanvas");
  const ctx = canvas.getContext("2d");

  // Ajuster la taille du canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let fireworks = [];

  // Lancer un feu d'artifice à une position aléatoire
  fireworks.push(
    new Firework(Math.random() * canvas.width, Math.random() * canvas.height)
  );

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
      firework.update(ctx);
      if (firework.isFinished()) {
        fireworks.splice(index, 1); // Retirer le feu d'artifice une fois terminé
      }
    });

    if (fireworks.length > 0) {
      requestAnimationFrame(animate);
    }
  }

  animate();

  // Ajouter de nouveaux feux d'artifice toutes les 1,5 secondes
  setTimeout(function () {
    fireworks.push(
      new Firework(Math.random() * canvas.width, Math.random() * canvas.height)
    );
  }, 1500);

  // Arrêter l'effet après 5 secondes
  setTimeout(function () {
    fireworks = [];
  }, 5000);
}

// Feu d'artifice avec Canvas
function Firework(x, y) {
  this.x = x;
  this.y = y;
  this.particles = [];
  this.exploded = false;

  // Générer les particules
  this.explode = function () {
    for (let i = 0; i < 50; i++) {
      this.particles.push(new Particle(this.x, this.y));
    }
    this.exploded = true;
  };

  this.update = function (ctx) {
    if (!this.exploded) {
      this.explode();
    }
    this.particles.forEach((particle, index) => {
      particle.update(ctx);
      if (particle.lifespan <= 0) {
        this.particles.splice(index, 1); // Retirer les particules mortes
      }
    });
  };

  this.isFinished = function () {
    return this.particles.length === 0;
  };
}

function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.lifespan = 255;
  this.velocityX = (Math.random() * 2 - 1) * 3;
  this.velocityY = (Math.random() * 2 - 1) * 3;
  this.size = Math.random() * 4 + 2;

  this.update = function (ctx) {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.lifespan -= 4;

    ctx.fillStyle = `rgba(255, ${Math.floor(Math.random() * 255)}, 0, ${
      this.lifespan / 255
    })`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  };
}

//  QUIZZ
//  gérer le quiz
function submitQuiz() {
  var selectedAnswer = document.querySelector('input[name="capital"]:checked');
  if (selectedAnswer) {
    var answer = selectedAnswer.value;
    var correctAnswer = "Paris";
    var result = answer === correctAnswer ? "correct" : "incorrect";

    // Enregistrer l'interaction dans SCORM
    recordInteraction("Q1", answer, correctAnswer, result);

    // Envoyer un score basé sur la réponse
    var score = result === "correct" ? 100 : 0;
    sendScore(score);

    // Afficher le résultat
    debugLog("Vous avez répondu : " + answer + ". Résultat : " + result);
  } else {
    alert("Veuillez sélectionner une réponse.");
  }
}

function recordInteraction(interactionId, response, correctResponse, result) {
  if (scormAPI) {
    scormAPI.LMSSetValue("cmi.interactions.0.id", interactionId);
    scormAPI.LMSSetValue("cmi.interactions.0.student_response", response);
    scormAPI.LMSSetValue(
      "cmi.interactions.0.correct_responses.0.pattern",
      correctResponse
    );
    scormAPI.LMSSetValue("cmi.interactions.0.result", result);
    scormAPI.LMSCommit(""); // Enregistre les données dans Moodle
    debugLog(
      "Interaction enregistrée : " +
        interactionId +
        ", Réponse : " +
        response +
        ", Résultat : " +
        result
    );
  }
}

//  sauvegarder la progression
function saveProgress(step) {
  if (scormAPI) {
    scormAPI.LMSSetValue("cmi.core.lesson_location", step);
    scormAPI.LMSCommit(""); // Enregistre la progression
    debugLog("Progression sauvegardée : étape " + step);
  }
}

//  charger la progression
function loadProgress() {
  if (scormAPI) {
    var step = scormAPI.LMSGetValue("cmi.core.lesson_location");
    if (step) {
      debugLog("Reprise à l'étape : " + step);
      // Logique pour rediriger l'utilisateur vers l'étape sauvegardée
    } else {
      debugLog("Pas de progression sauvegardée, démarrage à l'étape 1.");
    }
  }
}

//  Temps total dans la leçon
function sendTotalTime() {
  if (scormAPI) {
    var startTime = new Date(); // Enregistre l'heure de début de session

    window.onbeforeunload = function () {
      var endTime = new Date();
      var totalTime = Math.floor((endTime - startTime) / 1000); // Temps en secondes

      var hours = Math.floor(totalTime / 3600);
      var minutes = Math.floor((totalTime % 3600) / 60);
      var seconds = totalTime % 60;

      var formattedTime =
        hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0");

      scormAPI.LMSSetValue("cmi.core.total_time", formattedTime);
      scormAPI.LMSCommit(""); // Enregistre le temps total
      debugLog("Temps total envoyé : " + formattedTime);
    };
  }
}
