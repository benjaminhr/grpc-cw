const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multiplyMatrixBlock = require("./multiplyMatrixBlock");
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/*
  Register all routes here which are defined in `routes.js`
*/
app.get("/", async (req, res) => {
  // if (!A || !B) {
  //   throw new Error("A or B matrices are undefined");
  // } else if (A[0].constructor !== Array || B[0].constructor !== Array) {
  //   throw new Error("A or B is not a 2D array");
  // }

  // const A = [
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  // ];
  // const B = [
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  //   [1, 2, 3, 4, 1, 2, 3, 4],
  // ];
  const A = [
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
  ];
  const B = [
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
  ];
  // const A = [
  //   [1, 2],
  //   [1, 2],
  // ];
  // const B = [
  //   [1, 2],
  //   [1, 2],
  // ];
  try {
    const resultingMatrix = await multiplyMatrixBlock(A, B);
    res.json(resultingMatrix).status(200);
  } catch (error) {
    console.log(error);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("REST API running on " + port);
});
