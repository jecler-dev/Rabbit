const css=document.createElement("style");

css.innerHTML=`

.rabbitSidebar{
width:210px;
background:#f4e4bc;
padding:10px;
border-right:1px solid #c9b07b;
}

.rabbitMenuItem{
display:flex;
align-items:center;
gap:8px;
cursor:pointer;
margin-bottom:8px;
padding:8px;
border-radius:6px;
background:#e8d5a3;
border:1px solid #b99b5f;
transition:.2s;
}

.rabbitMenuItem:hover{
background:#d9bf84;
}

.rabbitMenuItem.active{
background:#cfa95c;
font-weight:bold;
}

.rabbitMenuIcon{
width:20px;
text-align:center;
}

.rabbitGrid{
display:grid;
grid-template-columns:1fr 1fr;
gap:12px;
}

.rabbitCard{
background:#f7f2e4;
border:1px solid #d6c49a;
border-radius:10px;
padding:14px;
}

.rabbitCardTop{
display:flex;
justify-content:space-between;
align-items:center;
}

.rabbitTitle{
font-weight:bold;
}

.rabbitSub{
font-size:12px;
color:#777;
}

/* SWITCH */

.twSwitch{position:relative;width:42px;height:22px;display:inline-block;}
.twSwitch input{opacity:0;width:0;height:0;}

.twSlider{
position:absolute;
top:0;left:0;right:0;bottom:0;
background:#ccc;
border-radius:20px;
transition:.3s;
cursor:pointer;
}

.twSlider:before{
content:"";
position:absolute;
height:16px;width:16px;
left:3px;bottom:3px;
background:white;
border-radius:50%;
transition:.3s;
}

.twSwitch input:checked + .twSlider{
background:#4CAF50;
}

.twSwitch input:checked + .twSlider:before{
transform:translateX(20px);
}

`;

document.head.appendChild(css);
