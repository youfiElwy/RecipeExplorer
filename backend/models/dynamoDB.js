const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const AWS = require('aws-sdk');

const usersTable = process.env.USER_TABLE;
const recipesTable = process.env.RECIPE_TABLE;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const dynamoDB = new AWS.DynamoDB({
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
});

module.exports = {
    createUserDB: async (userName, email, salt, hashedPassword) => {
        const params = {
            TableName: usersTable,
            Item: {
                "userID": { N: Math.floor(Math.random() * 1000000000).toString() },
                "userName": { S: userName },
                "email": { S: email },
                "salt": { S: salt },
                "hashedPassword": { S: hashedPassword }
            }
        };
        return dynamoDB.putItem(params).promise();
    },
    getUserByEmailDB: async (email) => {
        const params = {
            TableName: usersTable,
            FilterExpression: "#email = :emailValue",
            ExpressionAttributeNames: {
                "#email": "email"
            },
            ExpressionAttributeValues: {
                ":emailValue": { S: email }
            }
        };
        return dynamoDB.scan(params).promise();
    },
    getUserByIdDB: async (userID) => {
        const params = {
            TableName: usersTable,
            Key: {
                "userID": { N: userID.toString() }
            }
        };
        return dynamoDB.getItem(params).promise();
    },
    createRecipeDB: async (userID, userName, title, description, ingredients, category, imageName) => {
        const res = await dynamoDB.putItem({
            TableName: recipesTable,
            Item: {
                "recipeID": { N: Math.floor(Math.random() * 1000000000).toString() },
                "userID": { N: userID.toString() },
                "userName": { S: userName },
                "title": { S: title },
                "description": { S: description },
                "ingredients": { L: ingredients.map((ingredient) => ({ S: ingredient }))},
                "category": { S: category },
                "image": { S: imageName },
                "upvotes": { N: "0" },
            }
        }).promise();
        return res;
    },
    getAllRecipesDB: async () => {
        const res = dynamoDB.scan({
            TableName: recipesTable
        }).promise();
        console.log(res);
        return res;
    },

    getRecipeByIdDB: async (recipeID) => {
        const params = {
            TableName: recipesTable,
            Key: {
                "recipeID": { N: recipeID.toString() }
            }
        };
        return dynamoDB.getItem(params).promise();
    },

    getRecipesByUserDB(userID) {
        const params = {
            TableName: recipesTable,
            FilterExpression: "#userID = :userIDValue",
            ExpressionAttributeNames: {
                "#userID": "userID"
            },
            ExpressionAttributeValues: {
                ":userIDValue": { N: userID.toString() }
            }
        };
        return dynamoDB.scan(params).promise();
    },

    deleteUserRecipeDB: async (recipeID) => {
        const params = {
            TableName: recipesTable,
            Key: {
                "recipeID": { N: recipeID.toString() }
            }
        };
        return dynamoDB.deleteItem(params).promise();
    },

    updateRecipeDB: async (recipeID, title, description, ingredients, category, imageName) => {
        const params = {
            TableName: recipesTable,
            Key: {
                "recipeID": { N: recipeID.toString() }
            },
            UpdateExpression: "set title = :t, description = :d, ingredients = :i, category = :c, image = :img",
            ExpressionAttributeValues: {
                ":t": { S: title },
                ":d": { S: description },
                ":i": { L: ingredients.map((ingredient) => ({ S: ingredient })) },
                ":c": { S: category },
                ":img": { S: imageName }
            }
        };
        return dynamoDB.updateItem(params).promise();
    }
}