const app = require(`${__dirname}/../apps/app.js`);
const config = require('config');
app.listen(port = config.get('app.port'), (req, res)=>{
    console.log(`Server running on port ${port}`);
});
