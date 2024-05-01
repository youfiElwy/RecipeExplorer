const crypto = require('crypto');

const { createRecipeDB, deleteUserRecipeDB, getAllRecipesDB, getRecipeByIdDB, getRecipesByUserDB, updateRecipeDB } = require('../models/dynamoDB');
const { getImage, getSignedUrl , uploadFile, deleteFile } = require('../models/s3');

const recipeController = {
    createRecipe: async (req, res) => { // Create
        try{
          const { userID, userName } = res.locals;

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
    getAllRecipes: async (req, res) => { // Get
      try{
        const recipes = await getAllRecipesDB()
        .then((data) => data.Items)
        .catch((error) => {
          return res.status(400).json({ error: 'Couldnt retrieve recipes! ' + error });
        });
        
        const images = await Promise.all(recipes.map(async (recipe) => {
          const image = await getImage(recipe.image.S).then((data) => data).catch((error) => error);
          return { key: recipe.image.S, url: image };
        })).catch((error) => {
          return res.status(400).json({ error: 'Couldnt retrieve images! ' + error });
        });

        console.log("images: ", images);

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
    getRecipeById: async (req, res) => { // Get
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
    getUserRecipes: async (req, res) => { // Get
      try{
        const id = res.locals.userID;
        if (!id) {
          return res.status(400).json({ error: 'Unauthenticated!' });
        }
        const recipes = await getRecipesByUserDB(id).catch((error) => {
          return res.status(400).json({ error: 'Couldnt retrieve recipes! ' + error });
        });
        return res.status(200).json(recipes);
      }
      catch (e){
        return res.status(400).json({ error: 'Couldnt retrieve recipes!' });
      }
    },
    deleteUserRecipe: async (req, res) => { // Delete
      try{
        const id = req.params.id;

        const recipe = await getRecipeByIdDB(id).catch((error) => {
          return res.status(400).json({ error: 'Couldnt retrieve recipe! ' + error });
        });

        if (recipe.$metadata.httpStatusCode !== 200) {
          return res.status(400).json({ error: 'Couldnt retrieve recipe!' });
        }

        if (recipe.Item.userID.N !== res.locals.userID) {
          return res.status(400).json({ error: 'Unauthorized!' });
        }

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
    updateRecipe: async (req, res) => { // Update
      try{
        const id = req.params.id;
        const recipe = await getRecipeByIdDB(id).catch((error) => {
          return res.status(400).json({ error: 'Couldnt retrieve recipe! ' + error });
        });

        if (recipe.$metadata.httpStatusCode !== 200) {
          return res.status(400).json({ error: 'Couldnt retrieve recipe!' });
        }

        if (recipe.Item.userID.N !== res.locals.userID) {
          return res.status(400).json({ error: 'Unauthorized!' });
        }

        const imageName = recipe.image;

        const { title, description, ingredients, category } = req.body;

        const result = uploadFile(req.file.buffer, imageName, req.file.mimetype);

        if (result.$metadata.httpStatusCode !== 200) {
            return res.status(400).json({ error: 'Internal Server Error!' });
        }

        await updateRecipeDB(id, title, description, ingredients, category, imageName).catch((error) => {
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