# LinkedDev

A MERN stack web app for developers to connect by creating profiles and making posts and comments.

## Try it

Click [here](https://linkeddev.herokuapp.com/) to try the app:)

## Run it

```javascript
// Clone the repo
git clone https://github.com/shawnchan2014/linked-dev.git

// Get into the project folder
cd linked-dev

// Install dependencies
npm install

// Create a keys_dev.js file under the config folder and put the following code inside it
module.exports = {
  mongoURI: 'YOUR MONGO DB URI',
  secretOrKey: 'YOUR SECRET'
};

// Run the project
npm run dev

```

## Description

- **ES6** and above version **JavaScript**
- Back-end: modeled the profile and post data with **Mongoose** and **MongoDB**, validated inputs with **Validator**, ensured account information security with **Bcrypt**, and authenticated users with **Passport** and **JSON Web Token (JWT)**.
- Front-end: built UI components with **React** and **Bootstrap 4**, managed application states with **Redux** and **Redux Thunk**, and pulled data from back-end **REST APIs** with the HTTP client **Axios**.
- Testing: extensive back-end API testing with **Postman**, front-end page testing with Redux Chrome Extension.

## Hosting

The app itself is hosted on **Heroku**, while the database is hosted on **MongoDB Atlas**.

## License

MIT
