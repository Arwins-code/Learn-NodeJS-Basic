const http = require("http");

const requestListener = (request, response) => {
  response.setHeader("Content-Type", "application/json");
  //custom header response harus diawali dengan X-
  response.setHeader("X-Powered-By", "NodeJS");

  //response.statusCode = 200;
  //response.end("<h1>Halo HTTP server pertama!</h1>");

  const { method, url } = request; //ini sama dengan const method = request.method;

  if (url === "/") {
    if (method === "GET") {
      response.statusCode = 200;
      response.end(
        JSON.stringify({ message: "Hallo ini adalah halam Home Page" })
      );
    } else {
      response.statusCode = 400;
      response.end(
        JSON.stringify({
          message: `Halaman ini tidak dapat diakses dengan ${method}`,
        })
      );
    }
  } else if (url === "/about") {
    if (method === "GET") {
      response.statusCode = 200;
      response.end(
        JSON.stringify({ message: `Hallo ini adalah halama ${url}` })
      );
    } else if (method === "POST") {
      //di dalam if POST method ini kita menerapkan logika stream readableStream
      let body = []; //untuk menampung return respons

      request.on("data", (chunk) => {
        body.push(chunk);
      });

      request.on("end", () => {
        body = Buffer.concat(body).toString();

        const { name } = JSON.parse(body); // ini untuk mengubah JSON String jadi JS Object
        response.statusCode = 200;

        response.end(
          JSON.stringify({ message: `Hello ${name} ini adalah halaman ${url}` })
        );
      });
    } else {
      response.statusCode = 400;
      //response.end(`<h1>Halaman tidak dapat diakses dengan ${method} </h1>`);
      response.end(
        JSON.stringify({
          message: `Halaman ini tidak dapat diakses dengan ${method}`,
        })
      );
    }
  } else {
    response.statusCode = 404;
    //response.end("<h1>Halaman tidak ditemukan</h1>");
    response.end(
      JSON.stringify({
        message: "Halaman tidak ditemukan!",
      })
    );
  }
};
const server = http.createServer(requestListener);

const port = 5000;
const host = "localhost";

server.listen(port, host, () => {
  console.log(`server sedang berjalan pada http://${host}:${port}`);
});

//console.log('Halo, kita akan belajar membuat server');

// response should be :
// curl -X GET http://localhost:5000/about
// // output: <h1>Halo! Ini adalah halaman about</h1>
// curl -X POST -H "Content-Type: application/json" http://localhost:5000/about -d "{\"name\": \"Dicoding\"}"
// // output: <h1>Halo, Dicoding! Ini adalah halaman about</h1>
// curl -X PUT http://localhost:5000/about
// // output: <h1>Halaman tidak dapat diakses menggunakan PUT request</h1>
// curl -X DELETE http://localhost:5000/about
// // output: <h1>Halaman tidak dapat diakses menggunakan DELETE request</h1>
