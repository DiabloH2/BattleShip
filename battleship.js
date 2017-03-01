window.onload = function(){
	var tds = document.getElementsByTagName("td");
	var trs = document.getElementsByTagName("tr").length;
	var mark= ["A","B","C","D","E","F","G"];
	var shipsArray = [];


////////////////////// View           //////////////////
	var view = {
			displayMessage : function(msg){
				document.getElementById("messageArea").innerHTML=msg;
			},
			displayHit : function(location){
				document.getElementById(location).setAttribute("class", "hit");
			},

			displayMiss : function(location){
				document.getElementById(location).setAttribute("class", "miss");
			}
	}
////////////////////// View End       //////////////////




////////////////////// Model         ///////////////////
	var model = {
				boardSize : trs
			,	numShips : 3
			,	shipLength : 3
			,	shipsSunk : 0
			, createShip : function(){
				var ranY = Math.floor( Math.random() * trs );
				var ranX = Math.floor( Math.random() * trs );
				var ranZ = Math.floor( Math.random() * 2 );		// 가로 세로 선택
				var ran4 = Math.floor( Math.random() * 4 );		// 배치될 수 없는 우측하단 2x2 일 때 판단
				var header, middle, back;

				if( ranY >= trs-2 && ranX >= trs-2 ){ // 우측 하단 2x2 부분에 배치 되었을 때
						if(ran4 == 0){
							header = mark[trs-3]+(trs-2);
							middle = mark[trs-2]+(trs-2);
							back = mark[trs-1]+(trs-2);
						}else if(ran4 == 1){
							header = mark[trs-2]+(trs-3);
							middle = mark[trs-2]+(trs-2);
							back = mark[trs-2]+(trs-1);
						}else if(ran4 == 2){
							header = mark[trs-1]+(trs-3);
							middle = mark[trs-1]+(trs-2);
							back = mark[trs-1]+(trs-1);
						}else{
							header = mark[trs-3]+(trs-1);
							middle = mark[trs-2]+(trs-1);
							back = mark[trs-1]+(trs-1);
						}
				}else if( ranY >= trs-2 ){	// y축 좌표값부터 하단 3칸에 전함 배치가 불가할 때
					header = mark[ranY]+(ranX);
					middle = mark[ranY]+(ranX+1);
					back = mark[ranY]+(ranX+2);
				}else if( ranX >= trs-2 ){  // x축 좌표값부터 우측 3칸에 전함 배치가 불가할 때
					header = mark[ranY]+(ranX);
					middle = mark[ranY+1]+(ranX);
					back = mark[ranY+2]+(ranX);
				}else{
						if(ranZ == 0){	// 자유 배치 가로
							header = mark[ranY]+(ranX);
							middle = mark[ranY]+(ranX+1);
							back = mark[ranY]+(ranX+2);
						}else{					// 자유 배치 세로
							header = mark[ranY]+(ranX);
							middle = mark[ranY+1]+(ranX);
							back = mark[ranY+2]+(ranX);
						}
				}

				shipsArray.push(header, middle, back);

				for(var i=0; i<shipsArray.length; i++){
					for(var j=0; j<shipsArray.length; j++){

						if(shipsArray[i]==shipsArray[j]){
							if(i==j){
								continue;
							}
							console.log("중복된 배치가 확인되어 초기화 합니다.");
							shipsArray.length = 0;
						}
					} // in for END
				} // out for END
			} // createShip function END
		}
////////////////////// Model End     ///////////////////



////////////////////// Controller     //////////////////
////////////////////// Controller End //////////////////






function tableDBinsert(){
		var line = ""; 		// 라인별 정보를 종합하고, 모은 정보를 tds에 담음.
		var size;

		for(var i=0; i<tds.length; i++){
			size = i%trs; 	// 격자판 라인 정보를 판단하고, 자동적으로 id 및 value 지정  ex) 7*7 그리드 격자판

			if( i < trs ){
				line = "A"+size;
				tds[i].value = line;
				tds[i].setAttribute("id",line);
			}else if( i < trs * 2 ){
				line = "B"+size;
				tds[i].value = line;
				tds[i].setAttribute("id",line);
			}else if( i < trs * 3 ){
				line = "C"+size;
				tds[i].value = line;
				tds[i].setAttribute("id",line);
			}else if( i < trs * 4 ){
				line = "D"+size;
				tds[i].value = line;
				tds[i].setAttribute("id",line);
			}else if( i < trs * 5 ){
				line = "E"+size;
				tds[i].value = line;
				tds[i].setAttribute("id",line);
			}else if( i < trs * 6 ){
				line = "F"+size;
				tds[i].value = line;
				tds[i].setAttribute("id",line);
			}else{
				line = "G"+size;
				tds[i].value = line;
				tds[i].setAttribute("id",line);
			} // if END
		} // for END
	} // tableDBinsert END


	tableDBinsert(); // 테이블의 ID, VALUE 값을 매칭.
	model.numShips = prompt("길이 3의 전투함을 몇대 생성하시겠습니까?");

	while( shipsArray.length < model.numShips * model.shipLength ){
		model.createShip();
	}

	document.getElementById("list").innerHTML=shipsArray;
	for(var i=0; i<shipsArray.length; i++){
		document.getElementById(shipsArray[i]).setAttribute("class","hit");
	} // 디버그
} // window.onload END


function targetCheck(event){	// 타겟의 value 값을 가져옴.
	document.getElementById("guessInput").value=event.target.value;
}
