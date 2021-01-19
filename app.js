var HangulMode = true;
var hangul = [];
var hanStart = -1;
var num = 0;

function moveCursor(parentElt, x, y, type) {
    //파라미터의 xy는 클릭할때는 클릭한 마우스 위치고, 키보드 일때는 현재 커서의 위치
    
    var words;
    if(parentElt == undefined) {
        words = "";
    }
    else {
        words = parentElt.textContent
    }
    var range = document.createRange();
    var start = 0;
    var end = 0;
    switch (type) {
        case "click":
            return clickEvent();
        case "keyleft":
            return keyleft();
        case "keyright":
            return keyright();
        case "keyup":
            return keyup();
        case "keydown":
            return keydown();
        case "typing":
            return typingMove();
        case "paste":
            return paste();
        case "enter":
            return enter();
        case "backspace":
            return backspace();
    }

    function clickEvent() {     
        if($("#cursor").length) {
            var div = $("#cursor").detach();
            $(parentElt).closest("div.wrap").append(div);
        }
        else {
            var div = $("<div id='cursor'></div>");
            $(parentElt).closest("div.wrap").append(div);
        }

        for (var i = 0; i < words.length; i++) {
            start = i;
            end = start + 1;
            range.setStart(parentElt, start);
            range.setEnd(parentElt, end);
            var rects = range.getClientRects();
            var clickedRect = isClickInRects(rects);
            if (clickedRect) {
                if(i == 0 && clickedRect[1] == "left") {
                    range.setStart(parentElt, 0);
                    range.setEnd(parentElt, 1);
                    rects = range.getClientRects();
                    num = 0;
                    return [rects[0].left - 0.5, (rects[0].top+rects[0].bottom)/2];
                }
                else if(i == words.length - 1 && clickedRect[1] == "right") {
                    range.setStart(parentElt, words.length-1);
                    range.setEnd(parentElt, words.length);
                    rects = range.getClientRects();
                    num = words.length;
                    return [rects[0].right + 0.5, (rects[0].top+rects[0].bottom)/2];
                }

                if(clickedRect[1] == "left") {
                    range.setStart(parentElt, start-1);
                    range.setEnd(parentElt, end-1);
                    rects = range.getClientRects();
                    num = i;
                    return [rects[0].right + 0.5, (rects[0].top+rects[0].bottom)/2];
                }
                else if(clickedRect[1] == "right") {
                    range.setStart(parentElt, start);
                    range.setEnd(parentElt, end);
                    rects = range.getClientRects();
                    num = i+1;
                    return [rects[0].right + 0.5, (rects[0].top+rects[0].bottom)/2];
                }
            }
        }
    }
    
    function isClickInRects(rect) {
        r = rect[0];
        if (typeof r == "undefined") {
            return false;
        }
        if (r.left<x && (r.right+r.left)/2>=x && r.top<y && r.bottom>y) {
            return [r, "left"];
        }
        else if ((r.right+r.left)/2<x && r.right>x && r.top<y && r.bottom>y){
            return [r, "right"];
        }
        return false;
    }

    function keyleft() {
        if(num == 1) {
            start = num - 1;
            end = start + 1;
            range.setStart(parentElt, start);
            range.setEnd(parentElt, end);
            var rects = range.getClientRects();
            right = rects[0].left;
            num-=1;
            return [right-0.5, (rects[0].top+rects[0].bottom)/2];
        }
        else if (num > 1) {
            start = num - 1;
            end = start + 1;
            range.setStart(parentElt, start-1);
            range.setEnd(parentElt, end-1);
            var rects1 = range.getClientRects();
            left = rects1[0].right;
            range.setStart(parentElt, start);
            range.setEnd(parentElt, end);
            var rects2 = range.getClientRects();
            right = rects2[0].left;
            num-=1;
            if(rects1[0].top != rects2[0].top) {
                return [right - 0.5, (rects2[0].top+rects2[0].bottom)/2];
            }
            return [left + 0.5, (rects1[0].top+rects1[0].bottom)/2];
        }
        else {
            if(parentElt == undefined) {
                parentElt = $("#cursor")[0].parentNode;
            }
            if($(parentElt).closest("div.line").prev()) {
                var prevParentElt = 0;
                var prevParentEltDummy = 0;

                if($(parentElt).closest("div.line").prev().children(".wrap").children()[0].childNodes[0] == undefined) {
                    prevParentEltDummy = $(parentElt).closest("div.line").prev().children(".wrap").children()[0];
                }
                else {
                    prevParentElt = $(parentElt).closest("div.line").prev().children(".wrap").children()[0].childNodes[0];
                }
                var prevX = 0;
                var prevY = 0;
                if(prevParentElt == 0) {
                    num = 0;
                    start = 0;
                    end = start + 1;
                    prevParentEltDummy.innerHTML = "a";
                    console.log(prevParentEltDummy);
                    range.setStart(prevParentEltDummy.childNodes[0], start);
                    range.setEnd(prevParentEltDummy.childNodes[0], end);
                    rects = range.getClientRects();
                    nextX = rects[0].left - 0.5;
                    nextY = (rects[0].top + rects[0].bottom)/2;
                    prevParentEltDummy.innerHTML = "";
                    var div = $("#cursor").detach();
                    $(prevParentEltDummy.parentNode).append(div);
                    return [nextX, nextY];
                }
                else {
                    num = prevParentElt.textContent.length;
                    start = num - 1;
                    end = start + 1;
                    range.setStart(prevParentElt, start);
                    range.setEnd(prevParentElt, end);
                    rects = range.getClientRects();
                    prevX = rects[0].right + 0.5;
                    prevY = (rects[0].top + rects[0].bottom)/2;
                    var div = $("#cursor").detach();
                    $(prevParentElt.parentNode.parentNode).append(div);
                    return [prevX, prevY];
                }
            }
            else {
                return false;
            }
        }
    }
    
    function keyright() {
        if(num == words.length-1) {
            start = num;
            end = start + 1;
            range.setStart(parentElt, start);
            range.setEnd(parentElt, end);
            var rects = range.getClientRects();
            left = rects[0].right;
            num+=1;
            return [left+0.5, (rects[0].top+rects[0].bottom)/2];
        }
        else if (num < words.length-1) {
            start = num;
            end = start + 1;
            range.setStart(parentElt, start);
            range.setEnd(parentElt, end);
            var rects1 = range.getClientRects();
            left = rects1[0].right;
            range.setStart(parentElt, start + 1);
            range.setEnd(parentElt, end + 1);
            var rects2 = range.getClientRects();
            right = rects2[0].left;
            num+=1;
            if(rects1[0].top != rects2[0].top) {
                return [right - 0.5, (rects2[0].top+rects2[0].bottom)/2];
            }
            return [left + 0.5, (rects1[0].top+rects1[0].bottom)/2];
        }
        else {
            if(parentElt == undefined) {
                parentElt = $("#cursor")[0].parentNode;
            }
            if($(parentElt).parents(".line").next()) {
                var nextParentElt = 0;
                var nextParentEltDummy = 0;
                if($(parentElt).parents(".line").next().children(".wrap").children()[0].childNodes[0] == undefined) {
                    nextParentEltDummy = $(parentElt).parents(".line").next().children(".wrap").children()[0];
                }
                else {
                    nextParentElt = $(parentElt).parents(".line").next().children(".wrap").children()[0].childNodes[0];
                }
                var nextX = 0;
                var nextY = 0;
                num = 0;
                start = num;
                end = start + 1;
                if(nextParentElt == 0) {
                    nextParentEltDummy.innerHTML = "a";
                    range.setStart(nextParentEltDummy.childNodes[0], start);
                    range.setEnd(nextParentEltDummy.childNodes[0], end);
                    rects = range.getClientRects();
                    nextX = rects[0].left - 0.5;
                    nextY = (rects[0].top + rects[0].bottom)/2;
                    nextParentEltDummy.innerHTML = "";
                    var div = $("#cursor").detach();
                    $(nextParentEltDummy.parentNode).append(div);
                    return [nextX, nextY];
                }
                else {
                    range.setStart(nextParentElt, start);
                    range.setEnd(nextParentElt, end);
                    rects = range.getClientRects();
                    nextX = rects[0].left - 0.5;
                    nextY = (rects[0].top + rects[0].bottom)/2;
                    var div = $("#cursor").detach();
                    $(nextParentElt.parentNode.parentNode).append(div);
                    return [nextX, nextY];
                }
            }
            else {
                return false;
            }
        }
    }

    function keyup() {
        var prevParentElt = 0;
        var prevParentEltDummy = 0;
        if($("#cursor").closest("div.line").prev().children(".wrap").children()[0].childNodes[0] == undefined) {
            prevParentEltDummy = $("#cursor").closest("div.line").prev().children(".wrap").children()[0];
        }
        else {
            prevParentElt = $("#cursor").closest("div.line").prev().children(".wrap").children()[0].childNodes[0];
        }
        var prevX = 0;
        var prevY = 0;
        var distance = 1000;
        var presentX = 0;
        var presentY = 0;
        start = 0;
        end = 0;
        x = parseInt(x, 10);
        y = parseInt(y, 10);
        if(parentElt == undefined) {
            //엔터한 줄
            if(prevParentElt == 0) {
                prevParentEltDummy.innerHTML = "a";
                start = 0;
                end = start + 1;
                range.setStart(prevParentEltDummy.childNodes[0], start);
                range.setEnd(prevParentEltDummy.childNodes[0], end);
                var rects = range.getClientRects();
                prevX = rects[0].left - 0.5;
                prevY = (rects[0].top + rects[0].bottom) / 2;
                prevParentEltDummy.innerHTML = "";
                num = 0;
                var div = $("#cursor").detach();
                $(prevParentEltDummy.parentNode).append(div);
                return [prevX, prevY]
            }
            else {
                for (var i = 0; i < prevParentElt.textContent.length+1; i++) {
                    start = i;
                    end = start + 1;
                    if (i == 0) {
                        range.setStart(prevParentElt, start);
                        range.setEnd(prevParentElt, end);
                        var rects = range.getClientRects();
                        prevX = rects[0].left - 0.5;
                        prevY = (rects[0].top + rects[0].bottom) / 2; 
                    }
                    else {
                        range.setStart(prevParentElt, start-1);
                        range.setEnd(prevParentElt, end-1);
                        var rects = range.getClientRects();
                        left = rects[0].right;
                        prevX = left + 0.5;
                        prevY = (rects[0].top + rects[0].bottom) / 2; 
                    }
                    if(Math.sqrt((x-prevX)*(x-prevX) + (y-prevY)*(y-prevY)) < distance) {
                        distance = Math.sqrt((x-prevX)*(x-prevX) + (y-prevY)*(y-prevY));
                        presentX = prevX;
                        presentY = prevY;
                        num = i;
                    }
                }
                var div = $("#cursor").detach();
                $(prevParentElt.parentNode.parentNode).append(div);
                return [presentX, presentY];
            }
        }
        else {
            //span 내용있음
            //원래 한줄인데 길어져서 두줄처럼 된 경우
            for(var i = 0; i < parentElt.textContent.length+1; i++) {
                start = i;
                end = start + 1;
                if(parentElt.childNodes[0] != undefined) {
                    parentElt = parentElt.childNodes[0];
                }
                if (i == 0) {
                    range.setStart(parentElt, start);
                    range.setEnd(parentElt, end);
                    var rects = range.getClientRects();
                    prevX = rects[0].left - 0.5;
                    prevY = (rects[0].top + rects[0].bottom) / 2;
                }
                else {
                    range.setStart(parentElt, start-1);
                    range.setEnd(parentElt, end-1);
                    rects = range.getClientRects();
                    left = rects[0].right;
                    prevX = left + 0.5;
                    prevY = (rects[0].top + rects[0].bottom) / 2;
                }
                
                if(prevY < y) {
                    if(Math.abs(y-prevY)>10)  {
                        if(Math.sqrt((x-prevX)*(x-prevX) + (y-prevY)*(y-prevY)) < distance) {
                            presentX = prevX;
                            presentY = prevY;
                            distance = Math.sqrt((x-prevX)*(x-prevX) + (y-prevY)*(y-prevY));
                            num = i;
                        }
                    }
                }
            }
    
            if (distance != 1000) {
                return [presentX, presentY];
            }
    
            //엔터한 줄
            if(prevParentElt == 0) {
                prevParentEltDummy.innerHTML = " ";
                start = 0;
                end = start + 1;
                range.setStart(prevParentEltDummy.childNodes[0], start);
                range.setEnd(prevParentEltDummy.childNodes[0], end);
                var rects = range.getClientRects();
                prevX = rects[0].left - 0.5;
                prevY = (rects[0].top + rects[0].bottom) / 2; 
                prevParentEltDummy.innerHTML = "";
                num = 0;
                var div = $("#cursor").detach();
                $(prevParentEltDummy.parentNode).append(div);
                return [prevX, prevY];
            }
            else {
                for (var i = 0; i < prevParentElt.textContent.length+1; i++) {
                    start = i;
                    end = start + 1;
                    if (i == 0) {
                        range.setStart(prevParentElt, start);
                        range.setEnd(prevParentElt, end);
                        var rects = range.getClientRects();
                        prevX = rects[0].left - 0.5;
                        prevY = (rects[0].top + rects[0].bottom) / 2; 
                    }
                    else {
                        range.setStart(prevParentElt, start-1);
                        range.setEnd(prevParentElt, end-1);
                        var rects = range.getClientRects();
                        left = rects[0].right;
                        prevX = left + 0.5;
                        prevY = (rects[0].top + rects[0].bottom) / 2; 
                    }
                    
                    if(Math.sqrt((x-prevX)*(x-prevX) + (y-prevY)*(y-prevY)) < distance) {
                        distance = Math.sqrt((x-prevX)*(x-prevX) + (y-prevY)*(y-prevY));
                        presentX = prevX;
                        presentY = prevY;
                        num = i;
                    }
                }

                var div = $("#cursor").detach();
                $(prevParentElt.parentNode.parentNode).append(div);
        
                return [presentX, presentY];
            }
        }
    }

    function keydown() {
        var nextParentElt = 0;
        var nextParentEltDummy = 0;
        if ($("#cursor").closest("div.line").next().children(".wrap").children()[0].childNodes[0] == undefined) {
            nextParentEltDummy = $("#cursor").closest("div.line").next().children(".wrap").children()[0];
        }
        else {
            nextParentElt = $("#cursor").closest("div.line").next().children(".wrap").children()[0].childNodes[0];
        }
        var nextX = 0;
        var nextY = 0;
        var distance = 1000;
        var presentX = 0;
        var presentY = 0;
        start = 0;
        end = 0;
        x = parseInt(x, 10);
        y = parseInt(y, 10);
        //3가지, span, h, 내용유무; 내용유무 구분 후 span,h구분 ; span 내용없음 / span 내용있음, h내용있음, h내용없음

        if(parentElt == undefined) {
            //엔터한 줄
            if(nextParentElt == 0) {
                nextParentEltDummy.innerHTML = " ";
                start = 0;
                end = start + 1;
                range.setStart(nextParentEltDummy.childNodes[0], start);
                range.setEnd(nextParentEltDummy.childNodes[0], end);
                var rects = range.getClientRects();
                nextX = rects[0].left - 0.5;
                nextY = (rects[0].top + rects[0].bottom) / 2; 
                nextParentEltDummy.innerHTML = "";
                num = 0;
                var div = $("#cursor").detach();
                $(nextParentEltDummy.parentNode).append(div);
                return [nextX, nextY];
            }
            else {
                for (var i = 0; i < nextParentElt.textContent.length+1; i++) {
                    start = i;
                    end = start + 1;
                    if (i == 0) {
                        range.setStart(nextParentElt, start);
                        range.setEnd(nextParentElt, end);
                        var rects = range.getClientRects();
                        nextX = rects[0].left - 0.5;
                        nextY = (rects[0].top + rects[0].bottom) / 2; 
                    }
                    else {
                        range.setStart(nextParentElt, start-1);
                        range.setEnd(nextParentElt, end-1);
                        var rects = range.getClientRects();
                        left = rects[0].right;
                        nextX = left + 0.5;
                        nextY = (rects[0].top + rects[0].bottom) / 2; 
                    }
                    
                    if(Math.sqrt((x-nextX)*(x-nextX) + (y-nextY)*(y-nextY)) < distance) {
                        distance = Math.sqrt((x-nextX)*(x-nextX) + (y-nextY)*(y-nextY));
                        presentX = nextX;
                        presentY = nextY;
                        num = i;
                    }
                }
        
                var div = $("#cursor").detach();
                $(nextParentElt.parentNode.parentNode).append(div);
        
                return [presentX, presentY];
            }
        }
        else {
            //span 내용있음
            //원래 한줄인데 길어져서 두줄처럼 된 경우
            for(var i = 0; i < parentElt.textContent.length+1; i++) {
                start = i;
                end = start + 1;
                if (i == 0) {
                    range.setStart(parentElt, start);
                    range.setEnd(parentElt, end);
                    var rects = range.getClientRects();
                    nextX = rects[0].left - 0.5;
                    nextY = (rects[0].top + rects[0].bottom) / 2;
                }
                else {
                    range.setStart(parentElt, start-1);
                    range.setEnd(parentElt, end-1);
                    rects = range.getClientRects();
                    left = rects[0].right;
                    nextX = left + 0.5;
                    nextY = (rects[0].top + rects[0].bottom) / 2;
                }
                
                if(nextY > y) {
                    if(Math.abs(y-nextY)>10)  {
                        if(Math.sqrt((x-nextX)*(x-nextX) + (y-nextY)*(y-nextY)) < distance) {
                            presentX = nextX;
                            presentY = nextY;
                            distance = Math.sqrt((x-nextX)*(x-nextX) + (y-nextY)*(y-nextY));
                            num = i;
                        }
                    }
                }
            }
    
            if (distance != 1000) {
                return [presentX, presentY];
            }
            
            //엔터한 줄
            if(nextParentElt == 0) {
                nextParentEltDummy.innerHTML = " ";
                start = 0;
                end = start + 1;
                range.setStart(nextParentEltDummy.childNodes[0], start);
                range.setEnd(nextParentEltDummy.childNodes[0], end);
                var rects = range.getClientRects();
                nextX = rects[0].left - 0.5;
                nextY = (rects[0].top + rects[0].bottom) / 2; 
                nextParentEltDummy.innerHTML = "";
                num = 0;
                var div = $("#cursor").detach();
                $(nextParentEltDummy.parentNode).append(div);
                return [nextX, nextY];
            }
            else {
                for (var i = 0; i < nextParentElt.textContent.length+1; i++) {
                    start = i;
                    end = start + 1;
                    if (i == 0) {
                        range.setStart(nextParentElt, start);
                        range.setEnd(nextParentElt, end);
                        var rects = range.getClientRects();
                        nextX = rects[0].left - 0.5;
                        nextY = (rects[0].top + rects[0].bottom) / 2; 
                    }
                    else {
                        range.setStart(nextParentElt, start-1);
                        range.setEnd(nextParentElt, end-1);
                        var rects = range.getClientRects();
                        left = rects[0].right;
                        nextX = left + 0.5;
                        nextY = (rects[0].top + rects[0].bottom) / 2; 
                    }

                    if(Math.sqrt((x-nextX)*(x-nextX) + (y-nextY)*(y-nextY)) < distance) {
                        distance = Math.sqrt((x-nextX)*(x-nextX) + (y-nextY)*(y-nextY));
                        presentX = nextX;
                        presentY = nextY;
                        num = i;
                    }
                }
            }
            
            
            var div = $("#cursor").detach();
            $(nextParentElt.parentNode.parentNode).append(div);

            return [presentX, presentY];
        }
    }

    function typingMove() {
        start = num;
        end = start + 1;
        var a = $("#cursor").prev()[0].childNodes[0]; // 왜인지 parentElt가 안먹힘 ㅠㅠ 그래서 임시로 막아놓음
        range.setStart(a, start);
        range.setEnd(a, end);
        var rects = range.getClientRects();
        var left = rects[0].right;
        num+=1;
        return [left+0.5, (rects[0].top+rects[0].bottom)/2];
    }

    //얘만 x에 문자열 길이가 담겨있음
    function paste() {
        num+=x;
        start = num - 1;
        end = start + 1;
        var a = $("#cursor").prev()[0].childNodes[0]; // 왜인지 parentElt가 안먹힘 ㅠㅠ 그래서 임시로 막아놓음
        range.setStart(a, start);
        range.setEnd(a, end);
        var rects = range.getClientRects();
        var left = rects[0].right;
        return [left+0.5, (rects[0].top+rects[0].bottom)/2];
    }

    function enter() {
        num = 0;
        start = num;
        end = start + 1;
        var a = $("#cursor").prev()[0]; // 왜인지 parentElt가 안먹힘 ㅠㅠ 그래서 임시로 막아놓음
        if(a.childNodes[0] == undefined) {
            a.innerHTML = " ";
            range.setStart(a.childNodes[0], start);
            range.setEnd(a.childNodes[0], end);
            var rects = range.getClientRects();
            var right = rects[0].left;
            a.innerHTML = "";
            return [right - 0.5, (rects[0].top+rects[0].bottom)/2]
        }
        range.setStart(a, start);
        range.setEnd(a, end);
        var rects = range.getClientRects();
        var right = rects[0].left;
        return [right - 0.5, (rects[0].top+rects[0].bottom)/2]
    }

    function backspace() {  
        if(parentElt == undefined) {
            if($(parentElt).closest("div.line").prev() == undefined) {
                console.log("변화없음");
                return false;
            }
            var div = $("#cursor").detach();
            var prev = $(parentElt).closest("div.line").prev().children().children()[0];
            if(prev.childNodes[0] == undefined) {
                $(parentElt).closest("div.line").remove();
                prev.innerHTML = "a";
                start = 0;
                end = start + 1;
                range.setStart(prev.childNodes[0], 0);
                range.setEnd(prev.childNodes[0], 1);
                var rects = range.getClientRects();
                prev.innerHTML = "";
                num = 0;
                $(prev).closest("div.wrap").append(div);
                return [rects[0].left - 0.5, (rects[0].top + rects[0].bottom)/2];
            }
            else {
                $(parentElt).closest("div.line").remove();
                start = prev.textContent.length - 1;
                end = start + 1
                range.setStart(prev.childNodes[0], start);
                range.setEnd(prev.childNodes[0], end);
                var rects = range.getClientRects();
                num = prev.textContent.length;
                $(prev).closest("div.wrap").append(div);
                return [rects[0].right + 0.5, (rects[0].top + rects[0].bottom)/2];
            }
        }
        else {
            if(num == 0) {
                if($(parentElt).closest("div.line").prev() == undefined) {
                    console.log("변화없음");
                    return false;
                }
                var div = $("#cursor").detach();
                var prev = $(parentElt).closest("div.line").prev().children().children()[0];
                var text1 = prev.textContent;
                var text2 = parentElt.textContent;
                $(parentElt).closest("div.line").remove();
                $(prev).closest("div.wrap").append(div);
                prev.innerHTML = text1 + text2;
                console.log(prev.textContent);
                num = text1.length;
                start = num - 1;
                end = start + 1;
                range.setStart(prev.childNodes[0], start);
                range.setEnd(prev.childNodes[0], end);
                var rects = range.getClientRects();
                return [rects[0].right + 0.5, (rects[0].top + rects[0].bottom)/2];
            }
            else {
                var text = parentElt.textContent;
                var result = text.slice(0, num-1) + text.slice(num, text.length);
                parentElt.parentNode.innerHTML = result;
                num-=1;
                if(num == 0) {
                    start = 0;
                    end = start + 1;
                    if($("#cursor").prev()[0].childNodes[0] == undefined) {
                        parentElt = $("#cursor").prev()[0];
                        parentElt.innerHTML = "a";
                        range.setStart(parentElt, start);
                        range.setEnd(parentElt, end);
                        var rects = range.getClientRects();
                        parentElt.innerHTML = "";
                        return [rects[0].left - 0.5, (rects[0].top + rects[0].bottom)/2];
                    }
                    else {
                        parentElt = $("#cursor").prev()[0].childNodes[0];
                        range.setStart(parentElt, start);
                        range.setEnd(parentElt, end);
                        var rects = range.getClientRects();
                        return [rects[0].left - 0.5, (rects[0].top + rects[0].bottom)/2];
                    }
                }
                else {
                    start = num - 1;
                    end = start + 1;
                    parentElt = $("#cursor").prev()[0].childNodes[0];
                    range.setStart(parentElt, start);
                    range.setEnd(parentElt, end);
                    var rects = range.getClientRects();
                    return [rects[0].right + 0.5, (rects[0].top + rects[0].bottom)/2];
                }
            }
        }
    }

    return null;
}

