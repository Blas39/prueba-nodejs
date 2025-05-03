import { connect } from "mongoose";
(async () => {
  try {
    const db = await connect(
      "mongodb+srv://blasgrados39:E6bTkUxwESNspXW@cluster0.dwtmidv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("DB CONECTADO a", db.connection.name);
  } catch (error) {
    console.error("Error al conectar a  DB:", error);
  }
})();
