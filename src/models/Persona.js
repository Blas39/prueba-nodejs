import mongoose from "mongoose";

const personaSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  numero: String,
  pais: String,
});

export default mongoose.model("Persona", personaSchema);
