import { app } from "./app";

const port: number = 3520;

app.listen(port, (): void => {
    console.log("Express listening on port", port);
});