function onClick(e) {
    hanStart = -1;
    var clicked = moveCursor(e.target.childNodes[0], e.pageX-window.pageXOffset, e.pageY-window.pageYOffset, "click");
    if (clicked) {
        //console.log("prev: " + $(e.target).closest("div").prev().text()); //해당하는 값이 없을 경우 즉 prev가 없을 경우 그냥 false return
        //console.log("next: " + $(e.target).closest("div").next());
        $("#cursor").css("left", clicked[0] + window.pageXOffset + "px");
        $("#cursor").css("top", clicked[1] + window.pageYOffset + "px");
    }
}

document.addEventListener('click', onClick);

setInterval(function () {
    var value = $("#cursor").css("opacity") == 0 ? 100 : 0;
    $("#cursor").css("opacity", value);
}, 700);


function typing (keyCode, key, parentElt) {
    var words;
    if(parentElt.childNodes[0] == undefined) {
        words = "";
        parentElt = $("#cursor").prev()[0];
    }
    else {
        parentElt = $("#cursor").prev()[0].childNodes[0];
        words = parentElt.textContent;
    }
    var range = document.createRange();
    var start = 0;
    var end = words.length;
    range.setStart(parentElt, start);
    range.setEnd(parentElt, end);
    var rects = range.getClientRects();
    if(hanStart == -1) {
        hangul = [];
    }
    if(HangulMode && keyCode >= 65 && keyCode <= 90) {
        hangul.push(key);
        var hangulBefore = hangul;
        if(hanStart == -1) { //첫입력 판정
            hanStart = num;
            var result = words.slice(0, hanStart) + inko.en2ko(hangul) + words.slice(hanStart, words.length);//첫 입력: 백스페이스, 엔터 등등 이후의 입력은 첫입력 처리 
            var cursorPos;
            if(words == "") {
                parentElt.innerHTML = result;
                cursorPos = moveCursor(parentElt, 0, 0, "typing");
            }
            else {
                console.log("as");
                $(parentElt.parentNode).text(result);
                cursorPos = moveCursor(parentElt, 0, 0, "typing");
            }
            $("#cursor").css("left", cursorPos[0] + window.pageXOffset + "px");
            $("#cursor").css("top", cursorPos[1] + window.pageYOffset + "px");
        }
        else {
            if(inko.en2ko(hangul).length == 2) {
                if(Hangul.isCompleteAll(inko.en2ko(hangul.slice(hangul.length-2, hangul.length)))) {
                    var result = words.slice(0, hanStart) + inko.en2ko(hangul) + words.slice(hanStart+1, words.length);//이후 입력
                    hangul = [];
                    hangul.push(hangulBefore[hangulBefore.length-2]);
                    hangul.push(hangulBefore[hangulBefore.length-1]);
                    var cursorPos;
                    if(words = "") {
                        parentElt.innerHTML = result;
                        cursorPos = moveCursor(parentElt, 0, 0, "typing");
                    }
                    else {
                        $(parentElt.parentNode).text(result);
                        cursorPos = moveCursor(parentElt, 0, 0, "typing");
                    }
                    $("#cursor").css("left", cursorPos[0] + window.pageXOffset + "px");
                    $("#cursor").css("top", cursorPos[1] + window.pageYOffset + "px");
                    hanStart+=1;
                }
                else {
                    var result = words.slice(0, hanStart) + inko.en2ko(hangul) + words.slice(hanStart+1, words.length);//이후 입력
                    hangul = [];
                    hangul.push(hangulBefore[hangulBefore.length-1]);
                    var cursorPos;
                    if(words = "") {
                        parentElt.innerHTML = result;
                        cursorPos = moveCursor(parentElt, 0, 0, "typing");
                    }
                    else {
                        $(parentElt.parentNode).text(result);
                        cursorPos = moveCursor(parentElt, 0, 0, "typing");
                    }
                    $("#cursor").css("left", cursorPos[0] + window.pageXOffset + "px");
                    $("#cursor").css("top", cursorPos[1] + window.pageYOffset + "px");
                    hanStart+=1;
                }
            }
            else {
                var result = words.slice(0, hanStart) + inko.en2ko(hangul) + words.slice(hanStart+1, words.length);//이후 입력
                if(words = "") {
                    parentElt.innerHTML = result;
                }
                else {
                    $(parentElt.parentNode).text(result);
                }
            }
        }
    }
    else if(!HangulMode && keyCode >= 65 && keyCode <= 90) {
        var result = words.slice(0, num) + key + words.slice(num, words.length);//이후 입력
        var cursorPos;
        if(words = "") {
            parentElt.innerHTML = result;
            cursorPos = moveCursor(parentElt, 0, 0, "typing");
        }
        else {
            $(parentElt.parentNode).text(result);
            cursorPos = moveCursor(parentElt, 0, 0, "typing");
        }
        $("#cursor").css("left", cursorPos[0] + window.pageXOffset + "px");
        $("#cursor").css("top", cursorPos[1] + window.pageYOffset + "px");
    }
    else { 
        hanStart = -1;
        if(keyCode == 32) {
            var result = words.slice(0, num) + " " + words.slice(num, words.length);//이후 입력
            var cursorPos;
            if(words = "") {
                parentElt.innerHTML = result;
                cursorPos = moveCursor(parentElt, 0, 0, "typing");
            }
            else {
                $(parentElt.parentNode).text(result);
                cursorPos = moveCursor(parentElt, 0, 0, "typing");
            }
            $("#cursor").css("left", cursorPos[0] + window.pageXOffset + "px");
            $("#cursor").css("top", cursorPos[1] + window.pageYOffset + "px");
        }
        else if(keyCode == 13) {
            //cursor.prev()[0].parentElement.parentElement
            var result1 = words.slice(0, num);
            var result2 = words.slice(num, words.length);
            var line = $("#cursor").prev()[0].parentElement.parentElement;
            line.innerHTML = "<div class='wrap'><span>"+result1+"</span></div>";
            $(line).after("<div class='line'><div class='wrap'><span>"+result2+"</span><div id='cursor'></div></div></div>");
            var cursorPos = moveCursor(parentElt.childNodes[0], 0, 0, "enter")
            $("#cursor").css("left", cursorPos[0] + window.pageXOffset + "px");
            $("#cursor").css("top", cursorPos[1] + window.pageYOffset + "px");
        }
        else if(keyCode == 8) {
            var cursorPos = moveCursor(parentElt, 0, 0, "backspace");
            if(cursorPos) {
                $("#cursor").css("left", cursorPos[0] + window.pageXOffset + "px");
                $("#cursor").css("top", cursorPos[1] + window.pageYOffset + "px");
            }    
        }
    }
    //영어글자
    //한글글자
    //나머지
}

