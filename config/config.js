let config = {};

if (Deno.env.get("DATABASE_URL")) {
  config.database = Deno.env.toObject().DATABASE_URL;
} else {
  config.database = {
    hostname: "localhost",
    database: "ropsutius",
    user: "ropsutius",
    port: 5432
  };
}

export {config};
