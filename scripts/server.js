async function callBackend(reqBody, endpoint) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(reqBody);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return await fetch(`./server.php?action=${endpoint}`, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => {
      console.log(error);
      return `ERROR: ${error}`;
    });
}
