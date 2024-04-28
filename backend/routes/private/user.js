const express = require("express");
const router = express.Router();

const recipeController = require("../../controllers/recipesController");

router.get("/recipe/getall", recipeController.getAllRecipes);
router.get("/recipe/get/:id", recipeController.getRecipeById);
router.get("/recipe/getuserid/:id", recipeController.getRecipeByUserId);

router.post("/recipe/create", recipeController.createRecipe);


module.exports = router;