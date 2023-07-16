import express from "express"
import { router } from "./routes";

const app = express();

app.use(express.json());
app.use(router);
app.use(express.urlencoded({ extended: false }));

const PORT = 3333;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))