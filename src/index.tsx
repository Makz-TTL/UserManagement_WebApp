import Fastify from "fastify"
import fastifyHtml from "@kitajs/fastify-html-plugin"
import formbody from '@fastify/formbody'
import { validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from "./db"
import { usersTable } from "./db/schema"
import { eq } from 'drizzle-orm'
import { postsTable } from "./db/schema/post"
import fs from 'fs';

import MainLayout from "./layouts/MainLayout"
import BaseForm from "./layouts/BaseForm"
import BaseList from "./layouts/BaseList"
import ErrorPage from "./layouts/ErrorPage"
import BasePostForm from "./layouts/BasePostForm"
import LoginForm from "./layouts/loginForm"
import RegError from "./layouts/RegError"
import PasError from "./layouts/PasError"
import NoAuthError from "./layouts/NoAuthError"
import ServerError from "./layouts/ServerError"
import UserNotFoundError from "./layouts/UserNotFound"

import path from 'path';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import { pipeline } from 'stream/promises';

import fastifyMultipart from '@fastify/multipart';

const app = Fastify().withTypeProvider<ZodTypeProvider>().setValidatorCompiler(validatorCompiler)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.register(fastifyHtml);
app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

app.after(() => {
  if (app.hasContentTypeParser('application/x-www-form-urlencoded')) {
    app.removeContentTypeParser('application/x-www-form-urlencoded');
  }
  app.register(formbody);
});

const COOKIE_NAME = 'sessionId';

const generateCookie = (key: string, value: string, age: number) => {
  return `${key}=${value}; Max-Age=${age}; Path=/; HttpOnly; SameSite=Strict`;
}

const extractCookie = (cookieHeader: string, key: string): string | null => {
  const cookies = cookieHeader.split(';')
  for (const cookie of cookies) {
    const [cookieKey, cookieValue] = cookie.trim().split('=')
    if (cookieKey === key) {
      return cookieValue
    }
  }
  return null
}

const userLoggato = async (cookieHeader: string | undefined): Promise<number | null> => {
  if (!cookieHeader) return null;
  const sessionToken = extractCookie(cookieHeader, COOKIE_NAME);
  if (!sessionToken) return null;

  const rows = await db.select().from(usersTable).where(eq(usersTable.cookie, sessionToken)).limit(1);
  return rows[0] ? rows[0].id : null;
};

app.register(async function (instance) {
  instance.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/public/',
    decorateReply: false
  });
});

const loginSchema = {
  body: z.object({
    userName: z.string().min(1),
    password: z.string().min(1)
  })
}

const createUserSchema = {
  body: z.object({
    name: z.string().min(1),
    lastName: z.string().min(1),
    userName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string(),
  })
}

const updateUserSchema = {
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string().min(1),
    lastName: z.string().min(1),
    userName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional()
  })
}

const getUserParamSchema = {
  params: z.object({
    id: z.coerce.number()
  })
}

app.get("/home", async (req, res) => {
  return res.html(
    <MainLayout>
      <BaseForm />
    </MainLayout>
  )
})

app.get("/loginForm", async (req, res) => {
  return res.html(
    <MainLayout>
      <LoginForm />
    </MainLayout>
  )
})

app.post("/login", {
  schema: loginSchema
}, async (req, res) => {
  const body = req.body

  try {
    const rows = await db.select().from(usersTable).where(eq(usersTable.userName, body.userName)).limit(1)
    const dbUser = rows[0]

    if (!dbUser || dbUser.password !== body.password) {
      return res.code(400).html(<PasError />)
    }

    const CookieValue = Math.random().toString(36).substring(2)
    const cookieHeader = generateCookie(COOKIE_NAME, CookieValue, 60 * 60 * 24 * 7)
    res.header('Set-Cookie', cookieHeader)

    await db.update(usersTable).set({ cookie: CookieValue }).where(eq(usersTable.id, dbUser.id))

    return res.redirect(`/listUsers`)
  } catch (err) {
    console.error(err)
    return res.code(500).html(<ServerError />)
  }
})

app.post("/createUser", {
  schema: createUserSchema
}, async (req, res) => {
  const body = req.body
  const CookieValue = Math.random().toString(36).substring(2)
  const cookieHeader = generateCookie(COOKIE_NAME, CookieValue, 60 * 60 * 24 * 7)
  res.header('Set-Cookie', cookieHeader)

  try {
    const insertedRows = await db.insert(usersTable).values({
      name: body.name,
      lastName: body.lastName,
      userName: body.userName,
      email: body.email,
      password: body.password,
      phone: body.phone ? parseInt(body.phone) : undefined,
      cookie: CookieValue
    }).returning({ insertedId: usersTable.id });

    return res.redirect(`/listUsers`)
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.message.includes('unique')) {
      return res.code(400).html(<RegError />)
    }

    console.error(err)
    return res.code(500).html(<ServerError />)
  }
})

