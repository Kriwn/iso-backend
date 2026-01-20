import { IsoAssessmentEntity } from "../entities/isoAssessmentEntity";
import { CreateIsoAssessmentDto, UpdateIsoAssessmentDto, UpdatePrivateIsoAssessmentDto } from "../services/isoAssessment/isoAssessmentDto";

//TODO create summarize methods and need to protect crate with the same
export interface IsoAssessmentRepository {

	create(data: CreateIsoAssessmentDto): Promise<IsoAssessmentEntity>;
	createWithTx(tx:any, data: CreateIsoAssessmentDto): Promise<IsoAssessmentEntity>;

	getAll(): Promise<IsoAssessmentEntity[]>;
	getById(id: number): Promise<IsoAssessmentEntity | null>;
	getAllByCompanyId(companyId: number): Promise<IsoAssessmentEntity[]>;

	update(id: number, data: UpdatePrivateIsoAssessmentDto): Promise<IsoAssessmentEntity>;

	// not use private update
	updatePrivate(id: number, data: UpdatePrivateIsoAssessmentDto): Promise<IsoAssessmentEntity>;

	delete(id: number): Promise<void>;
}
