const fs = require("fs");

const userList = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

////////////////////////////////////////////////////////////////////
// VIEW ALL USERS
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    results: userList.length,
    data: {
      userList,
    },
  });
};

////////////////////////////////////////////////////////////////////
// VIEW SPECIFIC TOUR BY ID
exports.getUser = (req, res) => {
  console.log(req.params);

  // * 1 turns string into int
  const id = req.params.id * 1;
  const user = tourList.find((el) => el.id === id);

  // Error if tours does not exist
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: `success`,
    data: {
      user: user,
    },
  });
};

////////////////////////////////////////////////////////////////////
// ADD A TOUR BY UPDATING ALL
exports.createUser = (req, res) => {
  const newId = tourList[tourList.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);

  userList.push(newUser);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(userList),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          user: newUser,
        },
      });
    }
  );
  res.send("done");
};

////////////////////////////////////////////////////////////////////
// UPDATING WITH PATCH
exports.updateUser = (req, res) => {
  if (req.params.id * 1 > userList.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated user here...>",
    },
  });
}


////////////////////////////////////////////////////////////////////
// DELETE
exports.deleteUser = (req, res) => {
  if (req.params.id * 1 > userList.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
}