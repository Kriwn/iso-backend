import { IsoAssessmentEntity } from "../entities/isoAssessmentEntity";
import { CreateIsoAssessmentDto, UpdateIsoAssessmentDto, UpdatePrivateIsoAssessmentDto } from "../services/isoAssessment/isoAssessmentDto";
export interface IsoAssessmentRepository {

	create(data: CreateIsoAssessmentDto): Promise<IsoAssessmentEntity>;

	getAll(): Promise<IsoAssessmentEntity[]>;
	getById(id: number): Promise<IsoAssessmentEntity | null>;
	getAllByCompanyId(companyId: number): Promise<IsoAssessmentEntity[]>;

	update(id: number, data: UpdatePrivateIsoAssessmentDto): Promise<IsoAssessmentEntity>;
	updatePrivate(id: number, data: UpdateIsoAssessmentDto): Promise<IsoAssessmentEntity>;

	delete(id: number): Promise<IsoAssessmentEntity>;
}
