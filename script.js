let i = 0;
function change(){
	i++;
	if (i % 2 == 0){
		document.getElementById("myStyle").innerHTML = "";
	}
	else{
		document.getElementById("myStyle").innerHTML = "#main {align-items: center;}";
	}
}