document.addEventListener("keydown", function(e) {
    var cursor = $("#cursor");
    var left = parseInt(cursor.css("left"), 10) - window.pageXOffset
    var top = parseInt(cursor.css("top"), 10) - window.pageYOffset
    if(e.key == "ArrowLeft") {
        e.preventDefault();
        hanStart = -1;
        var keydown = moveCursor(cursor.prev()[0].childNodes[0], left, top, "keyleft");
        $("#cursor").css("left", keydown[0] + window.pageXOffset + "px");
        $("#cursor").css("top", keydown[1] + window.pageYOffset + "px");
    }
    else if(e.key == "ArrowRight") {
        e.preventDefault();
        hanStart = -1;
        var keydown = moveCursor(cursor.prev()[0].childNodes[0], left, top, "keyright");
        $("#cursor").css("left", keydown[0] + window.pageXOffset + "px");
        $("#cursor").css("top", keydown[1] + window.pageYOffset + "px");
    }
    else if(e.key == "ArrowUp") {
        e.preventDefault();
        hanStart = -1;
        var keydown = moveCursor(cursor.prev()[0].childNodes[0], left, top, "keyup");
        $("#cursor").css("left", keydown[0] + window.pageXOffset + "px");
        $("#cursor").css("top", keydown[1] + window.pageYOffset + "px");
    }
    else if(e.key == "ArrowDown") {
        e.preventDefault();
        hanStart = -1;
        var keydown = moveCursor(cursor.prev()[0].childNodes[0], left, top, "keydown");
        $("#cursor").css("left", keydown[0] + window.pageXOffset + "px");
        $("#cursor").css("top", keydown[1] + window.pageYOffset + "px");
    }
    else if((e.keyCode >= 48 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 111) || (e.keyCode >= 186 && e.keyCode <= 222) || e.keyCode == 32 || e.keyCode == 13 || e.keyCode == 8){
        typing(e.keyCode, e.key, cursor.prev()[0]);
    }
    else if(e.key == "HangulMode") {
        HangulMode = HangulMode ? false : true;
        if(!HangulMode) {
            hanStart = -1;
        }
    }
    //48 - 90 \ 96 - 111 \ 186 - 222 \ 32:스페이스 \ 46:딜리트 \ 8:백스페이스 \ 13:엔터     앞의 것들은 e.key로 그대로 출력
})

