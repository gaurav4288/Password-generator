const inputslider=document.querySelector("[data-lengthslider]");
const lengthdisplay=document.querySelector("[data-lengthNumber]");
const passworddisplay=document.querySelector("[data-passwordDisplay]");
const copymsg=document.querySelector("[data-copyMsg]");
const copybtn=document.querySelector("[data-copy]");
const uppercasecheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const numberscheck=document.querySelector("#numbers");
const symbolscheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()_-+=}]{[|\:;"?/>.<,';

let password="";
let passwordlength=10;
let checkcount=0;
//set stregth circle color

//set passwordlength
function handleslider(){
    inputslider.value=passwordlength;
    lengthdisplay.innerText=passwordlength;
    const min=inputslider.min;
    const max=inputslider.max;
    inputslider.style.backgroundSize=((passwordlength-min)*100)/(max-min)+"% 100%";
}
handleslider();

function setindicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

setindicator("#ccc");

function getrndinteger(min,max){
    return Math.floor(Math.random() * (max-min))+min;
}

function generaterndnumber(){
    return getrndinteger(0,9);
}

function generatelowercase(){
    return String.fromCharCode(getrndinteger(97,123));
}

function generateuppercase(){
    return String.fromCharCode(getrndinteger(65,91));
}

function generatesymbol(){
    const randnum=getrndinteger(0,symbols.length);
    return symbols.charAt(randnum);
}

function calcstrength(){
    let hasupper=false;
    let haslower=false;
    let hasnum=false;
    let hassymbol=false;
    if(uppercasecheck.checked) hasupper=true;
    if(lowercasecheck.checked) haslower=true;
    if(numberscheck.checked) hasnum=true;
    if(symbolscheck.checked) hassymbol=true;

    if(hasupper && haslower &&(hasnum || hassymbol) && passwordlength>=8){
        setindicator("#00ff00");
    }
    else if((haslower || hasupper) && (hasnum || hassymbol) && passwordlength>=6)
    {
        setindicator("#FFFF00");
    }
    else{
        setindicator("#FF0000");
    }
}

async function copycontent()
{
    try{
        await navigator.clipboard.writeText(passworddisplay.value);
        copymsg.innerText="Coppied";
    }
    catch(e){
        copymsg.innerText="Failed";
    }
    copymsg.classList.add("active");
    setTimeout( () => {
        copymsg.classList.remove("active");
    },2000);
}

function shufflepassword(arr){
    for(let i=arr.length-1;i>0;i--)
    {
        const j=Math.floor(Math.random()*(i+1));
        const temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
    return arr.join("");
}

function handlecheckboxchange(){
    checkcount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        {
            checkcount++;
        }
    })
    if(passwordlength < checkcount ) {
        passwordlength = checkcount;
        handleslider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handlecheckboxchange);
});

inputslider.addEventListener('input',(e)=>{
    passwordlength=e.target.value;
    handleslider();
});

copybtn.addEventListener('click',()=>{
    copycontent();
});

generateBtn.addEventListener('click',()=>{
    if(checkcount==0)
    {
        return;
    }
    if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleslider();
    }

    if (password.length) password = "";


    let funcarr=[];

    if(uppercasecheck.checked){
        funcarr.push(generateuppercase);
    }
    if(lowercasecheck.checked){
        funcarr.push(generatelowercase);
    }
    if(numberscheck.checked){
        funcarr.push(generaterndnumber);
    }
    if(symbolscheck.checked){
        funcarr.push(generatesymbol)
    }

    for(let i=0;i<funcarr.length;i++)
    {
        password+=funcarr[i]();
    }

    for(let i=0;i<passwordlength-funcarr.length;i++)
    {
        let randindex=getrndinteger(0,funcarr.length);
        password+=funcarr[randindex]();
    }
    password=shufflepassword(Array.from(password));

    passworddisplay.value=password;
    calcstrength();
});