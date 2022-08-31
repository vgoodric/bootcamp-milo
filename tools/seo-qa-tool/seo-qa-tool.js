function retireveStatuscode(url){
  fetch(url).then(response => {
    return response.status;
  });
}


function seaQaTool (){
  let status = retireveStatuscode(window.location.href)
  console.log(status)
}


export default seaQaTool;