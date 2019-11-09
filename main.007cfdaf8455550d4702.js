(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{zUnb:function(e,t,n){"use strict";n.r(t);const i=document.createElement("template");i.innerHTML='\n<style>\n    :host {\n        box-sizing: border-box;\n        display: flex;\n        flex-direction: column;\n        height: 100vh;\n        border: 1vh lightgrey outset;\n        background-color: grey;\n    }\n\n    :host[hidden] {\n        display: none;\n    }\n    \n    header, main {\n        display: flex;\n        justify-content: space-around;\n        align-items: center;\n        border: 1vh lightgrey inset;\n        background-color: lightgrey;\n    }\n\n    main {\n        height: 100%;\n    }\n\n    header {\n        padding: 1vh;\n    }\n</style>\n<header>\n    <minesweeper-remaining-mines id="remaining-mines"></minesweeper-remaining-mines>\n    <minesweeper-configuration id="configuration"></minesweeper-configuration>\n    <minesweeper-timer id="timer"></minesweeper-timer>\n</header>\n<main>\n    <minesweeper-board id="board"></minesweeper-board>\n</main>\n';class s extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(i.content.cloneNode(!0)),this.boardElement=this.shadowRoot.getElementById("board"),this.remainingMinesElement=this.shadowRoot.getElementById("remaining-mines"),this.configurationElement=this.shadowRoot.getElementById("configuration"),this.timerElement=this.shadowRoot.getElementById("timer"),this.boardElement.addEventListener("won",e=>{this.setStateWon()}),this.boardElement.addEventListener("tile-select",e=>{this.setStateInProgress()}),this.boardElement.addEventListener("lost",e=>{this.setStateLost()}),this.boardElement.addEventListener("tile-flag",e=>{this.remainingMinesElement.decrease()}),this.boardElement.addEventListener("tile-unflag",e=>{this.remainingMinesElement.increase()}),this.boardElement.addEventListener("mousedown",e=>{"in progress"===this.gameState&&this.configurationElement.displaySurprise()}),this.boardElement.addEventListener("mouseup",e=>{"in progress"===this.gameState&&this.configurationElement.displayHappy()}),this.configurationElement.addEventListener("new-game",e=>{this.configuration=e.detail,setTimeout(()=>this.setStateStarted())})}setStateStarted(){this.boardElement.initializeBoard(this.configuration.width,this.configuration.height,this.configuration.mines),this.gameState="started",this.timerElement.reset(),this.configurationElement.displayHappy(),this.remainingMinesElement.reset(this.configuration.mines)}setStateInProgress(){this.gameState="in progress",this.timerElement.isStarted||this.timerElement.start(),this.configurationElement.displayHappy()}setStateWon(){this.gameState="won",this.timerElement.stop(),this.configurationElement.displayWon();const e=this.timerElement.getTime();this.configuration.highScore>e&&this.configurationElement.updateHighScore(e)}setStateLost(){this.gameState="lost",this.timerElement.stop(),this.configurationElement.displayLost()}}customElements.define("minesweeper-game",s);const o=document.createElement("template");o.innerHTML='\n<style>\n    :host {\n        background-color: grey;\n        border: .25rem lightgrey ridge;\n    }\n\n    :host[hidden] {\n        display: none;\n    }\n\n    #board {\n        border-collapse: collapse;\n    }\n</style>\n<table id="board"></table>\n';class r extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(o.content.cloneNode(!0)),this.board=this.shadowRoot.getElementById("board"),this.board.addEventListener("tile-select",e=>{const t=e.target;this.revealTiles(t)?(this.revealAllMines(),this.dispatchEvent(new CustomEvent("lost",{bubbles:!0}))):this.isGameFinished()&&(this.flagAllMines(),this.dispatchEvent(new CustomEvent("won",{bubbles:!0})))}),this.addEventListener("contextmenu",e=>{e.preventDefault()})}static get observedAttributes(){return["width","height","mines"]}get mines(){return+this.getAttribute("mines")}set mines(e){this.setAttribute("mines",String(e))}get width(){return+this.getAttribute("width")}set width(e){this.setAttribute("width",String(e))}get height(){return+this.getAttribute("height")}set height(e){this.setAttribute("height",String(e))}connectedCallback(){this.width=+this.getAttribute("width"),this.height=+this.getAttribute("height"),this.mines=+this.getAttribute("mines"),setTimeout(()=>this.initializeBoard(this.width,this.height,this.mines))}attributeChangedCallback(e,t,n){}initializeBoard(e=this.width,t=this.height,n=this.mines){if(this.width=e,this.height=t,this.mines=n,this.mines>this.width*this.height)return void console.error(`${this.mines} mines is greater than the number of places in a ${this.width} x ${this.height} board`);for(;this.board.firstChild;)this.board.removeChild(this.board.firstChild);this.tiles=[];for(let e=0;e<this.height;e++){const t=document.createElement("tr");for(let n=0;n<this.width;n++){const i=document.createElement("minesweeper-tile");i.setAttribute("x",String(e)),i.setAttribute("y",String(n)),this.tiles[e*this.width+n]=i;const s=document.createElement("td");s.appendChild(i),t.appendChild(s)}this.board.appendChild(t)}let i=0;for(;i<this.mines;){const e=Math.floor(Math.random()*(this.width*this.height));this.tiles[e].isMine()||(this.tiles[e].setMine(),i++)}}checkSurroundingTiles(e,t,n){e-1>=0&&n(e-1,t),e-1>=0&&t-1>=0&&n(e-1,t-1),e-1>=0&&t+1<this.width&&n(e-1,t+1),t-1>=0&&n(e,t-1),t+1<this.width&&n(e,t+1),e+1<this.height&&n(e+1,t),e+1<this.height&&t-1>=0&&n(e+1,t-1),e+1<this.height&&t+1<this.width&&n(e+1,t+1)}isGameFinished(){return this.tiles.every(e=>e.isMine()||e.visited)}flagAllMines(){this.tiles.forEach(e=>{e.isMine()&&!e.isFlagged()&&e.flag(),e.disable()})}revealAllMines(){this.tiles.forEach(e=>{e.isMine()&&!e.isFlagged()&&e.revealMine(),!e.isMine()&&e.isFlagged()&&e.revealNotMine(),e.disable()})}revealTiles(e){const t=[];for(t.push(e);t.length;){const e=t.pop();if(e.visited||e.isFlagged())continue;if(e.isMine())return e.revealMine(!0),!0;let n=0;this.checkSurroundingTiles(e.x,e.y,(e,t)=>{this.tiles[e*this.width+t].isMine()&&n++}),e.revealTileCount(n),0===n&&this.checkSurroundingTiles(e.x,e.y,(e,n)=>{const i=this.tiles[e*this.width+n];i.visited||t.push(i)})}return!1}}customElements.define("minesweeper-board",r);const a=document.createElement("template");a.innerHTML="\n<style>\n    :host {\n        box-sizing: border-box;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        height: 1.5rem;\n        width: 1.5rem;\n        font-family: arial;\n        font-weight: 900;\n        border: .25rem outset lightgrey;\n        background-color: lightgrey;\n        cursor: pointer;\n        user-select: none;\n        -moz-user-select: none;\n    }\n\n    :host[hidden] {\n        display: none;\n    }\n\n    :host([pressed], :focus) {\n        border: none;\n        outline: none;\n        -moz-outline: none;\n    }\n\n    :host([exploded]) {\n        background-color: red;\n    }\n\n    :host([visited]) {\n        border: none;\n    }\n\n    :host([value='1']) {\n        color: var(--minesweeper-tile-one-color, blue);\n    }\n\n    :host([value='2']) {\n        color: var(--minesweeper-tile-two-color, green);\n    }\n\n    :host([value='3']) {\n        color: var(--minesweeper-tile-three-color, red);\n    }\n\n    :host([value='4']) {\n        color: var(--minesweeper-tile-four-color, purple);\n    }\n\n    :host([value='5']) {\n        color: var(--minesweeper-tile-five-color, maroon);\n    }\n\n    :host([value='6']) {\n        color: var(--minesweeper-tile-six-color, turquoise);\n    }\n\n    :host([value='7']) {\n        color: var(--minesweeper-tile-seven-color, black);\n    }\n\n    :host([value='8']) {\n        color: var(--minesweeper-tile-eight-color, grey);\n    }\n</style>\n<div id=\"display\"></div>\n";class h extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(a.content.cloneNode(!0)),this.displayElement=this.shadowRoot.getElementById("display"),this.addEventListener("contextmenu",e=>{e.preventDefault(),this.toggleFlag()}),this.addEventListener("keydown",e=>{switch(e.key){case"f":this.toggleFlag();break;case" ":case"Enter":this.selectTile()}}),this.addEventListener("mousedown",e=>{e.preventDefault(),1!==e.buttons||this.disabled||this.isFlagged()||this.setAttribute("pressed","")}),this.addEventListener("mouseout",e=>{this.removeAttribute("pressed")}),this.addEventListener("mouseover",e=>{1!==e.buttons||this.disabled||this.isFlagged()||this.setAttribute("pressed","")}),this.addEventListener("mouseup",e=>{1===e.which&&this.selectTile()})}get x(){return+this.getAttribute("x")}set x(e){this.setAttribute("x",String(e))}get y(){return+this.getAttribute("y")}set y(e){this.setAttribute("y",String(e))}get value(){return this.getAttribute("value")}set value(e){this.setAttribute("value",e),this.displayElement.textContent="0"!==this.value?this.value:""}get visited(){return this.hasAttribute("visited")}connectedCallback(){this.x=+this.getAttribute("x"),this.y=+this.getAttribute("y"),this.hasAttribute("tabindex")||this.setAttribute("tabindex","0")}disable(){this.disabled=!0,this.blur(),this.setAttribute("tabindex","-1")}flag(){if(this.disabled||this.isFlagged())return;const e=new CustomEvent("tile-flag",{bubbles:!0,cancelable:!0,composed:!0});this.dispatchEvent(e)&&(this.value="🚩")}isDisabled(){return this.disabled}isFlagged(){return"🚩"===this.value}isMine(){return this.mine}revealMine(e=!1){e&&this.setAttribute("exploded",""),this.value="💣",this.disable(),this.setAttribute("visited","")}revealNotMine(){this.value="❌",this.disable(),this.setAttribute("visited","")}revealTileCount(e){this.value=String(e),this.disable(),this.setAttribute("visited","")}setMine(){this.mine=!0}unflag(){if(this.disabled||!this.isFlagged())return;const e=new CustomEvent("tile-unflag",{bubbles:!0,cancelable:!0,composed:!0});this.dispatchEvent(e)&&(this.value="")}toggleFlag(){this.disabled||(this.isFlagged()?this.unflag():this.flag())}selectTile(){this.disabled||this.isFlagged()||this.dispatchEvent(new CustomEvent("tile-select",{bubbles:!0,composed:!0}))}}customElements.define("minesweeper-tile",h);const l=document.createElement("template");l.innerHTML="\n<style>\n    :host {\n        background-color: black;\n        color: red;\n        font-family: 'DSEG7-Classic';\n        font-size: 2rem;\n        user-select: none;\n        -moz-user-select: none;\n    }\n\n    :host[hidden] {\n        display: none;\n    }\n</style>\n<div id=\"display\"></div>\n";const d=3,u=1e3;class c extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(l.content.cloneNode(!0)),this.displayElement=this.shadowRoot.getElementById("display"),this.timerCount=0}get isStarted(){return!!this.timerCount}disconnectedCallback(){this.stop()}reset(){this.stop(),this.timerCount=0,this.displayElement.textContent=this.getCount()}start(){this.timerInterval||(this.timerInterval=setInterval(()=>{this.timerCount++,this.displayElement.textContent=this.getCount()},u))}stop(){this.timerInterval&&(clearInterval(this.timerInterval),this.timerInterval=0)}getTime(){return this.timerCount}getCount(){return String(this.timerCount).padStart(d,"0")}}customElements.define("minesweeper-timer",c);const m=document.createElement("template");m.innerHTML="\n<style>\n    :host {\n        background-color: black;\n        color: red;\n        font-family: 'DSEG7-Classic';\n        font-size: 2rem;\n        user-select: none;\n        -moz-user-select: none;\n    }\n\n    :host[hidden] {\n        display: none;\n    }\n</style>\n<div id=\"display\"></div>\n";const g=3;class p extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(m.content.cloneNode(!0)),this.displayElement=this.shadowRoot.getElementById("display")}get count(){return+this.getAttribute("count")}set count(e){this.setAttribute("count",String(e))}static get observedAttributes(){return["count"]}attributeChangedCallback(e,t,n){switch(e){case"count":this.displayElement.textContent=this.getCount()}}reset(e){this.count=e}increase(){this.count++}decrease(){this.count--}getCount(){return this.count>=0?String(this.count).padStart(g,"0"):String(this.count).padStart(g," ")}}customElements.define("minesweeper-remaining-mines",p);class b{static getConfigurations(){const e=this.getConfigurationsFromLocalStorage();return e||this.writeConfigurationsToLocalStorage(this.defaultConfigurations),e||this.defaultConfigurations}static getCurrentConfiguration(){return this.defaultConfigurations[0]}static addOrUpdateConfiguration(e){const t=this.getConfigurationsFromLocalStorage()||[],n=t.findIndex(t=>t.id===e.id);-1!==n?t.splice(n,1,e):t.push(e),this.writeConfigurationsToLocalStorage(t)}static getConfigurationsFromLocalStorage(){const e=localStorage.getItem(this.LOCAL_STORAGE_KEY);try{return JSON.parse(e).map(e=>(e.highScore=null===e.highScore?1/0:e.highScore,e))}catch(e){return null}}static writeConfigurationsToLocalStorage(e){localStorage.setItem(this.LOCAL_STORAGE_KEY,JSON.stringify(e))}}b.defaultConfigurations=[{id:1,name:"Beginner",width:9,height:9,mines:10,highScore:1/0},{id:2,name:"Intermediate",width:16,height:16,mines:40,highScore:1/0},{id:3,name:"Expert",width:30,height:16,mines:99,highScore:1/0}],b.LOCAL_STORAGE_KEY="minesweeper_configuration";const E=document.createElement("template");E.innerHTML='\n<style>\n    :host {\n        font-size: 1.5rem;\n        user-select: none;\n        -moz-user-select: none;\n    }\n\n    :host[hidden] {\n        display: none;\n    }\n\n    *:focus {\n        outline: none;\n        -moz-outline: none;\n    }\n\n    #display:active, #display:focus {\n        border-style: inset;\n    }\n\n    #display {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        font-size: 1.25rem;\n        height: 2.5rem;\n        width: 2.5rem;\n        border: .25rem lightgrey outset;\n        cursor: pointer;\n    }\n\n    .setup-dropdown {\n        display: none;\n        position: absolute;\n        background-color: lightgrey;\n        border: 1px solid grey;\n        box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.5);\n        cursor: pointer;\n        margin: unset;\n    }\n\n    .setup-dropdown.visible {\n        display: block;\n        padding: 0;\n    }\n\n    .setup-dropdown *:hover, .setup-dropdown *:focus {\n        background-color: darkgrey;\n    }\n\n    .setup-dropdown *:active {\n        background-color: grey;\n    }\n\n    .setup-dropdown * {\n        padding: 0.5rem;\n    }\n\n    span {\n        font-size: 50%;\n    }\n\n    li {\n        list-style: none;\n    }\n</style>\n<button id="display"></button>\n<ul id="setup-dropdown" class="setup-dropdown">\n</ul>\n';class w extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(E.content.cloneNode(!0)),this.displayElement=this.shadowRoot.getElementById("display"),this.setupDropdownElement=this.shadowRoot.getElementById("setup-dropdown"),this.buildSetupList(),this.displayElement.addEventListener("click",e=>{this.dispatchNewGame()}),this.addEventListener("keydown",e=>{"Escape"===e.key&&this.setupDropdownElement.classList.remove("visible"),/^[a-z0-9]$/.test(e.key)&&this.toggleVisible()}),this.addEventListener("contextmenu",e=>{e.preventDefault(),this.toggleVisible()}),this.addEventListener("mousedown",e=>{e.preventDefault()}),this.currentConfiguration=b.getCurrentConfiguration(),this.displayHappy()}connectedCallback(){this.dispatchEvent(new CustomEvent("new-game",{detail:this.currentConfiguration,bubbles:!0}))}displayHappy(){this.displayElement.textContent="😊"}displayLost(){this.displayElement.textContent="☹️"}displaySurprise(){this.displayElement.textContent="😮"}displayWon(){this.displayElement.textContent="😎"}updateHighScore(e){this.currentConfiguration.highScore=e,b.addOrUpdateConfiguration(this.currentConfiguration),this.buildSetupList()}buildSetupList(){for(;this.setupDropdownElement.firstChild;)this.setupDropdownElement.removeChild(this.setupDropdownElement.firstChild);for(const e of b.getConfigurations()){const t=document.createElement("li"),n=document.createElement("span");t.id=String(e.id),t.textContent=e.name,t.tabIndex=0,n.textContent=`${e.width} x ${e.height} board with ${e.mines} mines${e.highScore===1/0?"":` (High score: ${e.highScore})`}`,t.appendChild(n),t.addEventListener("click",e=>{i()}),t.addEventListener("keydown",e=>{switch(e.key){case" ":case"Enter":i()}});const i=()=>{this.currentConfiguration=e,this.dispatchNewGame()};this.setupDropdownElement.appendChild(t)}}dispatchNewGame(){this.setupDropdownElement.classList.remove("visible"),this.dispatchEvent(new CustomEvent("new-game",{detail:this.currentConfiguration,bubbles:!0}))}toggleVisible(){this.setupDropdownElement.classList.contains("visible")?this.setupDropdownElement.classList.remove("visible"):this.setupDropdownElement.classList.add("visible")}}customElements.define("minesweeper-configuration",w),function(){const e=document.createElement("minesweeper-game");document.body.appendChild(e)}()}},[["zUnb",0]]]);