const router = require('./src/diy-router');
const app = router();
const fs = require('fs');
const port = 3000;

function writeUserData(reqdata) {
  fs.readFile('./htmlFile/user.json', 'utf-8', function (err, data) {
    if (err) {
      throw err;
    }

    let arrayOfObjects = JSON.parse(data);
    let parseReqdata = JSON.parse(reqdata);
    arrayOfObjects["user"].push(parseReqdata);
    console.log(arrayOfObjects);

    fs.writeFile('./htmlFile/user.json', JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
      if (err) {
        throw err;
      }

      console.log('Done!')
    })
  })
}


function readUserData(login) {
  fs.readFile('./htmlFile/user.json', 'utf-8', function (err, data) {
    if (err) {
      throw err;
    }

    let arrayOfObjects = JSON.parse(data);
    let {
      id,
      password
    } = login;
    let userData = arrayOfObjects["user"];
    for (let key in userData) {
      if (userData[key]['id'] === id && userData[key]['password'] === password) {
        return true;
      }
    }

    return false;
  })
}


app.post('/signup', (req, res) => {
  req.on('data', function (reqData) {
    const addUser = reqData.toString();
    writeUserData(addUser);
    res.send(JSON.stringify({
      error: false
    }));

  });
});

app.post('/', (req, res) => {
  req.on('data', function (loginData) {
    const loginResult = readUserData(loginData);
    if (loginResult === true) {
      res.send(JSON.stringify({
        error: false
      }))
    }
    res.send(JSON.stringify({
      error: true
    }));

  });
});

app.get('/todolist', (req, res) => {
  res.send('htmlFile/todolist.html');
})

app.get('/', (req, res) => {
  res.send('htmlFile/homepage.html');
});

app.get('/signup', (req, res) => {
  res.send('htmlFile/signup.html')
})

app.get('/test-route', (req, res) => res.send('Testing testing'));
app.get('/user/:username', (req, res) => {
  const users = [{
      username: 'johndoe',
      name: 'John Doe'
    },
    {
      username: 'janesmith',
      name: 'Jane Smith'
    }
  ];
  const user = users.find(user => user.username === req.params.username);

  res.send(`Hello, ${user.name}!`);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));