const express = require("express");
const router = express.Router();

const recipeController = require("../../controllers/recipesController");

router.post("/getall", recipeController.getAllRecipes);
router.post("/get/:id", recipeController.getRecipeById);
router.post("/getuserrecipes", recipeController.getUserRecipes);
router.put("/update/:id", recipeController.updateRecipe);
router.post("/delete/:id", recipeController.deleteUserRecipe);
router.post("/create", recipeController.createRecipe);


module.exports = router;