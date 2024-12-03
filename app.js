const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MongoAdapter = require("@bot-whatsapp/database/mock");

/**
 * Declaramos las conexiones de Mongo
 */

const contactos = [3103885613, 3217798798, 3157686880];

const MONGO_DB_URI =
  "mongodb://root:example@localhost:27017/db_bot?authSource=admin&authMechanism=SCRAM-SHA-1";
const MONGO_DB_NAME = "db_bot";

const flujoDespedida = addKeyword(["chao", "adios", "hasta luego"]).addAnswer([
  "¡Hasta luego! 👋👋👋",
  // "https://wa.me/573135904749?text=Hola%20como%20estas",
]);

const flujoFinal = addKeyword(EVENTS.ACTION).addAnswer(
  "Se canceló por inactividad"
);

// Función para seleccionar un número aleatorio del array 'contactos'
function obtenerNumeroAleatorio() {
  const indiceAleatorio = Math.floor(Math.random() * contactos.length);
  return contactos[indiceAleatorio];
}

const flujoAsesor = addKeyword("asesor")
  .addAnswer(["En un momento seras atentido por uno de nuestros asesores"])
  .addAnswer(
    "⬇⬇⬇ Por favor, presiona el link de abajo y serás atendido por uno de nuestros asesores ⬇⬇⬇",
    {
      delay: 2000,
    }
  )
  .addAnswer(
    `https://wa.me/57${obtenerNumeroAleatorio()}?text=Hola%20estoy%20interesado,%20en%20adquirir%20.....%20`,
    {
      delay: 2000,
    }
  );

const flujoPapeleria = addKeyword("1")
  .addAnswer([
    "Has ingresado al catálogo de *Papelería*",
    "En el link de abajo (⬇⬇⬇) puedes observar nuestro *catálogo*",
  ])
  .addAnswer(
    "https://drive.google.com/file/d/1oTldNGPb_Qc8uw7SbVPG8m2as1h30H0V/view?usp=sharing"
  )
  .addAnswer(
    ["Escribe *asesor* para ser atendido por uno de nuestros asesores"],
    null,
    null,
    [flujoAsesor]
  );

