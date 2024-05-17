const crypto = require('crypto');

const { createRecipeDB, deleteUserRecipeDB, getAllRecipesDB, getRecipeByIdDB, getRecipesByUserDB, updateRecipeDB } = require('../models/dynamoDB');
const { getImage, getSignedUrl , uploadFile, deleteFile } = require('../models/s3');

const recipeController = {
    createRecipe: async (req, res) => { // Create
      console.log("Recipe controller");
        try{
          const { userID, userName } = res.locals;

          const { title, description, ingredients, category } = req.body;

          const imageName = crypto.randomBytes(32).toString('hex') + '.' + req.file.mimetype.split('/')[1];
          // req.file.mimetype = req.file.mimetype.split('/')[1];
          console.log(req.file.mimetype);

          const result = await uploadFile(req.file.buffer, imageName, req.file.mimetype).then((data) => data).catch((error) => error);
          if (result.$metadata.httpStatusCode !== 200) {
            return res.status(400).json({ error: 'Internal Server Error!' });
          }
          console.log("Result: ", result);

          const newRecipe = await createRecipeDB(userID, userName, title, description, ingredients, category, imageName).then((data) => data)
          .catch((error) => {
            return error;
          });

          console.log("New recipe: ", newRecipe);
          return res.status(200).json({ message: 'Recipe created!' });
        }
        catch (e){
            return res.status(400).json({ error: 'Couldnt create recipe!' });
        }
        
    },
    getAllRecipes: async (req, res) => { // Get
      try{
        console.log("Getting all recipes");
        const recipes = await getAllRecipesDB()
        .then((data) => data.Items)
        .catch((error) => {
          console.error(error);
          return res.status(400).json({ error: 'Couldnt retrieve recipes! ' + error });
        });
        console.log("recipes: ", recipes);
        
        const images = await Promise.all(recipes.map(async (recipe) => {
          console.log("recipe: ", recipe);
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
            ingredients: recipe.ingredients.L.map((ingredient) => ingredient.S),
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

        console.log("id: ", id);

        if (isNaN(id)) {
          return res.status(400).json({ error: 'Invalid recipe ID!' });
        }

        console.log("Getting recipe by id: ", id);

        var recipe = await getRecipeByIdDB(id).catch((error) => {
          console.error(error);
          return res.status(400).json({ error: 'Couldnt retrieve recipe! ' + error });
        });
        
        console.log("recipe: ", recipe);

        recipe = {
            recipeID: recipe.Item.recipeID.N,
            userID: recipe.Item.userID.N,
            userName: recipe.Item.userName.S,
            title: recipe.Item.title.S,
            description: recipe.Item.description.S,
            ingredients: recipe.Item.ingredients.L.map((ingredient) => ingredient.S),
            category: recipe.Item.category.S,
            image: await getSignedUrl(recipe.Item.image.S),
            upvotes: recipe.Item.upvotes.N
          };
          console.log("recipe: ", recipe);

        return res.status(200).json(recipe);
      }
      catch (e){
        return res.status(400).json({ error: 'Couldnt retrieve recipe!' });
      }
    },
    getUserRecipes: async (req, res) => { // Get
      try{
        const userID = res.locals.userID;

        const recipes = await getRecipesByUserDB(userID).then((data) => data.Items).catch((error) => {
          return res.status(400).json({ error: 'Couldnt retrieve recipes! ' + error });
        });

        const images = await Promise.all(recipes.map(async (recipe) => {
          const image = await getImage(recipe.image.S).then((data) => data).catch((error) => error);
          return { key: recipe.image.S, url: image };
        })).catch((error) => {
          return res.status(400).json({ error: 'Couldnt retrieve images! ' + error });
        });

        const recipesArray = recipes.map((recipe) => {
          const image = images.find((img) => img.key === recipe.image.S).url;
          return {
            recipeID: recipe.recipeID.N,
            userID: recipe.userID.N,
            userName: recipe.userName.S,
            title: recipe.title.S,
            description: recipe.description.S,
            ingredients: recipe.ingredients.L.map((ingredient) => ingredient.S),
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
    deleteUserRecipe: async (req, res) => { // Delete
      try{
        const id = req.params.id;
        console.log("Deleting recipe with id: ", id);

        const recipe = await getRecipeByIdDB(id).catch((error) => {
          console.error(error);
          return res.status(400).json({ error: 'Couldnt retrieve recipe! ' + error });
        });


        if (recipe.Item.userID.N !== res.locals.userID) {
          console.error(recipe);
          return res.status(400).json({ error: 'Unauthorized!' });
        }

        const imageName = recipe.Item.image.S;

        console.log("getting result from deleteFile");
        const result = await deleteFile(imageName);
        console.log("result:", result);

        await deleteUserRecipeDB(id).catch((error) => {
          console.error(error);
          return res.status(400).json({ error: 'Couldnt delete recipe! ' + error });
        });
        console.log("Deleted recipe with id: ", id);

        return res.status(200).json({ message: 'Recipe deleted!' });
      }
      catch (e){
        return res.status(400).json({ error: 'Couldnt delete recipe!' });
      }
    },
    updateRecipe: async (req, res) => { // Update
      try{
        const id = req.params.id;
        var recipe = await getRecipeByIdDB(id).catch((error) => {
          console.error(error);
          return res.status(400).json({ error: 'Couldnt retrieve recipe! ' + error });
        });
        console.log("Updating recipe:",recipe);
        
        recipe = {
          recipeID: recipe.Item.recipeID.N,
          userID: recipe.Item.userID.N,
          userName: recipe.Item.userName.S,
          title: recipe.Item.title.S,
          description: recipe.Item.description.S,
          ingredients: recipe.Item.ingredients.L.map((ingredient) => ingredient.S),
          category: recipe.Item.category.S,
          image: recipe.Item.image.S,
          upvotes: recipe.Item.upvotes.N
        };
        console.log("Updating recipe:",recipe);
        
        if (recipe.userID !== res.locals.userID) {
          console.error(recipe);
          return res.status(400).json({ error: 'Unauthorized!' });
        }
        
        const imageName = recipe.image;
        console.log("Image name: ", imageName);

        const { title, description, ingredients, category } = req.body;

        console.log("Title: ", title);
        console.log("Description: ", description);
        console.log("Ingredients: ", ingredients);
        console.log("Category: ", category);
        console.log("Image: ", req.file);

        if (req.file !== undefined) {
          console.log("Deleting file: ", imageName);
          const deleteResult = await deleteFile(imageName).then((data) => data).catch((error) => error);
          console.log("DeleteD result: ", imageName);
          // imageName = imageName.split('.')[0] + '.' + req.file.mimetype.split('/')[1];
          const result = await uploadFile(req.file.buffer, imageName, req.file.mimetype).then((data) => data).catch((error) => error);

          console.log("Result: ", result);

          if (result.$metadata.httpStatusCode !== 200) {
            return res.status(400).json({ error: 'Internal Server Error!' });
          }
        }

        console.log("Updating recipe:",recipe);
        await updateRecipeDB(id, title, description, ingredients, category, imageName).catch((error) => {
          return res.status(400).json({ error: 'Couldnt update recipe! ' + error });
        });
        console.log("Updated recipe:",recipe);

        return res.status(200).json({ message: 'Recipe updated!' });
      }
      catch (e){
        return res.status(400).json({ error: 'Couldnt update recipe!' });
      }
    }
};

module.exports = recipeController;