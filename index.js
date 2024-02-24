(()=>{function m(t,e){t(e),e.children.forEach(n=>m(t,n))}function R(t){let e=t.value.position.x+Math.abs(t.value.dimensions.width/2),n=t.value.position.y+Math.abs(t.value.dimensions.height/2);return{x:e,y:n}}function I(t,e){let n=performance.now(),o=e();return console.log(`${t} (${performance.now()-n}ms)`),o}function O(){let t=document.getElementById("canvas");if(!t)throw new Error("Could not find canvas element.");t.width=window.innerWidth,t.height=window.innerHeight;let e=t.getContext("2d");if(!e)throw new Error("Could not get context.");return{context:e,canvasDimensions:{width:t.width,height:t.height}}}function S(t,e,n){let o=[];for(let r=0;r<e;r++){o[r]=[];for(let i=0;i<t;i++)o[r][i]=n}return o}function w(t){return t.map(e=>[...e])}function E(t){let e={width:0,height:0};return m(n=>{if(!n.value.position||!n.value.dimensions)return;let o=n.value.position.x+n.value.dimensions.width;o>e.width&&(e.width=o);let r=n.value.position.y+n.value.dimensions.height;r>e.height&&(e.height=r)},t),e}function N(t,e){let n=Math.floor(t.width/e.width),o=Math.floor(t.height/e.height);return n<o?n:o}var F={2:1,8:2,10:3,11:4,16:5,18:6,22:7,24:8,26:9,27:10,30:11,31:12,64:13,66:14,72:15,74:16,75:17,80:18,82:19,86:20,88:21,90:22,91:23,94:24,95:25,104:26,106:27,107:28,120:29,122:30,123:31,126:32,127:33,208:34,210:35,214:36,216:37,218:38,219:39,222:40,223:41,246:36,248:42,250:43,251:44,254:45,255:46,0:47};function B(t){let e=w(t);for(let n=0;n<e.length;n++)for(let o=0;o<e[n].length;o++)e[n][o]===1&&(e[n][o]=J(o,n,e));return e}function J(t,e,n){let o=0;return p(t,e,"north",n)&&(o|=2),p(t,e,"west",n)&&(o|=8),p(t,e,"east",n)&&(o|=16),p(t,e,"south",n)&&(o|=64),o&2&&o&8&&p(t,e,"north-west",n)&&(o|=1),o&2&&o&16&&p(t,e,"north-east",n)&&(o|=4),o&64&&o&8&&p(t,e,"south-west",n)&&(o|=32),o&64&&o&16&&p(t,e,"south-east",n)&&(o|=128),F[o]}function p(t,e,n,o){let r=t===0,i=t===o[e].length-1,a=e===0,c=e===o.length-1;switch(n){case"north":return a||o[e-1][t]>0;case"west":return r||o[e][t-1]>0;case"east":return i||o[e][t+1]>0;case"south":return c||o[e+1][t]>0;case"north-west":return r||a||o[e-1][t-1]>0;case"north-east":return i||a||o[e-1][t+1]>0;case"south-west":return r||c||o[e+1][t-1]>0;case"south-east":return i||c||o[e+1][t+1]>0}}function d(t){let e=new Image;return e.src=t,e}var s={ground:d("assets/tiles/ground.png"),n:d("assets/tiles/n.png"),s:d("assets/tiles/s.png"),e:d("assets/tiles/e.png"),w:d("assets/tiles/w.png"),ne:d("assets/tiles/ne.png"),nw:d("assets/tiles/nw.png"),"w-e":d("assets/tiles/w-e.png"),"n-nw-w":d("assets/tiles/n-nw-w.png"),"n-ne-e":d("assets/tiles/n-ne-e.png"),all:d("assets/tiles/all.png")},X={0:s.ground,1:s.s,2:s.s,3:s.s,4:s.s,5:s.s,7:s.s,6:s.s,8:s.s,9:s.s,10:s.s,11:s.s,12:s.s,13:s["w-e"],14:s["w-e"],15:s["w-e"],16:s["w-e"],17:s["w-e"],18:s["w-e"],19:s["w-e"],20:s["w-e"],21:s["w-e"],22:s["w-e"],23:s["w-e"],24:s["w-e"],25:s["w-e"],26:s["n-ne-e"],27:s["n-ne-e"],28:s.e,29:s["n-ne-e"],30:s["n-ne-e"],31:s.e,32:s["n-ne-e"],33:s.e,34:s["n-nw-w"],35:s["n-nw-w"],36:s.w,37:s["n-nw-w"],38:s["n-nw-w"],39:s["n-nw-w"],40:s.w,41:s.w,42:s.n,43:s.n,44:s.ne,45:s.nw,46:s.all,47:s.s};function Y(t){let{context:e,canvasDimensions:n}=O(),o=E(t),r=N(n,o),i=S(o.width,o.height,6);i=j(i,t),i=U(i,t),te(e,r,i),Z(e,r,i),q(e,r,n),z(e,r,t),Q(e,r,t)}function j(t,e){let n=w(t);return m(o=>{if(!(!o.value.position||!o.value.dimensions))for(let r=0;r<o.value.dimensions.height;r++)for(let i=0;i<o.value.dimensions.width;i++){let a=o.value.position.y+r,c=o.value.position.x+i;switch(o.value.type){case"start":n[a][c]=1;break;case"room":n[a][c]=2;break;case"boss":n[a][c]=3;break;case"end":n[a][c]=5;break}}},e),n}function U(t,e){let n=w(t);return m(o=>{if(o.value.corridor)for(let r=0;r<o.value.corridor.dimensions.height;r++)for(let i=0;i<o.value.corridor.dimensions.width;i++){let a=o.value.corridor.position.y+r,c=o.value.corridor.position.x+i;n[a][c]=4}},e),n}function q(t,e,n){t.beginPath(),t.lineWidth=.5,t.strokeStyle="rgba(0,200,0,0.5)";for(let o=.5;o<n.width;o+=e)t.moveTo(o,0),t.lineTo(o,n.height);for(let o=.5;o<n.height;o+=e)t.moveTo(0,o),t.lineTo(n.width,o);t.stroke(),t.closePath()}function z(t,e,n){t.beginPath(),t.lineWidth=1.5,t.strokeStyle="white",m(o=>{let r=R(o);o.children.forEach(i=>{let a=R(i);t.moveTo(r.x*e,r.y*e),t.lineTo(a.x*e,a.y*e)})},n),t.stroke(),t.closePath()}function Q(t,e,n){t.font="16px Arial",t.fillStyle="white",t.textAlign="center",m(o=>{let r=R(o);t.fillText(o.value.id,r.x*e,r.y*e)},n)}function Z(t,e,n){for(let o=0;o<n.length;o++)for(let r=0;r<n[o].length;r++)ee(t,e,r,o,n[o][r])}function ee(t,e,n,o,r){switch(r){case 6:t.fillStyle="rgba(0,0,0,0)";break;case 1:t.fillStyle="rgba(0,127,0,0.5)";break;case 2:t.fillStyle="rgba(0,0,127,0.5)";break;case 3:t.fillStyle="rgba(127,0,127,0.5)";break;case 4:t.fillStyle="rgba(127,127,0,0.5)";break;case 5:t.fillStyle="rgba(127,0,0,0.5)";break}t.fillRect(n*e,o*e,e,e)}function te(t,e,n){let o=oe(n),r=B(o);for(let i=0;i<r.length;i++)for(let a=0;a<r[i].length;a++){let c=r[i][a],u=X[c];u&&t.drawImage(u,a*e,i*e,e,e)}}function oe(t){let e=w(t);for(let n=0;n<e.length;n++)for(let o=0;o<e[n].length;o++)e[n][o]=e[n][o]===6?1:0;return e}var v=class{constructor(e,n=null){this.value=e,this.children=[],this.parent=n}addChild(e){e.parent=this,this.children.push(e)}copyValue(){return{...this.value}}};var A=class{constructor(){this.boxes={}}addBox(e){this.boxes[e.id]={...e}}removeBox(e){delete this.boxes[e]}collides(e){let n=Object.keys(this.boxes);for(let o=0;o<n.length;o++){let r=n[o],i=this.boxes[r];if(e.startX<i.endX&&e.endX>i.startX&&e.startY<i.endY&&e.endY>i.startY)return!0}return!1}};function l(t,e){return Math.floor(Math.random()*(e-t+1)+t)}function k(t){return t[Math.floor(Math.random()*t.length)]}function y(t){return{id:t.value.id,startX:t.value.position.x,endX:t.value.position.x+t.value.dimensions.width,startY:t.value.position.y,endY:t.value.position.y+t.value.dimensions.height}}function L(t){let e=0,n=0;m(o=>{o.value.position.x<e&&(e=o.value.position.x),o.value.position.y<n&&(n=o.value.position.y)},t),m(o=>{o.value.position.x+=Math.abs(e),o.value.position.y+=Math.abs(n),o.value.corridor&&(o.value.corridor.position.x+=Math.abs(e),o.value.corridor.position.y+=Math.abs(n))},t)}function b(t,e,n,o){let r=Math.max(t,n),i=Math.min(e,o);return r>i?null:[r,i]}function _(t,e){if(t.startY>=e.endY)return"n";if(t.endY<=e.startY)return"s";if(t.startX>=e.endX)return"w";if(t.endX<=e.startX)return"e";throw new Error(`Could not determine child "${e.id}" direction against parent "${t.id}".`)}function G(t){let e=se(t);return ae(e),L(e),e}function se(t){return $(t,"start")}function $(t,e){let n=t[e];if(!n)throw new Error(`Could not find "${e}" to generate tree.`);let o=new v({id:n.id,type:n.type});return n.children.map(r=>{let i=$(t,r);o.addChild(i)}),o}function ae(t){let e=new A,n=[t],o=1e3;for(;n.length>0;){let r=n.shift();try{V(e,r),ce(e,r)}catch{if(o===0)throw new Error("Could not backtrack room generation under ");let a=r.parent;n.unshift(a),e.removeBox(`room-${a.value.id}`),e.removeBox(`corridor-${a.value.id}`);for(let c of a?.children)e.removeBox(`room-${c.value.id}`),e.removeBox(`corridor-${c.value.id}`);o-=1}for(let i of r.children)n.push(i)}return t}function V(t,e,n=20){if(n===0)throw new Error(`Could not place room under "${20}" iterations.`);let o=ue(e),r=le(e,o),i={id:`room-${e.value.id}`,startX:r.x,startY:r.y,endX:r.x+o.width,endY:r.y+o.height};if(t.collides(i))return V(t,e,n-1);e.value.dimensions=o,e.value.position=r,t.addBox(i)}function ce(t,e,n=20){if(!e.parent)return;if(n===0)throw new Error(`Could not place corridor under "${20}" iterations.`);let o=me(e.parent,e),r={id:`corridor-${e.value.id}`,startX:o.position.x,startY:o.position.y,endX:o.position.x+o.dimensions.width,endY:o.position.y+o.dimensions.height};if(t.collides(r))throw new Error("Could not place corridor as it is colliding.");e.value.corridor=o,t.addBox(r)}function ue(t){switch(t.value.type){case"start":return{width:l(5,6),height:l(5,6)};case"room":return{width:l(8,12),height:l(8,12)};case"boss":return{width:l(12,20),height:l(12,20)};case"end":return{width:l(5,7),height:l(5,7)}}}function le(t,e){if(!e)throw new Error(`Cannot generate position without dimensions on node "${t.value.id}".`);if(!t.parent)return{x:0-Math.floor(e.width/2),y:0-Math.floor(e.height/2)};let n=k(["n","s","e","w"]),o=l(3,6),r=4,i=y(t.parent);switch(n){case"n":{let a=i.startX-e.width+r,c=i.endX-r;return{x:l(a,c),y:i.startY-o-e.height}}case"w":{let a=i.startY-e.height+r,c=i.endY-r;return{x:i.startX-o-e.width,y:l(a,c)}}case"s":{let a=i.startX-e.width+r,c=i.endX-r;return{x:l(a,c),y:i.endY+o}}case"e":{let a=i.startY-e.height+r,c=i.endY-r;return{x:i.endX+o,y:l(a,c)}}}}function me(t,e){let n=y(t),o=y(e),r={x:0,y:0},i={width:0,height:0},a=_(n,o);switch(a){case"n":{let c=Math.abs(n.startY-o.endY),u=T(n,o,a),f=Math.abs(u[0]-u[1])-4,g=Math.floor(f/2);r.x=u[0]+g,r.y=o.endY,i.width=4,i.height=c}break;case"s":{let c=Math.abs(n.endY-o.startY),u=T(n,o,a),f=Math.abs(u[0]-u[1])-4,g=Math.floor(f/2);r.x=u[0]+g,r.y=n.endY,i.width=4,i.height=c}break;case"e":{let c=Math.abs(n.endX-o.startX),u=T(n,o,a),f=Math.abs(u[0]-u[1])-4,g=Math.floor(f/2);r.x=n.endX,r.y=u[0]+g,i.width=c,i.height=4}break;case"w":{let c=Math.abs(n.startX-o.endX),u=T(n,o,a),f=Math.abs(u[0]-u[1])-4,g=Math.floor(f/2);r.x=o.endX,r.y=u[0]+g,i.width=c,i.height=4}break}return{position:r,dimensions:i}}function T(t,e,n){let o;switch(n){case"n":o=b(t.startX,t.endX,e.startX,e.endX);break;case"s":o=b(t.startX,t.endX,e.startX,e.endX);break;case"e":o=b(t.startY,t.endY,e.startY,e.endY);break;case"w":o=b(t.startY,t.endY,e.startY,e.endY);break}if(!o)throw new Error("Could not find overlapping segment.");return o}var C={start:{id:"start",type:"start",children:["A","F"]},A:{id:"A",type:"room",children:["B"]},B:{id:"B",type:"room",children:["C","D"]},C:{id:"C",type:"room",children:[]},D:{id:"D",type:"room",children:["E"]},E:{id:"E",type:"room",children:[]},F:{id:"F",type:"room",children:["G","H"]},G:{id:"G",type:"room",children:[]},H:{id:"H",type:"room",children:["I"]},I:{id:"I",type:"room",children:["J"]},J:{id:"J",type:"room",children:["K","L"]},K:{id:"K",type:"room",children:["boss"]},L:{id:"L",type:"room",children:[]},boss:{id:"boss",type:"boss",children:["end"]},end:{id:"end",type:"end",children:[]}};var K={start:{id:"start",type:"start",children:["A","B"]},A:{id:"A",type:"room",children:["C"]},B:{id:"B",type:"room",children:["D"]},C:{id:"C",type:"room",children:["E","F"]},D:{id:"D",type:"room",children:[]},E:{id:"E",type:"room",children:["boss"]},F:{id:"F",type:"room",children:[]},boss:{id:"boss",type:"boss",children:["G","end"]},G:{id:"G",type:"room",children:[]},end:{id:"end",type:"end",children:[]}};var P={start:{id:"start",type:"start",children:["A"]},A:{id:"A",type:"room",children:["B","C"]},B:{id:"B",type:"room",children:[]},C:{id:"C",type:"room",children:["boss"]},boss:{id:"boss",type:"boss",children:["end"]},end:{id:"end",type:"end",children:[]}};var D=C;function M(){let t=I("Generate \u2705",()=>G(D));I("Draw \u2705",()=>Y(t))}window.onload=()=>{M();let t=document.getElementById("select-graph");t.onchange=o=>{switch(o.currentTarget.value){case"small":D=P;break;case"medium":D=K;break;case"large":D=C;break}M()};let e=document.getElementById("button-generate");e.onclick=()=>M();let n=document.getElementById("button-github");n.onclick=()=>window.open("https://github.com/halftheopposite/graph-dungeon-generator")};})();
