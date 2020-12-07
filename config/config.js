let config = {};

if (Deno.env.get("DATABASE_URL")) {
  config.database = Deno.env.toObject().DATABASE_URL;
} else {
  config.database = {
    hostname: Deno.env.get("DBHOST"),
    database: Deno.env.get("DBDATABASE"),
    user: Deno.env.get("DBUSER"),
    port: Number(Deno.env.get("DBPORT"))
  };
}

export { config };
