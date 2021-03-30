const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const multiplyMatrixBlock = require("./multiplyMatrixBlock");
const app = express();

app.use(cors());
// app.use(express.json());
app.use(fileUpload());
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

/*
  POST /multiply endpoint
  Expects two files two be uploaded
*/
app.post("/multiply", async (req, res) => {
  // Error handling for when no files where uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("Request is missing files A and B");
  }

  // Error for when there are files but they are not named correctly in request body
  if (!req.files.hasOwnProperty("A")) {
    return res.status(400).send('Request is missing file "A"');
  }

  // Error for when there are files but they are not named correctly in request body
  if (!req.files.hasOwnProperty("B")) {
    return res.status(400).send('Request is missing file "B"');
  }

  const fileA = req.files.A.data.toString();
  const fileB = req.files.B.data.toString();

  console.log(fileA);
  console.log(fileB);

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