document.addEventListener("selectionchange", function(e) {/*
    console.log(document.getSelection().anchorNode.textContent);
    console.log(document.getSelection().anchorOffset);
    console.log(document.getSelection().focusNode);
    console.log(document.getSelection().focusOffset);*/
    //console.log(document.getSelection().toString().replace(/\n/g, ""));
    //document.getSelection().deleteFromDocument();
    document.addEventListener("mouseup", function(e) {
        
    });
});



var clipboard = new ClipboardJS('.btn');
var ctxdiv = document.createElement("div");
ctxdiv.id = "contextMenu";
ctxdiv.innerHTML = "<button id='copy'>copy</button><button id='paste'>paste</button>";

document.addEventListener("contextmenu", function(e) {
    e.preventDefault(); // 원래 있던 오른쪽 마우스 이벤트를 무효화한다.
    
    document.body.appendChild(ctxdiv);
    var ctxMenu = document.getElementById("contextMenu");
    var x = e.pageX + "px";
    var y = e.pageY + "px";
    ctxMenu.style.display = "flex";
    ctxMenu.style.left = x;
    ctxMenu.style.top = y;

    document.removeEventListener('click', onClick);
    document.addEventListener("click", function(e) {
        if(ctxMenu) {
            document.body.removeChild(ctxMenu);
        }        
        document.addEventListener('click', onClick);
    }, {once: true});

    document.getElementById("copy").addEventListener("click", function(e) {
        
        var t = document.createElement("textarea");
        document.body.appendChild(t);
        t.value = document.getSelection().toString().replace(/\n/g, "");
        t.select();
        document.execCommand("copy");
        document.body.removeChild(t);
    }, {once: true});
    document.getElementById("paste").addEventListener("click", function(e) {

        navigator.clipboard.readText().then(function (text) {
            parentElt = $("#cursor").prev()[0].childNodes[0];
            var words = parentElt.textContent;
            var result = words.slice(0, num) + text + words.slice(num, words.length);//이후 입력
            $(parentElt.parentNode).text(result);
            var cursorPos = moveCursor(parentElt, text.length, 0, "paste");
            $("#cursor").css("left", cursorPos[0] + window.pageXOffset + "px");
            $("#cursor").css("top", cursorPos[1] + window.pageYOffset + "px");
        });
    });
});
//오늘은 뱡향키 마저 만들고 영어입력 구현, ///스페이스, 엔터 구현

