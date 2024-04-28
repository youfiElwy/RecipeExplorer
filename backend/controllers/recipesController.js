var AWS = require('aws-sdk');
var eks = require('../eks.json');
const crypto = require('crypto');

const { createRecipeDB, deleteUserRecipeDB, getAllRecipesDB, getRecipeByIdDB, getRecipesByUserDB } = require('../models/dynamoDB');
const { getAllImages, getImage, uploadFile, deleteFile } = require('../models/s3');

const recipeController = {
    createRecipe: async (req, res) => {
        try{
          const { userID, userName } = { userID: 1, userName: "test" };

          const { title, description, ingredients, category } = req.body;

          const imageName = crypto.randomBytes(32).toString('hex');

          const result = await uploadFile(req.file.buffer, imageName, req.file.mimetype).then((data) => data).catch((error) => error);
          if (result.$metadata.httpStatusCode !== 200) {
            return res.status(400).json({ error: 'Internal Server Error!' });
          }

          const newRecipe = await createRecipeDB(userID, userName, title, description, ingredients, category, imageName).then((data) => data)
          .catch((error) => {
            error.$metadata.httpStatusCode = 200;
            return error;
          });

          if (newRecipe.$metadata.httpStatusCode !== 200) {
            return res.status(400).json({ error: 'Couldnt create recipe!' });
          }

          return res.status(200).json({ message: 'Recipe created!' });
        }
        catch (e){
            return res.status(400).json({ error: 'Couldnt create recipe!' });
        }
        
    },
    getAllRecipes: async (req, res) => {
      try{
        const recipes = await getAllRecipesDB()
        .then((data) => data.Items)
        .catch((error) => {
          return res.status(400).json({ error: 'Couldnt retrieve recipes! ' + error });
        });
        
        const images = await getAllImages().then((data) => data).catch((error) => { console.log("error: ", error); return error; });

        console.log(images);

        const recipesArray = recipes.map((recipe) => {
          const image = images.find((img) => img.key === recipe.image.S).url;
          return {
            recipeID: recipe.recipeID.N,
            userID: recipe.userID.N,
            userName: recipe.userName.S,
            title: recipe.title.S,
            description: recipe.description.S,
            ingredients: recipe.ingredients.S,
            category: recipe.category.S,
            image: image ? image : '',
            upvotes: recipe.upvotes.N
          };
        });

        return res.status(200).json(recipesArray);
      }
      catch (e){
        return res.status(400).json({ error: 'Couldnt retrieve recipes!' });
      }
    },
    getRecipeById: async (req, res) => {
      try{
        const id = req.params.id;
        const recipe = await getRecipeByIdDB(id).catch((error) => {
          return res.status(400).json({ error: 'Couldnt retrieve recipe! ' + error });
        });
        return res.status(200).json(recipe);
      }
      catch (e){
        return res.status(400).json({ error: 'Couldnt retrieve recipe!' });
      }
    },
    getUserRecipes: async (req, res) => {
      try{
        const id = req.params.id;
        const recipes = await getRecipesByUserDB(id).catch((error) => {
          return res.status(400).json({ error: 'Couldnt retrieve recipes! ' + error });
        });
        return res.status(200).json(recipes);
      }
      catch (e){
        return res.status(400).json({ error: 'Couldnt retrieve recipes!' });
      }
    },
    deleteUserRecipe: async (req, res) => {
      try{
        const id = req.params.id;
        const recipe = await getRecipeByIdDB(id).catch((error) => {
          return res.status(400).json({ error: 'Couldnt retrieve recipe! ' + error });
        });

        const imageName = recipe.image.S;

        const result = deleteFile(imageName);

        if (result.$metadata.httpStatusCode !== 200) {
            return res.status(400).json({ error: 'Internal Server Error!' });
        }

        await deleteUserRecipeDB(id).catch((error) => {
          return res.status(400).json({ error: 'Couldnt delete recipe! ' + error });
        });

        return res.status(200).json({ message: 'Recipe deleted!' });
      }
      catch (e){
        return res.status(400).json({ error: 'Couldnt delete recipe!' });
      }
    },
    updateRecipe: async (req, res) => {
      try{
        const id = req.params.id;
        const recipe = await getRecipeByIdDB(id).catch((error) => {
          return res.status(400).json({ error: 'Couldnt retrieve recipe! ' + error });
        });

        const imageName = recipe.image;

        const result1 = deleteFile(imageName);

        if (result1.$metadata.httpStatusCode !== 200) {
            return res.status(400).json({ error: 'Internal Server Error!' });
        }

        const { title, description, ingredients, category } = req.body;

        const newImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

        const result2 = uploadFile(req.file.buffer, newImageName, req.file.mimetype);

        if (result2.$metadata.httpStatusCode !== 200) {
            return res.status(400).json({ error: 'Internal Server Error!' });
        }

        await updateRecipeDB(id, title, description, ingredients, category, newImageName).catch((error) => {
          return res.status(400).json({ error: 'Couldnt update recipe! ' + error });
        });

        return res.status(200).json({ message: 'Recipe updated!' });
      }
      catch (e){
        return res.status(400).json({ error: 'Couldnt update recipe!' });
      }
    }
};

module.exports = recipeController;