class Question {
    constructor(text, choices, answer, image){
        this.text = text;
        this.choices = choices;
        this.answer = answer;
        this.image = image;
    }

    isCorrectAnswer(choice) {
        return this.answer === choice;
    }
}

class Quiz {
    constructor(questions){
        this.score = 0;
        this.questions = questions;
        this.currentQuestionIndex = 0;
    }

    getCurrentQuestion(){
        return this.questions[this.currentQuestionIndex];
    }

    guess(idGuess, answer){
        if (this.getCurrentQuestion().isCorrectAnswer(answer)){
            this.score++;
            document.getElementById(idGuess).style.background = "green";
        } else {
            // affiche la mauvaise réponse en rouge
            document.getElementById(idGuess).style.background = "red";
            // affiche la bonne réponse en vert en récupérant l'indice de la bonne réponse
            let goodAnswer = this.questions[this.currentQuestionIndex].answer;
            let indexGoodAnswer = this.questions[this.currentQuestionIndex].choices.indexOf(goodAnswer);
            document.getElementById("guess"+indexGoodAnswer).style.background = "green";
        }
        this.currentQuestionIndex++;
    }

    hasEnded(){
        return this.currentQuestionIndex >= this.questions.length;
    }
}

const display = {
    elementShown: function(id, text) {
        let element = document.getElementById(id);
        element.innerHTML = text;
    },
    endQuiz: function(quiz) {
        let endQuizHTML = `
            <h1>Fin du quiz</h1>
            <h3>Vous avez obtenu un score de ${quiz.score}/${quiz.questions.length}</h3>`;
        this.elementShown("question", endQuizHTML);
        this.elementShown("progress", "");
        this.elementShown("choix", "");
        this.elementShown("image", "");
    },
    images: function(quiz){
        if (quiz.getCurrentQuestion().image === null){
            this.elementShown("image", "");
        } else {
            this.elementShown("image", `<img src=\"${quiz.getCurrentQuestion().image}\">`);
        }
    },
    question: function(quiz) {
        this.elementShown("question", quiz.getCurrentQuestion().text)
    },
    choices: function(quiz) {
        let choices = quiz.getCurrentQuestion().choices;

        // bloque les boutons lorsque l'utilisateur a choisi une réponse
        blockButtons = (quiz) => {
            if (quiz.currentQuestionIndex < quiz.questions.length){
                for(let i = 0; i < quiz.getCurrentQuestion().choices.length; i++){
                    document.getElementById("guess"+i).onclick = function(){}
                }
            }
        }

        //nextbutton: affiche le bouton "Suivant" pour passer à la question suivante avec un certain style css 
        //puis il disparait le temps que l'utilisateur réponde à la question suivante et réapparait
        nextbutton = (quiz) => {
            blockButtons(quiz);
            this.elementShown("nextQuestion", `<button id="next" class="btn">Suivant</button>`);
            let button = document.getElementById("next");
            button.style.cssText = `
            width: 80px;
            height: 50px;
            border-radius: 5px;
            border: none;
            margin: 0.4rem;
            outline: none;
            background: #dfe4ea;
            user-select: none;
            font-weight: 600;
            font-size: 1.3rem;
            margin-top: 30px;
            `
            document.getElementById("next").onclick = function() {
                quizApp(quiz);
                display.elementShown("nextQuestion", "");
            }
        }

        //guessHandler: gère le clique
        guessHandler = (id, guess) => {
            document.getElementById(id).onclick = function() {
                nextbutton(quiz);
                // console.log(`id = ${id}\nguess = ${guess}`)
                quiz.guess(id, guess);
            }
        }

        for(let i = 0; i < choices.length; i++){
            this.elementShown("choice"+i, choices[i]);
            guessHandler("guess"+i, choices[i]);
            document.getElementById("guess"+i).style.background = "#dfe4ea";
        }
    },
    progress: function(quiz){
        let currentQuestionIndex = quiz.currentQuestionIndex + 1;
        this.elementShown("progress", "Question " + currentQuestionIndex + "/" + quiz.questions.length);
    }
}

// quizApp: contrôle le flux d'affichage du quiz et vérifie les réponses données par l'utilisateur.
quizApp = (quiz) => {
    if (quiz.hasEnded()){
        display.endQuiz(quiz);
    } else {
        display.images(quiz);
        display.question(quiz);
        display.choices(quiz);
        display.progress(quiz);
    }
}

let quiz = new Quiz([
    new Question("Quel est la capitale de la France?", ["Paris", "Marseille", "Orléans", "Versailles"], "Paris", "images/paris.jpg"),
    new Question("Quel pays a quitté l'Union Européenne en 2020?", ["La France", "L'Italie", "Le Royaume-Uni", "La Pologne"], "Le Royaume-Uni", null),
    new Question("Qui a remporté la ligue des nations 2021?", ["La France", "L'Espagne", "L'Italie", "La Belgique"], "La France", null)
        
])

quizApp(quiz)