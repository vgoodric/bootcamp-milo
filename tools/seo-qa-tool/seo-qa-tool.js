function seaQaTool() {
  fetch(window.location.href).then(response => {
    if (response.status === 200) {
      alert("Status Code is correct");
    } else {
      alert("Invalid status code");
    }
  });
}


export default seaQaTool;