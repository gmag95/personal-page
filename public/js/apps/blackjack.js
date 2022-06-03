let balance = 100;

let current_bet = undefined;

const suits_comb = ["club", "diamond", "heart", "spade"];

let suits=[];

let ace_reduce_player = 0;

let ace_reduce_dealer = 0;

let new_row = undefined;

let new_col = undefined;

let draw_count = 1;

for (let i=0; i<4; i++) {
    for (let j=0; j<14; j++) {
        suits.push(suits_comb[i]);
    }
}

const figures_comb = ["A",1,2,3,4,5,6,7,8,9,10,"J","Q","K"];

let figures=[];

for (let i=0; i<4; i++) {
    figures=figures.concat(figures_comb);
}

let hand_balance = [0,0];

function updateNumbers () {
    current_bet=parseInt(document.querySelector("#bet_number").value)
    document.querySelector("#current_bet").innerText=`Current bet: ${current_bet}`;
    balance=balance-current_bet;
    document.querySelector("#account_balance").innerText=`Account balance: ${balance}`;
}

function addCard (side, hidden) {
    let card = document.createElement("span");
    card.classList.add("card");
    let rand_num = Math.floor(Math.random()*figures.length);
    let number_top = document.createElement("div");
    number_top.classList.add("number_top");
    number_top.innerText=figures[rand_num];
    let number_bottom = document.createElement("div");
    number_bottom.classList.add("number_bottom");
    number_bottom.innerText=figures[rand_num];
    let logo_top = document.createElement("i");
    logo_top.classList.add("bi", `bi-suit-${suits[rand_num]}-fill`, "logo_top");
    let logo_bottom = document.createElement("i");
    logo_bottom.classList.add("bi", `bi-suit-${suits[rand_num]}-fill`, "logo_bottom");
    logo_top.fig=suits[rand_num];
    document.querySelector(`#${side}_cards`).appendChild(card);
    document.querySelector(`#${side}_cards > .card:nth-last-of-type(1)`).appendChild(number_top);
    document.querySelector(`#${side}_cards > .card:nth-last-of-type(1)`).appendChild(logo_top);
    document.querySelector(`#${side}_cards > .card:nth-last-of-type(1)`).appendChild(logo_bottom);
    document.querySelector(`#${side}_cards > .card:nth-last-of-type(1)`).appendChild(number_bottom);
    addStyles(rand_num, number_top, logo_top, number_bottom, logo_bottom, hidden, card);
    if (side=="player") {checkHand(0, rand_num);} else {checkHand(1, rand_num);}
    if (hidden==false) {
        message(side, suits[rand_num], figures[rand_num]);
    }
    figures.splice(rand_num, 1);
    suits.splice(rand_num, 1);
}

function addStyles (rand_num, number_top, logo_top, number_bottom, logo_bottom, hidden, card) {
    if (suits[rand_num] == "diamond" || suits[rand_num] == "heart") {
        number_top.style.color="red";
        logo_top.style.color="red";
        logo_bottom.style.color="red";
        number_bottom.style.color="red";
    }
    if (hidden == true) {
        card.classList.add("hidden_card");
        number_top.classList.add("hidden");
        logo_top.classList.add("hidden");
        number_bottom.classList.add("hidden");
        logo_bottom.classList.add("hidden");
    }
}

function checkHand (side, rand_num) {
    if (figures[rand_num]=="A") {
        hand_balance[side]+=11;
    }
    else if (figures[rand_num]=="J" || figures[rand_num]=="Q" || figures[rand_num]=="K"){
        hand_balance[side]+=10;
    } else {
        hand_balance[side]+=figures[rand_num];
    }

    let count_ace=0;
    let side_name=undefined;

    if (side==0) {side_name="player"} else {side_name="dealer"}

    for (let x of document.querySelectorAll(`#${side_name}_cards > .card > .number_top`)) {
        if (x.innerText=="A") {count_ace++;}
    }

    if (side==0 && hand_balance[side]>21 && (hand_balance[side]+10*ace_reduce_player)-21<=count_ace*10) {
        while (hand_balance[side]>21) {
            hand_balance[side]-=10;
            ace_reduce_player++;
        }
    }

    if (side==1 && hand_balance[side]>21 && (hand_balance[side]+10*ace_reduce_dealer)-21<=count_ace*10) {
        while (hand_balance[side]>21) {
            hand_balance[side]-=10;
            ace_reduce_dealer++;
        }
    }
    
    updateScores(side);
    if (side==0 && hand_balance[0]>21) {
        gameEnd(0);
    }
}

function updateScores (side) {
    if (side==1 && document.querySelector("#dealer_cards > .card").classList.contains("hidden_card")==true && document.querySelectorAll("#dealer_cards > .card").length>1) {
        let first_number = document.querySelector("#dealer_cards > .card:nth-of-type(2) > .number_top").innerText;
        if (first_number == "A") {
            first_number=11;
        } else if (first_number == "J" || first_number == "Q" || first_number == "K") {
            first_number=10;
        }
        document.querySelector("#dealer_row span").innerText=`Dealer hand: ${first_number}`;
    } else if (side==1) {
        document.querySelector("#dealer_row span").innerText=`Dealer hand: ${hand_balance[1]}`;
    }
    else {
    document.querySelector("#player_row span").innerText=`Player hand: ${hand_balance[0]}`;
    }
}

