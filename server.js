//Establishes required packages
//Express for server routing
//mysql for server connection
//inquirer for CL inquiry/user input
//const util = require('util');
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

//Establishes port connection
const app = express();
const PORT = process.env.PORT || 3001;

//middleware set-up
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//listens and logs for confirmation of port connection
app.listen(PORT, ()=>{console.log(`You have tuned in to the melodic sounds of PORT:${PORT}`);})