//할일
//1. 커서 시스템 개편: 원래는 왼쪽 오른쪽의 중간이었는데 이제는 왼쪽에서 + 0.5로 *
//2. 위 아래 화살표 구현 *
//3. 영어입력 구현 *
//4. 블록 씌워서 ctrl+c 와 ctrl+v *
//5. 스페이스 구현 *
//6. 엔터 구현 *
//7. 백스페이스 구현 ; 글자+스페이스, 엔터+제목
//8. 블록구현 ; 글자 옆에 막 [] 이런거 쓰면 나옴
//9. 코드삽입구현 ; line들을 감싼다 새로운 태그로 
//10. 하이퍼링크 구현 ; span 태그안에 걍 써놓고 따로 저장하고 걍 나중에 md추출할때 그때만 정상이면 되는거 아님?
//11. 제목구현 ; 얘는 태그를 span이 아닌 h1, h2...로
//12. 인용구현 ; line들을 감싼다 새로운 태그로 
//13. OL 구현 ; 굳이 있어야 할까
//15. UL구현 ; 굳이 있어야 할까
//16. 표 구현 ; 태그 새로운거
//17. 사진 구현 ; 하이퍼링크처럼
//18. 가로선 구현 ; line 안에 span 대신 딴거
//19. 강조구현 ; 글자 옆에 막 [] 이런거 쓰면 나옴
// 들여쓰기 ; 걍 탭 눌러서 해
// 기존에 있는 마크다운 불러오기, 내보내기
//20. undo redo 구현
//21. 코드 고급지게 수정
//22. 주석 달아주기
//23. 블로그 업로드