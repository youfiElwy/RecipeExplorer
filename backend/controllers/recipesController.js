var AWS = require('aws-sdk');
var eks = require('../eks.json');
const crypto = require('crypto');

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

var region = eks.AWS_REGION;
var accessKeyId = eks.AWS_ACCESS_KEY_ID;
var secretAccessKey = eks.AWS_SECRET_ACCESS_KEY;
var usersTable = eks.USER_TABLE;
var recipesTable = eks.RECIPE_TABLE;

console.log("Recipe Table: ", recipesTable);

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

var dynamoDB = new AWS.DynamoDB({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

const s3Client = new S3Client({
  region: region,
  credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
  }
});

const recipeController = {
    createRecipe: async (req, res) => {
        try{
          console.log(req.body);
          console.log(req.file);

          const { userID, username } = { userID: 1, username: "test" };

          const { title, description, ingredients, category } = req.body;

          const recipeID = Math.floor(Math.random() * 1000000000);

          const imageName = generateFileName();
          
          const params2 = {
              Bucket: "recipe-explorer-image-bucket",
              Key: imageName,
              Body: req.file.buffer,
              ContentType: req.file.mimetype,
          };
          
          const command = new PutObjectCommand(params2);

          const result = await s3Client.send(command);

          if (result.$metadata.httpStatusCode !== 200) {
              return res.status(400).json({ error: 'Internal Server Error!' });
          }

          const newRecipe = await dynamoDB.putItem ({
          Item: {
              "recipeID": {
              N: recipeID.toString()
              },
              "title": {
              S: title
              },
              "description": {
              S: description
              },
              "ingredients": {
              S: ingredients
              },
              "category": {
              S: category
              },
              "image": {
              S: imageName
              },
              "userID": {
              N: userID.toString()
              },
              "username": {
              S: username
              }
          },
          ReturnConsumedCapacity: "TOTAL",
          TableName: recipesTable,
          }, function (err, data) {
          if (err) {
              console.log("err: ", err);
              return err.code;
          } else {
              console.log("data: ", data);
              return data;
          }
          });
          if (newRecipe instanceof String){
            return res.status(400).json({ error: 'Couldnt create recipe! ' });
          }
          return res.status(200).json(newRecipe);
        }
        catch (e){
            return res.status(400).json({ error: 'Couldnt create recipe!' });
        }
        
    },
    getAllRecipes: async (req, res) => {
      try{
        const recipes = await dynamoDB.scan ({
          TableName: recipesTable,
        }, function (err, data) {
          if (err) {
            console.log("err: ", err);
            return err.code;
          } else {
            console.log("data: ", data);
            return data.Items;
          }
        });
        if (recipes instanceof String){
          return res.status(400).json({ error: 'Couldnt retrieve recipes! ' + recipes });
        }
        return res.status(200).json(recipes);
      }
      catch (e){
        return res.status(400).json({ error: 'Couldnt retrieve recipes!' });
      }
    },
    getRecipeById: async (req, res) => {
      try{
        const id = req.params.id;
        const recipe = await dynamoDB.get ({
          TableName: recipesTable,
          Key: {
            "recipeID": {
              N: id
            }
          }
        }, function (err, data) {
          if (err) {
            console.log("err: ", err);
            return err.code;
          } else {
            console.log("data: ", data);
            return data.Item;
          }
        });
        if (recipe instanceof String){
          return res.status(400).json({ error: 'Couldnt retrieve recipe! ' + recipe });
        }
        return res.status(200).json(recipe);
      }
      catch (e){
        return res.status(400).json({ error: 'Couldnt retrieve recipe!' });
      }
    },
    getRecipeByUserId: async (req, res) => {
      try{
        const id = req.params.id;
        const recipes = await dynamoDB.scan ({
          TableName: recipesTable,
          FilterExpression: "userID = :userID",
          ExpressionAttributeValues: {
            ":userID": {
              N: id
            }
          }
        }, function (err, data) {
          if (err) {
            console.log("err: ", err);
            return err.code;
          } else {
            console.log("data: ", data);
            return data.Items;
          }
        });
        if (recipes instanceof String){
          return res.status(400).json({ error: 'Couldnt retrieve recipes! ' + recipes });
        }
        return res.status(200).json(recipes);
      }
      catch (e){
        return res.status(400).json({ error: 'Couldnt retrieve recipes!' });
      }
    }
};

module.exports = recipeController;