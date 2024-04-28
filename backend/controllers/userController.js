const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");

var AWS = require('aws-sdk');
var eks = require('./eks.json');

var region = eks.AWS_REGION;
var accessKeyId = eks.AWS_ACCESS_KEY_ID;
var secretAccessKey = eks.AWS_SECRET_ACCESS_KEY;
var usersTable = eks.USER_TABLE;
var recipesTable = eks.RECIPES_TABLE;

var dynamoDB = new AWS.DynamoDB({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

const userController =
{

}

module.exports = userController;