$(document).ready(function() {
    let username = ""; //variable to store username
   
    const questions = [
        {
            question: "Which animal is the closest living relative to the T-Rex?",
            choices: ["Cat", "Ostrich", "Chicken", "Dolphin"],
            answer: "Chicken",
            hint: "Chickens"
        },
        {
            question: "In the Great Emu War of 1932, who won?",
            choices: ["The Australian military", "The emus"],
            answer: "The emus",
            hint: "the emus lol"
        },
        {
            question: "Which country invented Hawaiian pizza?",
            choices: ["Hawaii", "Italy", "Canada", "England"],
            answer: "Canada",
            hint: "Canada!"
        },
        {
            question: "How do lizards communicate?",
            choices: ["Making sounds", "Blinking", "Doing push-ups"],
            answer: "Doing push-ups",
            hint: "doing push-ups"
        },
        {
            question: "Peanuts are a type of nut.",
            choices: ["True", "False"],
            answer: "False",
            hint: "false"
        }
    ];

    let timerInterval;
    let timerSeconds = 0;

    function startTimer() {
        timerInterval = setInterval(function() { //function to incremenet timerSeconds every second
            timerSeconds++;
            updateTimer(); //update timer display
        }, 1000); //repeat every second
    }

    // function to update timer display
    function updateTimer() {
        $('#timer').text(formatTime(timerSeconds)); //update text of #timer with formatted time
    }

    // Function to format time as MM:SS
    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60); //calculating the minutes
        let remainingSeconds = seconds % 60; //calculating seconds
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`; //if remaining seconds < 10, return 0, else empty string
    }

    //this function loads questions and initialises the quiz
    function loadQuestions() {
        let delay = 1000; // delay for first question
        let colorIndex = 0; // initialising the colour index
    
        //colours for the card headers
        const colors = ["#caffbf", "#ecbcfd", "#baf2e9", "#fad2e1", "#fff185"];
    
        function fadeInCard() { //function to fade in each card sequentially 
            $('.card').eq(colorIndex).animate({
                opacity: 1, //fade in 
                top: 0 //move card to its original position
            }, 500); //the animation duration
    
            colorIndex++; // go to the next card
            
            if (colorIndex < questions.length) {
                setTimeout(fadeInCard, 100);//delay for the next card to fade in
            }
        }
    
        // loop through each question and create the card
        questions.forEach(function(question, index) {
            // get the color for the current card header based on the index
            let cardHeaderColor = colors[index % colors.length]; // go through colours without duplicates (i.e: 0 % 5 = index 0, 1 % 5 = index 1 etc)
    
            // make the html for each question card with the assigned header color
            let questionCard = `
                <div class="card mb-3" style="opacity:0; position:relative; top:-20px;"> <!-- Initially hide the card -->
                    <div class="card-header" style="background-color: ${cardHeaderColor};">
                        <div class="text-center">${index + 1}. ${question.question}</div>
                    </div>
                    <div class="card-body">
                        <form id="question${index}"> <!--form for current question-->
                            <!--iterates over each choice in questions.choices array and creates the html elements -->
                            ${question.choices.map((choice, i) => `
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="question${index}" id="question${index}_choice${i}" value="${choice}">
                                    <label class="form-check-label" for="question${index}_choice${i}">
                                        ${choice}
                                    </label>
                                </div>
                            `).join("")} <!--.join() concatenates the elements for each choice into string-->
                        </form>
                        <a href="#" class="hint">[HINT]</a>
                        <div class="hint-text" style="display: none;">${question.hint}</div>
                    </div>
                </div>
            `;
            $('#questions').append(questionCard); //appending to the questions container
        });
    
        // call fadeInCard after initial delay
        setTimeout(fadeInCard, delay);
    
        //event listeners for hint
        $('.hint').mouseover(function() {
            $(this).next('.hint-text').fadeIn(); //show hint on hover
        }).mouseout(function() {
            $(this).next('.hint-text').fadeOut(); //hide hint when mouse isnt hovering over
        });
    }
    

   // Function to calculate score
    function calculateScore() {
        let correctAnswers = 0; //count set to 0
        questions.forEach(function(question, index) {
            let selectedAnswer = $(`input[name='question${index}']:checked`).val(); //get the selected answer
            if (selectedAnswer === question.answer) {
                correctAnswers++; //if correct, increment counter
            }
        });
        return correctAnswers;
    }

    function animateScoreDisplay() {
        $('#scoreMessage').fadeIn(3000); //score message fades in over 3 seconds
        
    }

    $('#beginQuiz').click(function() { //when the begin quiz btn is clicked, this function is executed
        username = $('#username').val().trim(); 
        if (username === "") {
            alert("Please enter your name.");
            return; //handling if username isnt entered
        }
        //hiding the intial page over 1 second
        $('#initialPage').fadeOut(1000, function() { 
            $(this).remove(); // Remove the initial page from the DOM
            $('#welcomeMessage').text("Welcome, " + username + ". Good luck!");
            $('#quizPage').fadeIn(500); // Show the quiz page after 0.5 seconds
            startTimer();
            loadQuestions();
            displayResults(0, username); 
        });
    });
    
    function displayResults(score) {
        const timeTaken = formatTime(timerSeconds);
        let message = "";
        if (score === 5) {
            message = `<span class="highlight-pink">${username}!</span><br><span class="highlight-pink">You scored ${score}/${questions.length}. Perfect!</span><br><span class="highlight-green">You finished in ${timeTaken} seconds!</span>`;
            // flash timer results and message 10 times rapidly if perfect score
            for (let i = 0; i < 10; i++) {
                setTimeout(function() {
                    $('#timerResults').fadeIn(100).fadeOut(100);
                    $('#scoreMessage').fadeOut(100).fadeIn(100);
                }, i * 200); 
            }
        } else if (score === 0) {
            message = `<span class="highlight-pink">${username}!</span><br><span class="highlight-pink">You scored ${score}/${questions.length}. You suck! (jk)</span><br><span class="highlight-green">You finished in ${timeTaken} seconds!</span>`;
        } else {
            message = `<span class="highlight-pink">${username}!</span><br><span class="highlight-pink">You scored ${score}/${questions.length}.</span><br><span class="highlight-green">You finished in ${timeTaken} seconds!</span>`;
        }
        $('#scoreMessage').html(message);
        $('#usernameDisplay').html(username + "!").fadeIn(3000);
        $('#scoreMessage').fadeIn(3000);
    }
    

    $('#submitAnswers').click(function() {
        //stop the timer
        clearInterval(timerInterval);
    
        // store the score total
        let score = calculateScore();
    
        // send to the top of the page 
        $('html, body').animate({ scrollTop: 0 }, 'slow'); // '0' pixels from the top (slowly)
    
        // show score underneath the timer
        setTimeout(function() {
            $('#scoreDisplay').text(`Your score is: ${score} out of ${questions.length}`).fadeIn();
        }, 1000); 
    
        // show results modal after 3 seconds
        setTimeout(function() {
            $('#resultsModal').modal('show');
            displayResults(score);
        }, 3000);
        animateScoreDisplay();
    });   
});
