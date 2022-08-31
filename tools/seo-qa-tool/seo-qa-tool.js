function retireveStatuscode(url){
  fetch(url).then(response => {
    return response;
  });
}


function seaQaTool (){
 let response = retireveStatuscode(window.location.href)
 console.log(response.status)
}


export default seaQaTool;