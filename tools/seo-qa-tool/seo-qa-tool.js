function UrlChecking(url){
  
}


function seaQaTool (){
  fetch(window.location.href).then(response => {
    if (response.status === 200) {
      console.log("Expected Status code")
    } else if(response.status < 400 && response.status > 200) {
      console.log("Hi")
    }
  });
}


export default seaQaTool;