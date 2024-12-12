const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");

/**
 * Declaramos las conexiones de Mongo
 */

// const contactos = [3103885613, 3217798798, 3157686880];
const contactos = [3217798798];
let numeroactual = 0;

const MONGO_DB_URI =
  "mongodb://root:example@localhost:27017/db_bot?authSource=admin&authMechanism=SCRAM-SHA-1";
const MONGO_DB_NAME = "db_bot";

// Función para seleccionar un número aleatorio del array 'contactos'
function obtenerNumeroAleatorio() {
  const indiceAleatorio = Math.floor(Math.random() * contactos.length);
  return contactos[indiceAleatorio];
}

const flujoDespedida = addKeyword(["chao", "adios"]).addAnswer([
  "¡Hasta luego! 👋👋👋",
]);

const flujoFinal = addKeyword(EVENTS.ACTION).addAnswer(
  "Se canceló por inactividad"
);

const flujoCallcenter = addKeyword("1", "1️⃣")
  .addAnswer("⬇ Por favor, presiona el link de abajo y serás atendido⬇", {
    delay: 1000,
  })
  .addAnswer(
    `https://wa.me/57${obtenerNumeroAleatorio()}?text=Hola%20callcenter.....%20`,
    {
      delay: 1000,
    }
  )
  .addAction(async (ctx, { addToBlackList, removeFromBlackList, gotoFlow }) => {
    const numero = ctx.from; // Obtenemos el número del usuario
    console.log("Número ingresando al flujo:", numero);
    numeroactual = numero;

    // // Agregamos el número a la blacklist para que no vuelva a activar el flujo principal
    // addToBlackList([numero]);

    // Aquí podemos redirigir a un flujo de atención o realizar alguna acción adicional si es necesario.
    // return gotoFlow(flujoCallcenter); // Esto es solo un ejemplo, puedes personalizarlo.
  });

const flujoPaola = addKeyword("2", "2️⃣")
  .addAnswer("⬇ Por favor, presiona el link de abajo y serás atendido⬇", {
    delay: 2000,
  })
  .addAnswer(
    `https://wa.me/57${obtenerNumeroAleatorio()}?text=Hola%20Paola%20luna.....%20`,
    {
      delay: 2000,
    }
  );
const flujoJennifer = addKeyword("3", "3️⃣")
  .addAnswer("⬇ Por favor, presiona el link de abajo y serás atendido⬇", {
    delay: 2000,
  })
  .addAnswer(
    `https://wa.me/57${obtenerNumeroAleatorio()}?text=Hola%20Jennifer.....%20`,
    {
      delay: 2000,
    }
  );
const flujoKaren = addKeyword("4", "4️⃣")
  .addAnswer("⬇ Por favor, presiona el link de abajo y serás atendido⬇", {
    delay: 2000,
  })
  .addAnswer(
    `https://wa.me/57${obtenerNumeroAleatorio()}?text=Hola%20Karen%20dayanna.....%20`,
    {
      delay: 2000,
    }
  );
const flujoCony = addKeyword("5", "5️⃣")
  .addAnswer("⬇ Por favor, presiona el link de abajo y serás atendido⬇", {
    delay: 2000,
  })
  .addAnswer(
    `https://wa.me/57${obtenerNumeroAleatorio()}?text=Hola%20Cony.....%20`,
    {
      delay: 2000,
    }
  );
const flujoJazmin = addKeyword("6", "6️⃣")
  .addAnswer("⬇ Por favor, presiona el link de abajo y serás atendido⬇", {
    delay: 2000,
  })
  .addAnswer(
    `https://wa.me/57${obtenerNumeroAleatorio()}?text=Hola%20Jazmin.....%20`,
    {
      delay: 2000,
    }
  );

const flujoAgendamientoProveedor = addKeyword("7", "7️⃣")
  .addAnswer("⬇ Por favor, presiona el link de abajo para agendamiento⬇", {
    delay: 2000,
  })
  .addAnswer(
    `https://docs.google.com/forms/d/e/1FAIpQLSd6Te7KZ0URTlt1OATssBXJnrdIlFn4eLjmlFjJ3H8fXuLX2g/viewform`,
    {
      delay: 2000,
    }
  );

// const flujoPrincipal = addKeyword(EVENTS.WELCOME)
const flujoPrincipal = addKeyword(["hola", "buenas", "alo"])
  .addAnswer(
    "🙌 Hola ¡Bienvenido al chat de la *Papelería Universal*! 🎉🖊️",
    {
      media: `https://res.cloudinary.com/dsbefctsf/image/upload/v1733254836/DEV/papelera_distribuidora_universal_cover_tpk1tf.jpg`,
    },
    {
      delay: 1000,
    }
  )
  .addAnswer(
    [
      "Estamos aquí para asesorarte con todo lo que necesites.",
      "Nuestros asesores son:",
    ],
    {
      delay: 1000,
    }
  )
  .addAnswer([
    "1️⃣. *Callcenter*",
    "2️⃣. *Paola Luna*",
    "3️⃣. *Jennifer*",
    "4️⃣. *Karen Dayanna*",
    "5️⃣. *Cony*",
    "6️⃣. *Jazmín*",
  ])
  .addAnswer(
    [
      "Selecciona tu opción de preferencia",
      "Debes de responder antes de que transcurran 2 minutos",
    ],
    { capture: true, idle: 60000 * 2 }, // idle: 2 minutos
    async (ctx, { gotoFlow, inRef }) => {
      console.log("CTX ==>", ctx.from);

      if (ctx?.idleFallBack) {
        // Si el tiempo de inactividad se ha agotado, se redirige al flujo final
        return gotoFlow(flujoFinal);
      }

      // Aquí verificamos si el usuario ya está en un flujo de atención
      if (ctx?.isInFlow) {
        return; // No hacer nada si ya está en un flujo de atención
      }

      // Si el usuario no está en un flujo, procedemos normalmente
      // Puedes agregar más lógica si lo deseas
    },
    [
      flujoCallcenter,
      flujoCony,
      flujoJazmin,
      flujoJennifer,
      flujoKaren,
      flujoPaola,
      flujoDespedida,
      flujoAgendamientoProveedor,
    ]
  );

const main = async () => {
  const adapterDB = new MockAdapter();
  // const adapterDB = new MockAdapter({
  //   dbUri: MONGO_DB_URI,
  //   // dbName: MONGO_DB_NAME,
  // });
  const adapterFlow = createFlow([
    flujoPrincipal,
    flujoDespedida,
    // flujoAsesor,
  ]);
  const adapterProvider = createProvider(BaileysProvider);
  createBot(
    {
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    },
    {
      blackList: [numeroactual],
    }
  );
  QRPortalWeb();
};

main();
