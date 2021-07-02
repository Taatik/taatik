const input = document.querySelector("#input");
const btn = document.querySelector("#btn");
const output = document.querySelector("#output");
const methods = document.querySelector("#methods");

const constructReq = (data) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
};

btn.addEventListener("click", async () => {
  if (methods.value === "none") {
    output.value = "Forgot to choose a language!";
    return;
  }
  const inputVal = input.value || input.placeholder;
  try {
    const data = {
      heb: inputVal,
      method: methods.value,
    };
    const resp = await fetch("/api/transliterate", constructReq(data));

    // check for an error, and print generic message to output
    if (resp.status !== 200) {
      const err = await resp.json();
      output.value = "There was an error!";
      throw new Error(err);
    }

    const json = await resp.json();
    output.value = json.transliteration;
  } catch (e) {
    console.error(e);
  }
});
