var tds = document.getElementsByTagName("td");
var trs = document.getElementsByTagName("tr").length;
var mark = ["A", "B", "C", "D", "E", "F", "G"];
var attacked = []; // 공격했었던 좌표를 push 로 받음.
var regChk = /^[A-G]{1}[0-6]{1}$/; // A0 ~ G6 좌표계가 맞는지 확인.
var audioEft = document.createElement('audio');
var audioBGM = document.createElement('audio');


window.onload = function() {
    soundBGM();
    tableDBinsert(); // 테이블의 ID, VALUE 값을 매칭.
    model.numShips = prompt("길이 3의 전투함을 몇대 생성하시겠습니까?");

    while (model.shipsArray.length < model.numShips * model.shipLength) {
        model.createShip(); // prompt 로 입력한 전투함의 생성 수 값 만큼 맵에 배치
    }


    function tableDBinsert() {
        var line = ""; // 라인별 정보를 종합하고, 모은 정보를 tds에 담음.
        var size;

        for (var i = 0; i < tds.length; i++) {
            size = i % trs;
            // 격자판 라인 정보를 판단하고, 자동적으로 id 및 value 지정
            // ex) 7*7 그리드 격자판 일 때 \^[A-G]{1}[0-6]{1}$\
            if (i < trs) {
                line = mark[0] + size; // "A"
                tds[i].value = line;
                tds[i].setAttribute("id", line);
            } else if (i < trs * 2) {
                line = mark[1] + size; // "B"
                tds[i].value = line;
                tds[i].setAttribute("id", line);
            } else if (i < trs * 3) {
                line = mark[2] + size; // "C"
                tds[i].value = line;
                tds[i].setAttribute("id", line);
            } else if (i < trs * 4) {
                line = mark[3] + size; // "D"
                tds[i].value = line;
                tds[i].setAttribute("id", line);
            } else if (i < trs * 5) {
                line = mark[4] + size; // "E"
                tds[i].value = line;
                tds[i].setAttribute("id", line);
            } else if (i < trs * 6) {
                line = mark[5] + size; // "F"
                tds[i].value = line;
                tds[i].setAttribute("id", line);
            } else {
                line = mark[6] + size; // "G"
                tds[i].value = line;
                tds[i].setAttribute("id", line);
            } // if END
        } // for END
    } // tableDBinsert END
} /////////////////// window.onload END //////////////////////


var ctrl = {
    guessCnt: 0,
    sunkCnt: 0,
    hintCnt: 0,
    text: function() {
        return this.sunkCnt / this.guessCnt >= 1 ? "놀랍군요! 엄청난 감각 입니다." :
            this.sunkCnt / this.guessCnt >= 0.8 ? "상당한 실력이군요." :
            this.sunkCnt / this.guessCnt >= 0.6 ? "조금 할 줄 아시는군요?" :
            this.sunkCnt / this.guessCnt >= 0.4 ? "위험했어요." : "맙소사, 살아남은게 다행입니다."
    },
    text2: function() {
        return this.hintCnt == 0 ? "힌트를 사용하지 않다니, 대단합니다." :
            this.hintCnt >= (model.shipsArray.length / 3) ? "힌트를 적절히 썼군요." : "큰 도움없이 잘했습니다."
    },
    destroyChk: function() {
        if (this.sunkCnt == model.shipsArray.length) {
            model.isSunk = true;
            alert(
                "모든 적 전함을 침몰 시켰습니다.\n" +
                "파괴한 전함 : " + this.sunkCnt + "대\n" +
                "명중률 : " + Math.floor((this.sunkCnt / this.guessCnt) * 100) + "%\n" +
                "힌트 : " + ctrl.hintCnt + "회 사용[" + this.text2() + "]\n" +
                "평판 : " + this.text()
            );
        }
    } // destroyChk END
} ////////////////////////// ctrl End /////////////////////////////////


var view = {
    hints: [],
    hintTurn: 0,
    displayMessage: function(msg) {
        document.getElementById("messageArea").innerHTML = msg;
    },

    displayHit: function(location) {
        document.getElementById(location).setAttribute("class", "hit");
    },

    displayMiss: function(location) {
        document.getElementById(location).setAttribute("class", "miss");
    },
    hint: function() {

        for (var i = 0; i < model.shipsArray.length; i++) {
            if (regChk.test(model.shipsArray[i])) {
                this.hints.push(model.shipsArray[i]);
            }
        }

        if (ctrl.hintCnt < model.shipsArray.length / 3) {
            if (this.hintTurn === 0) {
                var randomHint = Math.floor(Math.random() * this.hints.length);
                ctrl.hintCnt++;
                this.hintTurn++; // 한 턴에 한번만 힌트를 쓸 수 있도록 처리.
                document.getElementById(this.hints[randomHint]).setAttribute("class", "hint");
            } else {
                alert("기회가 남아 있다면, 다음 턴에 사용할 수 있습니다.")
            }
        } else {
            alert("이미 힌트는 많이 사용하셨는데요?");
        }
    }

} // View End


