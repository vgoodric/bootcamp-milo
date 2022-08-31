async function retireveStatuscode(url){
  await fetch(url).then(response => {
    return response.status;
  });
}


async function seaQaTool (){
  let status = retireveStatuscode(window.location.href)
  console.log(status)
}


export default seaQaTool;