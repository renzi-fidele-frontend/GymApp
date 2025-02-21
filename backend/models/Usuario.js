const mongoose = require("mongoose");

const schemaDoUsuario = new mongoose.Schema(
   {
      nome: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, minLength: 6 }, // Somente para usuários normais
      googleId: { type: String },
      facebookId: { type: String },
      foto: { type: String, required: true },
      criadoEm: { type: Date, default: Date.now },
      // TODO: Estender modelo para suportar rastreiamento do progresso do treino
      tempoDeTreino: { type: Number, default: 0 },
      exercicios: { type: Array, default: [] },
      ultimosExerciciosPraticados: { type: Array, default: [] },
   },
   { collection: "Usuarios" }
);

const Usuario = mongoose.model("Usuario", schemaDoUsuario);

module.exports = Usuario;