function gameEnd(outcome) {

    document.querySelector("#end_row").style.display="flex";
    document.getElementById("hit_button").disabled=true;
    document.getElementById("stay_button").disabled=true;
    document.getElementById("double_button").disabled=true;

    if (outcome==0) {
        document.querySelector("#end_row > div").innerText="You lost the game";
        if (balance == 0) {
            document.getElementById("reset_button").disabled=true;
        }
    } else if (outcome==1) {
        document.querySelector("#end_row > div").innerText="You won the game";
        balance=balance+(current_bet*2);
    } else {
        document.querySelector("#end_row > div").innerText="It's a draw";
        balance+=current_bet;
    }
}

function reset() {
    document.querySelector("#start_row").style.display="flex";
    document.querySelector("#start_row > div").innerText=`Account balance: ${balance}`;
    document.querySelector("#end_row").style.display="none";
    document.querySelector("#decision_row").style.display="none";
    document.querySelector("#message_row").style.display="none";
    let to_delete = document.querySelectorAll("#dealer_cards .card");
    for (let x of to_delete) {
        x.remove();
    }
    to_delete = document.querySelectorAll("#player_cards .card");
    for (let x of to_delete) {
        x.remove();
    }
    to_delete = document.querySelectorAll("#message_row div");
    for (let x of to_delete) {
        x.remove();
    }
    hand_balance = [0,0];
    document.querySelector("#bet_number").max=balance;
    document.querySelector("#dealer_row span").innerText="Dealer hand: ";
    document.querySelector("#player_row span").innerText="Player hand: ";
    document.querySelector("#end_row > div").innerText="";
    document.querySelector("#message_row").style.overflowY="hidden";
    document.querySelector("#message_row").classList.remove("added_scroll");
    shuffleCards();
    ace_reduce_dealer=0;
    ace_reduce_player=0;
    draw_count=1;
}

function shuffleCards () {

    suits=[];

    for (let i=0; i<4; i++) {
        for (let j=0; j<14; j++) {
            suits.push(suits_comb[i]);
        }
    }
    
    figures=[];

    for (let i=0; i<4; i++) {
        figures=figures.concat(figures_comb);
    }
}

function dealerTurn () {
    document.querySelector("#dealer_cards > .card").classList.remove("hidden_card");
    for (let x of document.querySelectorAll("#dealer_cards > .card:first-of-type *")) {
        x.classList.remove("hidden");
    }
    document.querySelector("#dealer_row span").innerText=`Dealer hand: ${hand_balance[1]}`;
    message("dealer", document.querySelector(`#dealer_cards > .card > .logo_top`).fig, document.querySelectorAll(`#dealer_cards > .card > .number_top`)[0].innerText);
    while (hand_balance[1]<17) {
        addCard("dealer", false);
    }
    if (hand_balance[1]>21 || hand_balance[0]>hand_balance[1]) {
        gameEnd(1);
    } else if (hand_balance[0]<hand_balance[1]) {
        gameEnd(0);
    } else {
        gameEnd(2);
    }
}

function double () {
    if (balance>current_bet) {
    balance-=current_bet;
    document.querySelector("#current_bet").innerText=`Current bet: ${current_bet*2}`;
    current_bet*=2;
    document.querySelector("#account_balance").innerText=`Account balance: ${balance}`;
    addCard("player", false);
    if (document.querySelector("#end_row > div").innerText!="You lost the game") {
        console.log("Started the dealer part");
        dealerTurn();
    }
    }
}

function message(side, display_suit, display_figure) {
    document.querySelector("#message_row").style.display="flex";
    new_col = document.createElement("div");
    new_col.classList.add("col-5", "col-md-4", "d-flex", "justify-content-center", "my-1", "align-items-center");
    new_col.style.width="calc(100%*4/11)";
    new_col.innerText=`Number of cards drawn: ${draw_count}`;
    draw_count+=1;
    document.querySelector("#message_row").appendChild(new_col);
    new_col = document.createElement("div");
    new_col.classList.add("col-7", "col-md-7", "d-flex", "justify-content-center", "my-1", "align-items-center");
    new_col.style.width="calc(100%*7/11)";
    new_col.innerText=`The ${side} drew: ${display_figure} of ${display_suit}s`;
    document.querySelector("#message_row").appendChild(new_col);
    document.querySelector("#message_row").appendChild(new_col);
    if (document.querySelectorAll("#message_row > .col-md-4").length>3) {
        document.querySelector("#message_row").style.overflowY="scroll";
        document.querySelector("#message_row").classList.add("added_scroll");
        x = document.querySelector("#message_row");
        x.scrollTop = x.scrollHeight - x.clientHeight;
    }
}

document.querySelector("#hit_button").addEventListener("click", function () {addCard("player", false);});

document.querySelector("#stay_button").addEventListener("click", dealerTurn);

document.querySelector("#double_button").addEventListener("click", double);

document.querySelector("#reset_button").addEventListener("click", reset);

document.querySelector("#start_button").addEventListener("click", () => {
    if (document.querySelector("#bet_number").value<=balance) {
    updateNumbers();
    document.querySelector("#start_row").style.display="none";
    document.querySelector("#decision_row").style.display="flex";
    document.querySelector("#bet_number").value=10;
    addCard("player", false);
    addCard("player", false);
    addCard("dealer", true);
    addCard("dealer", false);
    document.getElementById("hit_button").disabled=false;
    document.getElementById("stay_button").disabled=false;
    if (balance>=current_bet) {
    document.getElementById("double_button").disabled=false;
    }
    }
});
