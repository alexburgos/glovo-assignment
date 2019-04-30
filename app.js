const Koa = require('koa');
const KoaRouter = require('koa-router');
const serve = require('koa-static')
const cors = require('@koa/cors');
const mount = require('koa-mount');
const jsonfile = require('jsonfile');

const app = new Koa();
const staticPages = new Koa();
const router = new KoaRouter();
const supportedCategories = ['restaurants', 'snacks', 'wonders', 'gifts'];

const PORT = process.env.PORT || 3001;

router.get('/categories', (ctx, next) => {
  let file = './files/categories.json';
  ctx.body = jsonfile.readFileSync(file);
});

router.get('/stores', (ctx, next) => {

  let query = ctx.query;
  if (!query || !query.category) {
    ctx.status = 400;
    ctx.body = 'Wrong query';
    return;
  }

  let category = query.category.toLowerCase();
  if (!supportedCategories.includes(category)) {
    ctx.status = 404;
    ctx.body = 'Wrong category';
    return;
  }``

  let file = `./files/${category}.json`;
  ctx.body = jsonfile.readFileSync(file);
});

staticPages.use(serve(__dirname + '/client/build'));

app
  .use(serve(__dirname + '/client'))
  .use(mount('/', staticPages))
  .use(router.routes())
  .use(cors());

app.listen(PORT, () => {
  console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/", PORT, PORT);
});
