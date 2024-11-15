const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  addChild,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mongo");

/**
 * Declaramos las conexiones de Mongo
 */

// const MONGO_DB_URI = "mongodb://0.0.0.0:27017";
const MONGO_DB_URI =
  "mongodb://root:example@localhost:27017/db_bot?authSource=admin&authMechanism=SCRAM-SHA-1";
// const MONGO_DB_NAME = "db_bot";

const flowDespedida = addKeyword(["chao", "adios", "hasta luego"]).addAnswer([
  "¡Hasta luego! 👋👋👋",
  // "https://wa.me/573135904749?text=Hola%20como%20estas",
]);

const flowAsesor = addKeyword("asesor").addAnswer([
  "En un momento seras atentido por uno de nuestros asesores",
  "https://wa.me/573135904749?text=Hola%20como%20estas",
]);

const flowArte = addKeyword("1").addAnswer([
  "Has ingresado al catálogo de *Arte*",
  "En el link de abajo (⬇⬇⬇) puedes observar nuestro *catálogo*",
]);

const flowAseo = addKeyword("2")
  .addAnswer([
    "Has ingresado al catálogo de *Aseo*",
    "En el link de abajo (⬇⬇⬇) puedes observar nuestro *catálogo*",
  ])
  .addAnswer(
    "https://drive.google.com/file/d/1LkJoJHlypJ8-LpuhMN229GSofysYxHPm/view?usp=sharing",
    {
      delay: 1500,
    }
  );

const flowCacharro = addKeyword("3").addAnswer([
  "Has ingresado al catalogo de Cacharro",
]);

const flowCosmeticos = addKeyword("4")
  .addAnswer([
    "Has ingresado al catálogo de *Cosméticos*",
    "En el link de abajo (⬇⬇⬇) puedes observar nuestro *catálogo*",
  ])
  .addAnswer(
    "https://drive.google.com/file/d/1Ofa63QJ1yb2reZMq1Dzt18Thh5I-vBPh/view?usp=sharing"
  );

const flowPapeleria = addKeyword("5")
  .addAnswer([
    "Has ingresado al catálogo de *Papelería*",
    "En el link de abajo (⬇⬇⬇) puedes observar nuestro *catálogo*",
  ])
  .addAnswer(
    "https://drive.google.com/file/d/1oTldNGPb_Qc8uw7SbVPG8m2as1h30H0V/view?usp=sharing"
  );

const flowLineas = addKeyword(["pedir", "linea", "lineas"])
  .addAnswer([
    "\n",
    "1. *Arte*",
    "2, *Aseo*",
    "3, *Cacharro*",
    "4, *Cosméticos*",
    "5, *Papelería*",
    "6, *Tecnología*",
    // "5, *Institucional*",
  ])
  .addAnswer("Selecciona tu opción de preferencia", null, null, [
    flowArte,
    flowCacharro,
    flowCosmeticos,
    flowPapeleria,
    flowAseo,
    flowAsesor,
    flowDespedida,
  ]);

const flowPrincipal = addKeyword(["hola", "ole", "alo", "buenas", "tardes"])
  .addAnswer(
    "🙌 Hola ¡Bienvenido al Chat Bot de la *Papelería Universal*! 🎉🖊️"
  )
  .addAnswer([
    "Estamos aquí para ayudarte con todo lo que necesites. Ya sea que busques útiles escolares, artículos de oficina, material para manualidades o cualquier otro producto, ¡lo tenemos! No dudes en preguntar por precios, disponibilidad o recomendaciones. ¡Estamos listos para hacer tu experiencia de compra rápida y sencilla!",
  ])
  .addAnswer("Escribe *pedir* si te interesa algo", null, null, [flowLineas]);

const main = async () => {
  const adapterDB = new MockAdapter({
    dbUri: MONGO_DB_URI,
    // dbName: MONGO_DB_NAME,
  });
  // const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal, flowAsesor, flowDespedida]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
