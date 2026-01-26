import { controls_type, PrismaClient } from "../../../generated/prisma/client";
import { IsoAssessmentNotFoundError } from "../../errors/isoAssessmentError";
import { AssessmentControlRepository } from "../../repositories/assessmentControlRepository";
import { ControlsRepository } from "../../repositories/controlsRepository";
import { IsoAssessmentRepository } from "../../repositories/isoAssessmentRepository";
import { CreateAssessmentControlDto, createAssessmentControlDto } from "../assessmentControl/assessmentControlDto";
import { CreateIsoAssessmentDto } from "./isoAssessmentDto";
import { CreateControlDto } from "../controls/controlsDto";
import { ISO27001_CONTROLS_CATALOG } from "../controls/iso27001-controls.catalog";

const CONTROL_COUNTS = {
	ORGANISATIONAL: 37,
	PEOPLE: 8,
	PHYSICAL: 14,
	TECHNOLOGICAL: 34,
} as const;

export class IsoAssessmentService {
	constructor(private prisma: PrismaClient,
		private isoAssessmentRepository: IsoAssessmentRepository,
		private assessmentControlRepository: AssessmentControlRepository,
		private controlsRepository: ControlsRepository
	) { }

	async createIso(data: CreateIsoAssessmentDto) {
		try {
			return await this.prisma.$transaction(async (tx) => {
				const isoAssessment = await this.isoAssessmentRepository.createWithTx(tx, data);
				const dtos: CreateAssessmentControlDto[] = [
					createAssessmentControlDto(
						"Organisational controls covering governance, policies, risk management, supplier relationships, incident management, and legal compliance for information security.",
						"ORGANIZATION",
						isoAssessment.id
					),

					createAssessmentControlDto(
						"People-related controls addressing information security responsibilities, awareness, training, screening, and behavior of employees and third parties.",
						"PEOPLE",
						isoAssessment.id
					),

					createAssessmentControlDto(
						"Physical controls focused on protecting facilities, equipment, and physical environments from unauthorized access, damage, or interference.",
						"PHYSICAL",
						isoAssessment.id
					),

					createAssessmentControlDto(
						"Technological controls covering secure operation of systems, networks, applications, access control, logging, monitoring, and secure software development.",
						"TECHNOLOGICAL",
						isoAssessment.id
					),
				];
				const createdAssessmentControls = await this.assessmentControlRepository.createManyWithTx(tx, dtos);
				const acIdByType = new Map<controls_type, number>();
				for (const ac of createdAssessmentControls) {
					acIdByType.set(ac.type, ac.id);
				}
				const controlDtos: CreateControlDto[] = ISO27001_CONTROLS_CATALOG.map((c) => ({
					code: c.code,
					name: c.name,
					description: c.description,
					guidance: c.guidance,
					assessmentControlId: acIdByType.get(c.type)!,
				}));

				await this.controlsRepository.createManyWithTx(tx, controlDtos);

				return isoAssessment;
			});
		}
		catch (error) {
			throw error;
		}
	}

	async summarizeIsoControls(id: number) {
		const res = await this.isoAssessmentRepository.getById(id);
		if (!res) {
			throw new IsoAssessmentNotFoundError(id);
		}
		const data = await this.isoAssessmentRepository.summary(id);
		return data;
	}

	async getIsoById(id: number) {
		return this.isoAssessmentRepository.getById(id);
	}

	async getAllIso() {
		return this.isoAssessmentRepository.getAll();
	}

	async getAllIsoByCompanyId(companyId: number) {
		return this.isoAssessmentRepository.getAllByCompanyId(companyId);
	}

	async updateIso(id: number, data: any) {
		return this.isoAssessmentRepository.update(id, data);
	}


	async deleteIso(id: number) {
		return this.isoAssessmentRepository.delete(id);
	}
}
