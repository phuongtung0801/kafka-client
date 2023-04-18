import Express from 'express';

const app = Express();
const port = 3000;

app.get('/', (req: any, res: any) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});