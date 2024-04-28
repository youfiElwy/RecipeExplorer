const express = require("express");
const router = express.Router();

const recipeController = require("../../controllers/recipesController");

router.get("/getall", recipeController.getAllRecipes);
router.get("/get/:id", recipeController.getRecipeById);
router.get("/getuserid/:id", recipeController.getRecipeByUserId);

router.post("/create", recipeController.createRecipe);


module.exports = router;