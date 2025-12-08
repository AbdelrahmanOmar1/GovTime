const API = async (url, method = "GET", body = null) => {
  const config = {
    method,
    credentials: "include",  
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) config.body = JSON.stringify(body);

  const response = await fetch(url, config);

  return response.json();
};

export default API;
