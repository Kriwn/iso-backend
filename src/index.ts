import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import { loadEnv, initLogger, logger } from "./config";
import { getPrismaClient, PrismaUserRepository, PrismaCompanyRepository, PrismaAssessmentControlRepository, PrismaIsoAssessmentRepository, PrismaEvidenceRepository, PrismaSuggestionRepository, PrismaControlsRepository } from "./infrastructures";
import { userController, companyController, isoAssessmentController, assessmentControlController, controlsController, evidenceController, suggestionController } from "./interfaces";
import { AssessmentControlService, LlmService, EvidenceService, SuggestionService, ControlsService } from "./services";
import { CompanyService } from "./services/company/companyService";
import { IsoAssessmentService } from "./services/isoAssessment/isoAssessmentService";
import { UserService } from "./services/user/userService";
import { getAuth } from "./utils/auth";


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
