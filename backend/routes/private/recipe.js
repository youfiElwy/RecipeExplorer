const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const recipeController = require("../../controllers/recipesController");

router.get("/getall", recipeController.getAllRecipes);
router.get("/get/:id", recipeController.getRecipeById);
router.get("/getuserrecipes", recipeController.getUserRecipes);
router.post("/update/:id", recipeController.updateRecipe);
router.post("/delete/:id", recipeController.deleteRecipe);

router.post("/create", upload.single('image'),recipeController.createRecipe);


module.exports = router;