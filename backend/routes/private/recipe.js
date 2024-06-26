const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const recipeController = require("../../controllers/recipesController");

router.get("/getall", recipeController.getAllRecipes);
router.get("/get/:id", recipeController.getRecipeById);
router.get("/getuserrecipes", recipeController.getUserRecipes);
router.put("/update/:id", upload.single('image'), recipeController.updateRecipe);
router.delete("/delete/:id", recipeController.deleteUserRecipe);
router.post("/create", upload.single('image'),recipeController.createRecipe);


module.exports = router;