const flujoCosmeticos = addKeyword("2")
  .addAnswer([
    "Has ingresado al catálogo de *Cosméticos*",
    "En el link de abajo (⬇⬇⬇) puedes observar nuestro *catálogo*",
  ])
  .addAnswer(
    "https://drive.google.com/file/d/1Ofa63QJ1yb2reZMq1Dzt18Thh5I-vBPh/view?usp=sharing"
  )
  .addAnswer(
    ["Escribe *asesor* para ser atendido por uno de nuestros asesores"],
    null,
    null,
    [flujoAsesor]
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
  .addAnswer(
    ["Escribe *asesor* para ser atendido por uno de nuestros asesores"],
    null,
    null,
    [flujoAsesor]
  );

const flujoLineas = addKeyword(["conocer", "linea", "lineas"])
  .addAnswer([
    "1️⃣. *Papelería*",
    "2️⃣. *Cosméticos*",
    "3️⃣. *Aseo*",
    "4️⃣. *Medicamentos*",
  ])
  .addAnswer("Selecciona tu opción de preferencia", null, null, [])
  .addAnswer(
    [
      "Selecciona tu opción de preferencia",
      "Debes de responder antes de que transcurran 2 minutos",
    ],
    { capture: true, idle: 60000 * 2 }, // idle: 2000 = 2 segundos
    async (ctx, { gotoFlow, inRef }) => {
      if (ctx?.idleFallBack) {
        // Si el tiempo de inactividad se ha agotado, se redirige al flujo final
        return gotoFlow(flujoFinal);
      }

      // Si el usuario responde dentro del tiempo, se puede continuar con el flujo
      // Aquí puedes agregar más lógica si lo necesitas
    },
    [
      flujoCosmeticos,
      flujoPapeleria,
      flujoAseo,
      flujoMedicamentos,
      flujoAsesor,
      flujoDespedida,
    ]
  )
  .addAnswer(
    "Gracias por responder", // Mensaje para agradecer después de una respuesta
    { capture: true }
  );

const flujoCliente = addKeyword(["cliente", "mensaje"])
  .addAction(async (_, { flujoDynamic }) => {
    return await flujoDynamic("¡Hola! ¿En qué puedo ayudarte?");
  })
  .addAction({ capture: true }, async (ctx, { flujoDynamic }) => {
    mensaje = ctx.body;
    return await flujoDynamic(`Un placer: ${mensaje}`);
  });

// const flujoPrincipal = addKeyword(["hola", "ole", "alo", "buenas", "tardes"])
const flujoPrincipal = addKeyword(EVENTS.WELCOME)
  .addAnswer(
    "🙌 Hola ¡Bienvenido al Chat Bot de la *Papelería Universal*! 🎉🖊️",
    {
      media:
        "https://media.licdn.com/dms/image/v2/C561BAQFuDa7bnTijFg/company-background_10000/company-background_10000/0/1608825905089/distribuidora_universal_papeleria_cover?e=1733245200&v=beta&t=8Qxd0qhGmZ2VwvrEQH1Y6g_Ioxy98Qa4AuU8XwZTg1E",
    }
  )
  .addAnswer([
    "Estamos aquí para asesorarte con todo lo que necesites. Si esta interesado en útiles escolares, artículos de oficina, material para manualidades o cualquier otro producto, ¡lo tenemos! No dudes en preguntar por precios, disponibilidad o recomendaciones. ¡Estamos listos para hacer tu experiencia de compra rápida y sencilla!",
  ])
  .addAction(async (_, { flowDynamic }) => {
    return await flowDynamic("¿Cual es tu nombre?");
  })
  .addAction({ capture: true }, async (ctx, { flowDynamic }) => {
    const mensaje = ctx.body;
    return await flowDynamic(`Un placer: ${mensaje}`);
  })
  .addAnswer([
    "1️⃣. *Papelería*",
    "2️⃣. *Cosméticos*",
    "3️⃣. *Aseo*",
    "4️⃣. *Medicamentos*",
    "*Asesor*. *Seras atendido por un asesor*",
  ])
  .addAnswer("Selecciona tu opción de preferencia", null, null, [])
  .addAnswer(
    [
      "Selecciona tu opción de preferencia",
      "Debes de responder antes de que transcurran 2 minutos",
    ],
    { capture: true, idle: 60000 * 2 }, // idle: 2000 = 2 segundos
    async (ctx, { gotoFlow, inRef }) => {
      if (ctx?.idleFallBack) {
        // Si el tiempo de inactividad se ha agotado, se redirige al flujo final
        return gotoFlow(flujoFinal);
      }

      // Si el usuario responde dentro del tiempo, se puede continuar con el flujo
      // Aquí puedes agregar más lógica si lo necesitas
    },
    [
      flujoCosmeticos,
      flujoPapeleria,
      flujoAseo,
      flujoMedicamentos,
      flujoAsesor,
      flujoDespedida,
    ]
  );
// .addAnswer(
//   "Gracias por responder", // Mensaje para agradecer después de una respuesta
//   { capture: true }
// )
// .addAnswer(
//   [
//     "Escribe *conocer*, *linea*, para que puedas ver nuestras lineas de venta",
//   ],
//   null,
//   null,
//   [flujoAsesor]
// );

const main = async () => {
  const adapterDB = new MongoAdapter();
  // const adapterDB = new MongoAdapter({
  //   dbUri: MONGO_DB_URI,
  //   // dbName: MONGO_DB_NAME,
  // });
  const adapterFlow = createFlow([
    flujoPrincipal,
    flujoDespedida,
    // flujoAsesor,
  ]);
  const adapterProvider = createProvider(BaileysProvider);
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
  QRPortalWeb();
};

main();
