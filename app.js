const {
  createBot,
  createProvider,
  createflujo,
  addKeyword,
  addChild,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mongo");
// const mensaje = "";

/**
 * Declaramos las conexiones de Mongo
 */

// const MONGO_DB_URI = "mongodb://0.0.0.0:27017";
const MONGO_DB_URI =
  "mongodb://root:example@localhost:27017/db_bot?authSource=admin&authMechanism=SCRAM-SHA-1";
// const MONGO_DB_NAME = "db_bot";

const flujoDespedida = addKeyword(["chao", "adios", "hasta luego"]).addAnswer([
  "¡Hasta luego! 👋👋👋",
  // "https://wa.me/573135904749?text=Hola%20como%20estas",
]);

const flujoAsesor = addKeyword("asesor").addAnswer([
  "En un momento seras atentido por uno de nuestros asesores",
  "https://wa.me/573135904749?text=Hola%20como%20estas",
]);

// const flujoArte = addKeyword("1").addAnswer([
//   "Has ingresado al catálogo de *Arte*",
//   "En el link de abajo (⬇⬇⬇) puedes observar nuestro *catálogo*",
// ]);
// const flujoCacharro = addKeyword("3").addAnswer([
//   "Has ingresado al catalogo de Cacharro",
// ]);

const flujoPapeleria = addKeyword("1")
  .addAnswer([
    "Has ingresado al catálogo de *Papelería*",
    "En el link de abajo (⬇⬇⬇) puedes observar nuestro *catálogo*",
  ])
  .addAnswer(
    "https://drive.google.com/file/d/1oTldNGPb_Qc8uw7SbVPG8m2as1h30H0V/view?usp=sharing"
  )
  .addAction(async (_, { flujoDynamic }) => {
    return await flujoDynamic(`Buenas! ¿Cual es tu nombre? ${mensaje}`);
  });

const flujoCosmeticos = addKeyword("2")
  .addAnswer([
    "Has ingresado al catálogo de *Cosméticos*",
    "En el link de abajo (⬇⬇⬇) puedes observar nuestro *catálogo*",
  ])
  .addAnswer(
    "https://drive.google.com/file/d/1Ofa63QJ1yb2reZMq1Dzt18Thh5I-vBPh/view?usp=sharing"
  );

const flujoAseo = addKeyword("3")
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

const flujoMedicamentos = addKeyword("4")
  .addAnswer([
    "Has ingresado al catálogo de *Papelería*",
    "En el link de abajo (⬇⬇⬇) puedes observar nuestro *catálogo*",
  ])
  .addAnswer(
    "https://drive.google.com/file/d/1FN1J-NYr1TVUnYfPndpNDvqPCPVk6_LY/view?usp=sharing"
  )
  .addAction(async (_, { flujoDynamic }) => {
    return await flujoDynamic(`Buenas! ¿Cual es tu nombre? ${mensaje}`);
  });

const flujoLineas = addKeyword(["pedir", "linea", "lineas"])
  .addAnswer([
    "1. *Papelería*",
    "2. *Cosméticos*",
    "3. *Aseo*",
    "4. *Medicamentos*",
    // "6. *Tecnología*",
    // "1. *Arte*",
    // "5, *Institucional*",
  ])
  .addAnswer("Selecciona tu opción de preferencia", null, null, [
    flujoCosmeticos,
    flujoPapeleria,
    flujoAseo,
    flujoMedicamentos,
    flujoAsesor,
    flujoDespedida,
    // flujoArte,
    // flujoCacharro,
  ]);

const flujoSecundario = addKeyword(["segundo", "mensaje"])
  .addAction(async (_, { flujoDynamic }) => {
    return await flujoDynamic("¡Hola! ¿En qué puedo ayudarte?");
  })
  .addAction({ capture: true }, async (ctx, { flujoDynamic }) => {
    mensaje = ctx.body;
    return await flujoDynamic(`Has dicho: ${mensaje}`);
  });

// const flujoBotones = addKeyword(["botones", "boton"]).addAnswer(
//   "Aqui va un mensaje",
//   {
//     buttons: [{ body: "opcion 1" }, { body: "opcion 2" }, { body: "opcion 3" }],
//   }
// );

const flujoPrincipal = addKeyword(["hola", "ole", "alo", "buenas", "tardes"])
  .addAnswer(
    "🙌 Hola ¡Bienvenido al Chat Bot de la *Papelería Universal*! 🎉🖊️",
    {
      media:
        "https://media.licdn.com/dms/image/v2/C561BAQFuDa7bnTijFg/company-background_10000/company-background_10000/0/1608825905089/distribuidora_universal_papeleria_cover?e=1732550400&v=beta&t=-PYBhIyKlbh_b8LFGzJAy59JYNZ4qMHcilw8nqDI_Mo",
    }
  )
  .addAnswer([
    "Estamos aquí para ayudarte con todo lo que necesites. Ya sea que busques útiles escolares, artículos de oficina, material para manualidades o cualquier otro producto, ¡lo tenemos! No dudes en preguntar por precios, disponibilidad o recomendaciones. ¡Estamos listos para hacer tu experiencia de compra rápida y sencilla!",
  ])
  .addAnswer("Escribe *pedir* si te interesa algo", null, null, [flujoLineas]);



  
async function main() {
  const adapterDB = new MockAdapter({
    dbUri: MONGO_DB_URI,
    // dbName: MONGO_DB_NAME,
  });
  // const adapterDB = new MockAdapter();
  const adapterflujo = createflujo([
    flujoPrincipal,
    flujoAsesor,
    flujoDespedida,
    flujoSecundario,
    // flujoBotones,
  ]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flujo: adapterflujo,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
}

main();
