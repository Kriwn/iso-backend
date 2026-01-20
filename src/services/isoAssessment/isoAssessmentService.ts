import { PrismaClient } from "../../../generated/prisma/client";
import { AssessmentControlRepository } from "../../repositories/assessmentControlRepository";
import { IsoAssessmentRepository } from "../../repositories/isoAssessmentRepository";
import { CreateAssessmentControlDto, createAssessmentControlDto } from "../assessmentControl/assessmentControlDto";
import { CreateIsoAssessmentDto } from "./isoAssessmentDto";

const CONTROL_COUNTS = {
	ORGANISATIONAL: 37,
	PEOPLE: 8,
	PHYSICAL: 14,
	TECHNOLOGICAL: 34,
} as const;

export class IsoAssessmentService {
	constructor(private prisma: PrismaClient,
		private isoAssessmentRepository: IsoAssessmentRepository,
		private assessmentControlRepository: AssessmentControlRepository
	) { }

	//TODO handle transaction error
	async createIso(data: CreateIsoAssessmentDto) {
		try {
			return await this.prisma.$transaction(async (tx) => {
				const isoAssessment = await this.isoAssessmentRepository.createWithTx(tx, data);
				const dtos: CreateAssessmentControlDto[] = [
					createAssessmentControlDto(37, "", "ORGANIZATION", isoAssessment.id),
					createAssessmentControlDto(8, "", "PEOPLE", isoAssessment.id),
					createAssessmentControlDto(14, "", "PHYSICAL", isoAssessment.id),
					createAssessmentControlDto(34, "", "TECHNOLOGICAL", isoAssessment.id),
				];

				await this.assessmentControlRepository.createManyWithTx(tx, dtos);
				return isoAssessment;
			});
		}
			catch (error) {
				throw error;
			}
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

	async updatePrivateIso(id: number, data: any) {
				return this.isoAssessmentRepository.updatePrivate(id, data);
			}

	async deleteIso(id: number) {
				return this.isoAssessmentRepository.delete(id);
			}
}
