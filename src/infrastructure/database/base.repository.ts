import { Document, Model, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { DatabaseException } from '@common/exceptions';
import { PaginationMeta } from '@common/interfaces';
import { generatePaginationMeta } from '@common/utils';

/**
 * Base Repository with common CRUD operations
 * Following Repository Pattern for data access abstraction
 */
export abstract class BaseRepository<T extends Document> {
    constructor(protected readonly model: Model<T>) { }

    /**
     * Find document by ID
     */
    async findById(id: string): Promise<T | null> {
        try {
            return await this.model.findById(id).exec();
        } catch (error) {
            throw new DatabaseException(`Error finding document by ID: ${(error as Error).message}`);
        }
    }

    /**
     * Find one document by filter
     */
    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOne(filter).exec();
        } catch (error) {
            throw new DatabaseException(`Error finding document: ${(error as Error).message}`);
        }
    }

    /**
     * Find all documents matching filter
     */
    async find(filter: FilterQuery<T> = {}): Promise<T[]> {
        try {
            return await this.model.find(filter).exec();
        } catch (error) {
            throw new DatabaseException(`Error finding documents: ${(error as Error).message}`);
        }
    }

    /**
     * Find with pagination
     */
    async findWithPagination(
        filter: FilterQuery<T>,
        page: number,
        limit: number,
        sort: Record<string, 1 | -1> = { createdAt: -1 }
    ): Promise<{ data: T[]; meta: PaginationMeta }> {
        try {
            const skip = (page - 1) * limit;
            const [data, total] = await Promise.all([
                this.model.find(filter).sort(sort).skip(skip).limit(limit).exec(),
                this.model.countDocuments(filter).exec(),
            ]);

            const meta = generatePaginationMeta(page, limit, total);

            return { data, meta };
        } catch (error) {
            throw new DatabaseException(`Error finding documents with pagination: ${(error as Error).message}`);
        }
    }

    /**
     * Create new document
     */
    async create(data: Partial<T>): Promise<T> {
        try {
            const document = new this.model(data);
            return await document.save();
        } catch (error) {
            throw new DatabaseException(`Error creating document: ${(error as Error).message}`);
        }
    }

    /**
     * Create multiple documents
     */
    async createMany(data: Partial<T>[]): Promise<T[]> {
        try {
            return await this.model.insertMany(data);
        } catch (error) {
            throw new DatabaseException(`Error creating documents: ${(error as Error).message}`);
        }
    }

    /**
     * Update document by ID
     */
    async updateById(id: string, data: UpdateQuery<T>, options?: QueryOptions): Promise<T | null> {
        try {
            return await this.model
                .findByIdAndUpdate(id, data, { new: true, runValidators: true, ...options })
                .exec();
        } catch (error) {
            throw new DatabaseException(`Error updating document: ${(error as Error).message}`);
        }
    }

    /**
     * Update one document matching filter
     */
    async updateOne(
        filter: FilterQuery<T>,
        data: UpdateQuery<T>,
        options?: QueryOptions
    ): Promise<T | null> {
        try {
            return await this.model
                .findOneAndUpdate(filter, data, { new: true, runValidators: true, ...options })
                .exec();
        } catch (error) {
            throw new DatabaseException(`Error updating document: ${(error as Error).message}`);
        }
    }

    /**
     * Update many documents matching filter
     */
    async updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<number> {
        try {
            const result = await this.model.updateMany(filter, data).exec();
            return result.modifiedCount;
        } catch (error) {
            throw new DatabaseException(`Error updating documents: ${(error as Error).message}`);
        }
    }

    /**
     * Delete document by ID
     */
    async deleteById(id: string): Promise<T | null> {
        try {
            return await this.model.findByIdAndDelete(id).exec();
        } catch (error) {
            throw new DatabaseException(`Error deleting document: ${(error as Error).message}`);
        }
    }

    /**
     * Delete one document matching filter
     */
    async deleteOne(filter: FilterQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOneAndDelete(filter).exec();
        } catch (error) {
            throw new DatabaseException(`Error deleting document: ${(error as Error).message}`);
        }
    }

    /**
     * Delete many documents matching filter
     */
    async deleteMany(filter: FilterQuery<T>): Promise<number> {
        try {
            const result = await this.model.deleteMany(filter).exec();
            return result.deletedCount;
        } catch (error) {
            throw new DatabaseException(`Error deleting documents: ${(error as Error).message}`);
        }
    }

    /**
     * Count documents matching filter
     */
    async count(filter: FilterQuery<T> = {}): Promise<number> {
        try {
            return await this.model.countDocuments(filter).exec();
        } catch (error) {
            throw new DatabaseException(`Error counting documents: ${(error as Error).message}`);
        }
    }

    /**
     * Check if document exists
     */
    async exists(filter: FilterQuery<T>): Promise<boolean> {
        try {
            const count = await this.model.countDocuments(filter).limit(1).exec();
            return count > 0;
        } catch (error) {
            throw new DatabaseException(`Error checking document existence: ${(error as Error).message}`);
        }
    }

    /**
     * Execute aggregation pipeline
     */
    async aggregate<R = unknown>(pipeline: unknown[]): Promise<R[]> {
        try {
            return await this.model.aggregate(pipeline).exec();
        } catch (error) {
            throw new DatabaseException(`Error executing aggregation: ${(error as Error).message}`);
        }
    }
}
