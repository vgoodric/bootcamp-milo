function checkIfExists(name) {
  if ($(name).length) {
    return true;
  } else {
    return false;
  }
}


function seaQaTool() {
  fetch(window.location.href).then(response => {
    if (response.status === 200) {
      alert("Status Code is correct");
    } else {
      alert("Invalid status code");
    }
  });
  var hi = checkIfExists("h1")
  if (hi) {
    console.log("yes")
  } else {
    console.log("no")
  }
}


export default seaQaTool;