import app from "./app";

app.listen(process.env.PORT || 3000, function () {
  console.log(`App en puerto`, process.env.PORT || 3000);
});
