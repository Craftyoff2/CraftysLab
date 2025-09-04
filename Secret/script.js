// script.js
// Random "code" background that types lines, then resets and repeats.
// Tweak settings below.

(() => {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d", { alpha: true });

  // Settings
  const fpsTarget = 60;
  const lineCount = 18;            // Number of simultaneous lines
  const minCharsPerLine = 24;      // minimum characters in each line
  const maxCharsPerLine = 80;      // maximum characters in each line
  const typingSpeedRange = [6, 18];// lower = faster (chars per frame-ish)
  const charSize = 14;             // font size in px
  const lineGap = 6;               // extra vertical spacing
  const resetInterval = 5000;      // how long (ms) before a full reset starts
  const fadeOutDuration = 700;     // fade out in ms before reset

  // A small "code-like" vocabulary to make it look realistic:
  const keywords = [
    "const","let","var","function","return","if","else","for","while","break",
    "struct","class","import","from","export","new","this","public","private",
    "static","void","int","char","printf","console.log","await","async","try",
    "catch","map","filter","reduce","true","false","null","undefined"
  ];

  const symbols = ["{","}","(",")","[","]",";","->",":","=","==","!=","/","*","+","-","//"];

  // A charset of letters, digits and symbols:
  const charset = ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789").split("");

  // Utility helpers
  function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function choice(arr){ return arr[randInt(0, arr.length-1)]; }

  // Resize canvas to device pixel ratio
  function resize(){
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr,0,0,dpr,0,0); // scale drawing to CSS pixels
    ctx.font = `${charSize}px "Courier New", monospace`;
    ctx.textBaseline = "top";
  }
  window.addEventListener("resize", resize);
  resize();

  // A line object that types characters left-to-right
  class TypingLine {
    constructor(y){
      this.y = y;                  // y position in pixels
      this.reset();
    }
    reset(){
      this.len = randInt(minCharsPerLine, maxCharsPerLine);
      this.chars = this._generateChars(this.len);
      this.cursor = 0;
      this.speed = randInt(typingSpeedRange[0], typingSpeedRange[1]);
      this.accumulator = 0;
      this.alpha = 1;
      // color variations: mostly dim-accent with subtle greenish glow
      this.color = this._pickColor();
      this.x = randInt(-20, 40); // slight left offset randomness
    }
    _pickColor(){
      // random slightly different greens/cyan
      const base = 73; // green base (73, 255, 182)
      const g = Math.min(255, base + randInt(0,120));
      const b = Math.min(255, 120 + randInt(0,120));
      const a = 0.95;
      return `rgba(73,${g},${b},${a})`;
    }
    _generateChars(n){
      // generate a mix of keywords, symbols and random chars to look like code
      const out = [];
      for(let i=0;i<n;i++){
        const r = Math.random();
        if(r < 0.12){
          out.push(choice(symbols));
        } else if(r < 0.35){
          out.push(choice(keywords));
        } else if(r < 0.55){
          out.push(choice(charset));
        } else {
          // small chance to build short tokens
          const tokenLen = randInt(2,6);
          let t = "";
          for(let k=0;k<tokenLen;k++) t += choice(charset);
          out.push(t);
        }
      }
      return out;
    }
    step(){
      // accumulate and advance cursor based on speed
      this.accumulator += this.speed;
      if(this.accumulator >= 10){ // every so often show next char(s)
        const adv = Math.floor(this.accumulator / 10);
        this.cursor = Math.min(this.len, this.cursor + adv);
        this.accumulator = this.accumulator % 10;
      }
    }
    draw(ctx){
      const xstart = 20 + this.x;
      let x = xstart;
      for(let i=0;i<this.cursor;i++){
        const s = this.chars[i];
        ctx.fillStyle = this.color;
        ctx.fillText(s, x, this.y);
        x += ctx.measureText(s).width + 6; // spacing between tokens
        // if x goes beyond width, skip rest
        if(x > window.innerWidth - 20) break;
      }
      // tiny cursor blink
      if(this.cursor < this.len){
        if(Math.floor(performance.now()/300) % 2 === 0){
          const cursorX = x;
          ctx.fillRect(cursorX, this.y + (charSize*0.15), 8, Math.max(2,charSize*0.65));
        }
      }
    }
  }

  // Build lines
  let lines = [];
  function buildLines(){
    lines = [];
    const totalHeight = window.innerHeight;
    const stepY = charSize + lineGap;
    const maxLinesPossible = Math.floor(totalHeight / stepY);
    const actual = Math.min(lineCount, maxLinesPossible);
    // distribute lines across the vertical space
    const marginTop = Math.floor((totalHeight - actual * stepY) / 2);
    for(let i=0;i<actual;i++){
      const y = marginTop + i * stepY;
      lines.push(new TypingLine(y));
    }
  }
  buildLines();

  // Animation loop
  let last = performance.now();
  let accumulated = 0;
  let running = true;

  // Reset logic
  let lastReset = performance.now();
  let resetting = false;
  let resetStart = 0;

  function startReset(){
    resetting = true;
    resetStart = performance.now();
  }
  function performFullReset(){
    buildLines();
    lastReset = performance.now();
    resetting = false;
  }

  function loop(now){
    const dt = now - last;
    last = now;
    accumulated += dt;

    // control fps roughly
    const msPerFrame = 1000 / fpsTarget;
    if(accumulated < msPerFrame){
      requestAnimationFrame(loop);
      return;
    }
    accumulated = 0;

    // clear with a subtle fade to keep motion
    ctx.fillStyle = "rgba(10,12,14,0.28)";
    ctx.fillRect(0,0,canvas.width, canvas.height);

    // draw a soft vignette or glow (optional)
    // ctx.globalCompositeOperation = 'lighter';

    // update lines
    ctx.save();
    ctx.font = `${charSize}px "Courier New", monospace`;
    ctx.textBaseline = "top";
    for(const ln of lines){
      ln.step();
      // if resetting: fade lines out
      if(resetting){
        const t = Math.min(1, (now - resetStart) / fadeOutDuration);
        ctx.globalAlpha = 1 - t;
      } else {
        ctx.globalAlpha = 1;
      }
      ln.draw(ctx);
    }
    ctx.restore();

    // check reset timer
    if(!resetting && now - lastReset > resetInterval){
      startReset();
    }

    if(resetting && now - resetStart > fadeOutDuration){
      performFullReset();
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  // expose a small API on the window for debugging / tweaking
  window.__codebg = {
    rebuild: () => { performFullReset(); },
    setResetInterval: (ms) => { lastReset = performance.now(); },
    setLines: (n) => { /* not implemented dynamic */ }
  };

  // Rebuild lines on initial load or orientation change
  window.addEventListener("orientationchange", () => { resize(); performFullReset(); });

  // click to force new pattern
  window.addEventListener("click", () => { performFullReset(); });

})();
// Object to store codes and their custom messages
const codes = { "ThisIsTheFirstOneYouCanRedeeme": "The code was redeemed! To activate, go to this Discord server and create a ticket. After a while, you should get the role, and the support ticket will be closed.", };

// Function to "type out" text with blinking underscore
function typeMessage(element, text, colorClass) {
  element.innerHTML = ""; // Clear previous text
  let i = 0;
  const cursor = document.createElement("span");
  cursor.className = "blinking-cursor";
  cursor.textContent = "_";
  element.className = `message ${colorClass}`;

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i); // add next character
      i++;
      setTimeout(type, 30); // typing speed
    } else {
      // After text finishes, append the blinking cursor only once
      element.appendChild(cursor);
    }
  }
  type();
}

// Function to handle redemption
function redeemCode() {
  const input = document.getElementById("codeInput").value.trim();
  const messageEl = document.getElementById("message");

  if (codes[input]) {
    typeMessage(messageEl, codes[input], "green");
  } else {
    typeMessage(messageEl, "This code is invalid or not redeemable anymore.", "red");
  }
}
