const router = require("express").Router();
const express = require("express")
const Controller = require("../controllers/controller")

router.get("/register",Controller.registerget)
router.get("/login",Controller.loginget)
router.get("/painel",Controller.painel)
router.get("/getByID/:id/:method", Controller.getById);
router.get("/deleteId/:id", Controller.deleteId);
router.get("/searchShip",Controller.SearchShip);
router.get("/CVS",Controller.excelpage);

router.post("/register",Controller.registerpost)
router.post("/login",Controller.loginpost)
router.post("/create",Controller.createPainel)
router.post("/update/:id", Controller.update);


module.exports = router