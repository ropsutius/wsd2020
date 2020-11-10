import {decode} from "https://deno.land/std@0.65.0/encoding/utf8.ts";
import {serve} from "https://deno.land/std@0.65.0/http/server.ts";
import {renderFile} from "https://raw.githubusercontent.com/syumai/dejs/master/mod.ts";
import {Client} from "https://deno.land/x/postgres@v0.4.5/mod.ts";

const DATABASE_URL = Deno.env.toObject().DATABASE_URL;
const client = new Client(DATABASE_URL);

let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}

const server = serve({port: port});

const getMessages = async () => {
  await client.connect();
  const messages = await client.query("SELECT * FROM messages");
  await client.end();

  let result = [];
  let sorted = messages.rowsOfObjects().sort((a, b) => {
    return b.id - a.id;
  });
  for (let i = 0; i < Math.min(5, sorted.length); i++) {
    result.push(sorted[i]);
  }
  return result;
};

const addMessage = async request => {
  const body = decode(await Deno.readAll(request.body));
  const params = new URLSearchParams(body);

  const sender = params.get("sender");
  const message = params.get("message");

  await client.connect();
  await client.query(
    "INSERT INTO messages (sender, message) VALUES ($1, $2)",
    sender,
    message
  );
  await client.end();
};

for await (const request of server) {
  if (request.method === "GET" && request.url === "/") {
    const data = {
      messages: await getMessages()
    };
    request.respond({
      body: await renderFile("index.ejs", data)
    });
  } else if (request.method === "POST" && request.url === "/") {
    await addMessage(request);
    request.respond({
      status: 303,
      headers: new Headers({
        Location: request.url
      })
    });
  }
}
