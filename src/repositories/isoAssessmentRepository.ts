import { IsoAssessmentEntity } from "../entities/isoAssessmentEntity";
import { CreateIsoAssessmentDto, UpdateIsoAssessmentDto } from "../services/isoAssessment/isoAssessmentDto";

export interface IsoAssessmentRepository {

	create(data: CreateIsoAssessmentDto): Promise<IsoAssessmentEntity>;
	createWithTx(tx:any, data: CreateIsoAssessmentDto): Promise<IsoAssessmentEntity>;

	getAll(): Promise<IsoAssessmentEntity[]>;
	getById(id: number): Promise<IsoAssessmentEntity | null>;
	getAllByCompanyId(companyId: number): Promise<IsoAssessmentEntity[]>;
	summary(id: number): Promise<any>;
	update(id: number, data: UpdateIsoAssessmentDto): Promise<IsoAssessmentEntity>;

	delete(id: number): Promise<void>;
}
