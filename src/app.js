const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes.js");
const questionsRouter = require('./routes/questionRoutes.js');
const studentsRouter = require('./routes/studentsRoutes.js')
const path=require('path');

const publicFolder=path.join(__dirname,'../public');

app.use(express.json());
app.use(express.static(publicFolder));

app.use("/api/auth", authRoutes);
app.use('/api/questions', questionsRouter);
app.use("/api/students", studentsRouter)

app.get('/test', (req,res) => {
    res.send({response : "Server is running"});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
