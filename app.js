const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  addChild,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");

const flowAsesor = addKeyword("asesor").addAnswer([
    "En un momento seras atentido por uno de nuestros asesores",
    "https://wa.me/573246765924?text=Hola%20como%20estas",
  ]);
  

const flowArte = addKeyword("1").addAnswer([
  "Has ingresado al catalogo de arte",
]);

const flowAseo = addKeyword("2")
  .addAnswer(["Has ingresado al catálogo de aseo"])
  .addAnswer(
    "https://drive.google.com/file/d/1LkJoJHlypJ8-LpuhMN229GSofysYxHPm/view?usp=sharing",
    {
      delay: 2000,
    }
  );

const flowCacharro = addKeyword("3").addAnswer([
  "Has ingresado al catalogo de Cacharro",
]);
const flowPapeleria = addKeyword("5").addAnswer([
  "Has ingresado al catalogo de Papelería",
]);

const flowLineas = addKeyword(["pedir", "linea", "lineas"])
  .addAnswer([
    "1. *Arte*",
    "2, *Aseo*",
    "3, *Cacharro*",
    "4, *Cosméticos*",
    "5, *Institucional*",
    "6, *Papelería*",
    "7, *Tecnología*",
  ])
  .addAnswer("Selecciona tu opción de preferencia", null, null, [
    flowArte,
    flowCacharro,
    flowPapeleria,
    flowAseo,
    flowAsesor,
  ]);


const flowPrincipal = addKeyword(["hola", "ole", "alo"])
  .addAnswer(
    "🙌 Hola ¡Bienvenido al Chat Bot de la *Papelería Universal*! 🎉🖊️"
  )
  .addAnswer([
    "Estamos aquí para ayudarte con todo lo que necesites. Ya sea que busques útiles escolares, artículos de oficina, material para manualidades o cualquier otro producto, ¡lo tenemos! No dudes en preguntar por precios, disponibilidad o recomendaciones. ¡Estamos listos para hacer tu experiencia de compra rápida y sencilla!",
  ])
  //   .addAnswer("Cual es tu nombre completo", {
  //     delay: 1500,
  //   })
  .addAnswer("Escribe *pedir* si te interesa algo", null, null, [flowLineas]);

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal, flowAsesor]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
