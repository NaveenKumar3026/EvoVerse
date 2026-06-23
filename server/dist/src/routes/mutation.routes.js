"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const mutation_controller_1 = require("../controllers/mutation.controller");
const router = (0, express_1.Router)();
router.post("/:speciesId", auth_middleware_1.authenticate, mutation_controller_1.mutateSpeciesHandler);
exports.default = router;
