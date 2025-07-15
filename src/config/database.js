const { MongoClient } = require("mongodb");

const uri = 'mongodb+srv://NodeMomin:9941nBu7xQwiFjL0@codeflaircluster.eluyhyf.mongodb.net/';

const client = new MongoClient(uri);

const dbName = 'helloWorld';

async function main() {
  await client.connect();
  console.log('Connected successfully to database');
  const db = client.db(dbName);
  const collection = db.collection('users');

  const data = {
    first: 'dilip',
    last: 'trophy'
  }

  await collection.insertOne(data);

  const results = await collection.find({}).toArray();

  console.log('found documents =>', results);

  return 'operation done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());