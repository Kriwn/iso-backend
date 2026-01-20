import cors from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { initLogger, logger } from "./config/logger";
import { loadEnv } from "./config/env";
import { CreateRedisClient } from "./infrastructures/db/redis/client";
import { getPrismaClient } from "./infrastructures/db/prisma/client";
import { RedisService } from "./infrastructures/db/redis/redisService";
import { z } from "zod";
import { getAuth } from "./utils/auth";
import { PrismaUserRepository } from "./infrastructures/db/prisma/repositories/prismaUserRepository";
import { UserService } from "./services/user/userService";
import swagger from "@elysiajs/swagger";
import { userController } from "./interfaces/userController";
import { PrismaCompanyRepository } from "./infrastructures/db/prisma/repositories/prismaCompanyRepository";
import { CompanyService } from "./services/company/companyService";
import { CompanyController } from "./interfaces/companyController";
import { PrismaIsoAssessmentRepository } from "./infrastructures/db/prisma/repositories/prismaIsoAssessmentRepository";
import { IsoAssessmentService } from "./services/isoAssessment/isoAssessmentService";
import { IsoAssessmentController } from "./interfaces/isoAssessmentController";
import { Prisma } from "../generated/prisma/browser";
import { PrismaIsoAssessmentControlRepository } from "./infrastructures/db/prisma/repositories/prismaAssessmentControlRepository";
import { PrismaControlsRepository } from "./infrastructures/db/prisma/repositories/prismaControlsRepository";
import { AssessmentControlService } from "./services/AssessmentControl/assessmentControlService";
import { ControlsService } from "./services/Controls/controlsService";
import { AssessmentControlController } from "./interfaces/assessmentControlController";
import { ControlsController } from "./interfaces/controlsController";

const app = new Elysia({
  // normalize: false,
  aot: true,
});

const env = loadEnv(app);
initLogger(env.NODE_ENV);
logger.info("Init Env");
const redis = CreateRedisClient(env);
const prisma = getPrismaClient();



const redisService = new RedisService(redis);




const userRepo = new PrismaUserRepository(prisma);
const userService = new UserService(userRepo);
const companyRepo = new PrismaCompanyRepository(prisma);
const companyService = new CompanyService(companyRepo);
const isoAssessmentRepo = new PrismaIsoAssessmentRepository(prisma);
const isoAssessmentService = new IsoAssessmentService(isoAssessmentRepo);
const assessmentControlRepo = new PrismaIsoAssessmentControlRepository(prisma);
const assessmentControlService = new AssessmentControlService(assessmentControlRepo);
const controlRepo = new PrismaControlsRepository(prisma);
const controlService = new ControlsService(controlRepo);

app.use(swagger({ path: "/docs" }))
  .use(userController(userService))
  .use(CompanyController(companyService))
  .use(IsoAssessmentController(isoAssessmentService))
  .use(AssessmentControlController(assessmentControlService))
  .use(ControlsController(controlService));


// Cors
app.use(
  cors({
    origin: true, // If set to true, Access-Control-Allow-Origin will be set to * (any origins)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 5, //defualt value
  })
)
app
  .get("/redis-test", async () => {
    const Message = z.object({
      message: z.string(),
    });

    await redisService.saveCache("test", { message: "Hello, Redis!" }, 1200);
    const data = await redisService.getCache("test", Message);

    if (!data) {
      logger.warn("No data found or failed to parse.");
      return { ok: false };
    }

    logger.info("Retrieved from Redis:", data);
    return { ok: true, data };
  })
  .get("/", () => "Hello Elysia")
  .listen(env.APP_PORT);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
