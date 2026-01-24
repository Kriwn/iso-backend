import cors from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { initLogger, logger } from "./config/logger";
import { loadEnv } from "./config/env";
import { getPrismaClient } from "./infrastructures/db/prisma/client";
import { getAuth } from "./utils/auth";
import { PrismaUserRepository } from "./infrastructures/db/prisma/repositories/prismaUserRepository";
import { UserService } from "./services/user/userService";
import swagger from "@elysiajs/swagger";
import { userController } from "./interfaces/userController";
import { PrismaCompanyRepository } from "./infrastructures/db/prisma/repositories/prismaCompanyRepository";
import { CompanyService } from "./services/company/companyService";
import { companyController } from "./interfaces/companyController";
import { PrismaIsoAssessmentRepository } from "./infrastructures/db/prisma/repositories/prismaIsoAssessmentRepository";
import { IsoAssessmentService } from "./services/isoAssessment/isoAssessmentService";
import { isoAssessmentController } from "./interfaces/isoAssessmentController";
import { PrismaAssessmentControlRepository } from "./infrastructures/db/prisma/repositories/prismaAssessmentControlRepository";
import { PrismaControlsRepository } from "./infrastructures/db/prisma/repositories/prismaControlsRepository";
import { controlsController } from "./interfaces/controlsController";
import { evidenceController } from "./interfaces/evidenceController";
import { EvidenceService } from "./services/evidence/evidenceService";
import { PrismaEvidenceRepository } from "./infrastructures/db/prisma/repositories/prismaEvidenceRepository";
import { PrismaSuggestionRepository } from "./infrastructures/db/prisma/repositories/prismaSuggestionRepository";
import { suggestionController } from "./interfaces/suggestionController";
import { SuggestionService } from "./services/suggestion/suggestionService";
import { AssessmentControlService } from "./services/assessmentControl/assessmentControlService";
import { assessmentControlController } from "./interfaces/AssessmentControlController";
import { LlmService } from "./services/llm/llmService";
import { ControlsService } from "./services/controls/controlsService";


const app = new Elysia({
  // normalize: false,
  aot: true,
});

const env = loadEnv(app);
initLogger(env.NODE_ENV);
logger.info("Init Env");
const prisma = getPrismaClient();


const auth = getAuth(prisma);

const userRepo = new PrismaUserRepository(prisma);
const userService = new UserService(userRepo, prisma);
const companyRepo = new PrismaCompanyRepository(prisma);
const companyService = new CompanyService(companyRepo);
const assessmentControlRepo = new PrismaAssessmentControlRepository(prisma);
const assessmentControlService = new AssessmentControlService(assessmentControlRepo);
const isoAssessmentRepo = new PrismaIsoAssessmentRepository(prisma);
const isoAssessmentService = new IsoAssessmentService(prisma,isoAssessmentRepo,assessmentControlRepo);
const llmService = new LlmService(env);
const evidenceRepo = new PrismaEvidenceRepository(prisma);
const evidenceService = new EvidenceService(evidenceRepo);
const suggestionRepo = new PrismaSuggestionRepository(prisma);
const suggestionService = new SuggestionService(suggestionRepo);
const controlRepo = new PrismaControlsRepository(prisma);
const controlService = new ControlsService(assessmentControlRepo, controlRepo,suggestionRepo,llmService);


// Better Auth route handler
app.all("/api/auth/*", async ({ request }) => {
  return auth.handler(request);
});

app.use(swagger({ path: "/docs" }))
  .use(userController(userService))
  .use(companyController(companyService))
  .use(isoAssessmentController(isoAssessmentService))
  .use(assessmentControlController(assessmentControlService))
  .use(controlsController(controlService))
  .use(evidenceController(evidenceService))
  .use(suggestionController(suggestionService));


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
  .get("/", () => "Hello Elysia")
  .listen(env.APP_PORT);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