app.get("/newPost", async (req, res) => {
  const query = req.query as { authorId?: string };

  if (!query.authorId) {
    return res.redirect("/listUsers");
  }

  const targetAuthorId = parseInt(query.authorId);
  const currentUserId = await userLoggato(req.headers.cookie);

  if (currentUserId !== targetAuthorId) {
    return res.code(403).html(<NoAuthError />); 
  }

  const utentiDb = await db.select().from(usersTable);
  const utentiMappati = utentiDb.map(user => ({
    id: user.id,
    nome: user.name,
    cognome: user.lastName
  }));

  return res.html(
    <MainLayout>
      <BasePostForm utenti={utentiMappati} selectedAuthorId={targetAuthorId} />
    </MainLayout>
  )
})

app.post("/createPost", async (req, res) => {
  const data = await req.file()

  if (!data) {
    return res.code(400).send({ errore: 'Errore dati immagine' })
  }
  
  const authorId = parseInt((data.fields.authorId as any).value)
  const currentUserId = await userLoggato (req.headers.cookie);

  if (currentUserId !== authorId) {
    
    return res.code(403).html(<NoAuthError />);
  }

  const title = (data.fields.title as any).value
  const content = (data.fields.content as any).value

  let imageName: string | undefined = undefined
  if (data.filename) {
    imageName = `${Date.now()}_${data.filename}`
    const uploadPath = path.join(__dirname, '../public/uploads', imageName)
    if (!fs.existsSync(path.dirname(uploadPath))) {
      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
    }
    await pipeline(data.file, fs.createWriteStream(uploadPath))
  }
  
  await db.insert(postsTable).values({
    authorId: authorId,
    title: title,
    content: content,
    image: imageName
  })

  return res.redirect("/listUsers")
})

app.get("/listUsers", async (req, res) => {
  const currentUserId = await userLoggato   (req.headers.cookie);

  const utenti = await db.query.usersTable.findMany({
    with: {
      posts: true
    },
  })

  if (currentUserId) {
    utenti.sort((a, b) => {
      if (a.id === currentUserId) return -1;
      if (b.id === currentUserId) return 1;
      return 0;
    });
  }

  return res.html(
    <MainLayout>
      <BaseList utenti={utenti} currentUserId={currentUserId} />
    </MainLayout>
  )
})

app.post('/eliminaUtente/:id', {
  schema: getUserParamSchema
}, async (req, reply) => {
  const currentUserId = await userLoggato   (req.headers.cookie);

  if (currentUserId !== req.params.id) {
    return reply.code(403).html(<NoAuthError />);
  }

  await db.delete(postsTable).where(eq(postsTable.authorId, req.params.id))
  await db.delete(usersTable).where(eq(usersTable.id, req.params.id))
  
  reply.header('Set-Cookie', `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`);
  return reply.redirect("/loginForm")
})

app.get('/updateUser/:id', {
  schema: getUserParamSchema
}, async (req, reply) => {
  const currentUserId = await userLoggato   (req.headers.cookie);

  if (currentUserId !== req.params.id) {
    return reply.code(403).html(<NoAuthError />);
  }

  try {
    const searchId = req.params.id
    const rows = await db.select().from(usersTable).where(eq(usersTable.id, searchId)).limit(1)
    const dbUser = rows[0]

    if (!dbUser) {
      return reply.code(404).html(<UserNotFoundError />)
    }

    const utente = {
      id: dbUser.id,
      nome: dbUser.name,
      cognome: dbUser.lastName,
      email: dbUser.email,
      userName: dbUser.userName,
      phone: dbUser.phone ?? undefined,
      password: dbUser.password ?? ''
    }

    return reply.html(
      <MainLayout>
        <BaseForm utenteInModifica={utente} />
      </MainLayout>
    )

  } catch (err) {
    console.error(err)
    return reply.code(500).html(<ServerError />)
  }
})

app.post('/updateUtente/:id', {
  schema: updateUserSchema
}, async (req, reply) => {
  const currentUserId = await userLoggato  (req.headers.cookie);
  const targetId = parseInt(req.params.id);

  if (currentUserId !== targetId) {
    return reply.code(403).html(<NoAuthError />);
  }

  const body = req.body

  await db.update(usersTable)
    .set({
      name: body.name,
      lastName: body.lastName,
      userName: body.userName,
      email: body.email,
      phone: body.phone ? parseInt(body.phone) : undefined
    })
    .where(eq(usersTable.id, targetId))

  return reply.redirect("/listUsers")
})

app.listen({ port: 3001, host: "0.0.0.0" })
console.log("App is listening on port 3001")