var model = {
    numShips: 0,
    shipLength: 3,
    shipsArray: [],
    isSunk: false,
    flag: false,
    fire: function(guessPoint) {
        this.flag = false;
        for (var i = 0; i < this.shipsArray.length; i++) {
            if (this.shipsArray[i] == guessPoint) {
                alert("적중 했습니다 !");
                this.shipsArray[i] = "hit";
                view.displayHit(guessPoint);
                view.displayMessage("전함 격침 !");
                ctrl.sunkCnt++;
                this.flag = true;
            }
        }

        if (!this.flag) {
            this.shipsArray[i] = "miss";
            view.displayMiss(guessPoint);
            view.displayMessage("실패");
            alert("이곳이 아닌가 봅니다.");
        }
        attacked.push(guessPoint);
        view.hints.length = 0; // 힌트배열에 push된 값 초기화.
        view.hintTurn = 0; // 1회 공격 후 힌트를 사용할 수 있도록 설정.
        ctrl.destroyChk();
    },
    createShip: function() {
        var ranY = Math.floor(Math.random() * trs);
        var ranX = Math.floor(Math.random() * trs);
        var ranZ = Math.floor(Math.random() * 2); // 가로 세로 선택
        var ran4 = Math.floor(Math.random() * 4); // 배치될 수 없는 우측하단 2x2 일 때 판단
        var header, middle, back;

        if (ranY >= trs - 2 && ranX >= trs - 2) { // 우측 하단 2x2 부분에 배치 되었을 때
            if (ran4 == 0) {
                header = mark[trs - 3] + (trs - 2);
                middle = mark[trs - 2] + (trs - 2);
                back = mark[trs - 1] + (trs - 2);
            } else if (ran4 == 1) {
                header = mark[trs - 2] + (trs - 3);
                middle = mark[trs - 2] + (trs - 2);
                back = mark[trs - 2] + (trs - 1);
            } else if (ran4 == 2) {
                header = mark[trs - 1] + (trs - 3);
                middle = mark[trs - 1] + (trs - 2);
                back = mark[trs - 1] + (trs - 1);
            } else {
                header = mark[trs - 3] + (trs - 1);
                middle = mark[trs - 2] + (trs - 1);
                back = mark[trs - 1] + (trs - 1);
            }
        } else if (ranY >= trs - 2) { // y축 좌표값부터 하단 3칸에 전함 배치가 불가할 때
            header = mark[ranY] + (ranX);
            middle = mark[ranY] + (ranX + 1);
            back = mark[ranY] + (ranX + 2);
        } else if (ranX >= trs - 2) { // x축 좌표값부터 우측 3칸에 전함 배치가 불가할 때
            header = mark[ranY] + (ranX);
            middle = mark[ranY + 1] + (ranX);
            back = mark[ranY + 2] + (ranX);
        } else {
            if (ranZ == 0) { // 자유 배치 가로
                header = mark[ranY] + (ranX);
                middle = mark[ranY] + (ranX + 1);
                back = mark[ranY] + (ranX + 2);
            } else { // 자유 배치 세로
                header = mark[ranY] + (ranX);
                middle = mark[ranY + 1] + (ranX);
                back = mark[ranY + 2] + (ranX);
            }
        }

        this.shipsArray.push(header, middle, back);

        for (var i = 0; i < this.shipsArray.length; i++) {
            for (var j = 0; j < this.shipsArray.length; j++) {
                if (this.shipsArray[i] == this.shipsArray[j]) {
                    if (i == j) {
                        continue;
                    }

                    this.shipsArray.length = 0; // 중복된 배치가 있을 시 초기화
                } // if END
            } // in for END
        } // out for END
    } // createShip function END
} // Model End





function inputChk() {
    var guessPoint = document.getElementById("guessInput").value;
    for (var i = 0; i < attacked.length; i++) {
        if (attacked[i] == guessPoint) {
            return alert("이미 공격했던 좌표 입니다.");
        }
    }

    if (!regChk.test(guessPoint)) {
        alert("형식에 맞게 좌표계를 입력해주세요.");
    } else {
        alert("입력한 좌표로 공격합니다!");
				soundEft();
        ctrl.guessCnt++;
        model.fire(guessPoint);
    }
} // inputChk END

function targetCheck(event) { // table의 타겟의 value 값을 가져오고 input에 값 할당
    document.getElementById("guessInput").value = event.target.value;
} // targetCheck END

function giveUp() { // 포기 버튼을 눌렀을 때 모든 전함의 위치를 표시.
    for (var i = 0; i < model.shipsArray.length; i++) {
        document.getElementById(model.shipsArray[i]).setAttribute("class", "giveup");
    }
}

function soundEft(){
		audioEft.style.visibility = 'hidden';
		audioEft.style.position = 'absolute';
		document.body.appendChild(audioEft);
		audioEft.getAttribute('play');
		audioEft.src = "./sound/boom.mp3";
		audioEft.play();
}

function soundBGM(){
		audioBGM.style.visibility = 'hidden';
		audioBGM.style.position = 'absolute';
		document.body.appendChild(audioBGM);
		audioBGM.getAttribute('play');
		audioBGM.src = "./sound/bgm.mp3";
		audioBGM.play();
}
