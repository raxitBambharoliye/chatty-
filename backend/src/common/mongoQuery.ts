import { MODEL } from "../constant";
import { NotificationModal, USER,MessageModel, GroupModel } from "../model";
import logger from "../utility/logger";

class MQ {
  collection: any;

  setCollection(collectionName: string) {
    switch (collectionName) {
      case MODEL.USER_MODEL:
        this.collection = USER;
        break;
      case MODEL.NOTIFICATION_MODEL:
        this.collection = NotificationModal;
        break;
      case MODEL.MESSAGE_MODEL:
        this.collection = MessageModel;
        break;
      case MODEL.GROUP_MODEL:
        this.collection = GroupModel;
        break;
    }
  }

  async insertOne<T>(collection: string, data: any): Promise<T | null> {
    try {
      this.setCollection(collection);
      return await this.collection.create(data);
    } catch (error) {
      logger.error(`🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ CATCH ERROR IN insertOne: 🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ ::: ${error}`);
      console.log("error", error);
      return null;
    }
  }

  async findOne<T>(collection: string, query: any): Promise<T | null> {
    try {
      this.setCollection(collection);
      return await this.collection.findOne(query);
    } catch (error) {
      logger.error(`🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ CATCH ERROR IN findOne: 🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ ::: ${error}`);
      console.log("error", error);
      return null;
    }
  }
  async findById<T>(collection: string, id: any): Promise<T | null> {
    try {
      this.setCollection(collection);
      return await this.collection.findById(id);
    } catch (error) {
      logger.error(`🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ CATCH ERROR IN findById: 🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ ::: ${error}`);
      console.log("error", error);
      return null;
    }
  }
  async find<T>(
    collection: string,
    query: any,
    projection: any = {}
  ): Promise<T | null> {
    try {
      this.setCollection(collection);
      return await this.collection.find(query, projection);
    } catch (error) {
      logger.error(`🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ CATCH ERROR IN find: 🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ ::: ${error}`);
      console.log("error", error);
      return null;
    }
  }
  async findByIdAndUpdate<T>(
    collection: string,
    id: any,
    data: any,
    newReturn = false
  ): Promise<T | null> {
    try {
      this.setCollection(collection);
      return await this.collection.findByIdAndUpdate(id, data, {
        new: newReturn,
      });
    } catch (error) {
      logger.error(
        `🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ CATCH ERROR IN findByIdAndUpdate: 🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ ::: ${error}`
      );
      console.log("error", error);
      return null;
    }
  }

  async findWithPopulate<T>(collection: string, query: any, populateKey: any,populateProperty:any=""):Promise<T | null>{
    try {

      this.setCollection(collection);
      return await this.collection.find(query).populate(populateKey,populateProperty).exec();
    } catch (error) {
      logger.error(`🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ CATCH ERROR IN findWithPopulate: 🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ ::: ${error}`);
      console.log("error", error);
      return null;
    }
  }
  async findWithPagination<T>(collection:string, query:any, limit:number, page:number,sortQuery:any): Promise<T | null>{
    try {
      this.setCollection(collection);
      return await this.collection.find(query).skip((page - 1) * limit).limit(limit).sort(sortQuery).exec();
    } catch {
      return null;
    }
  }
  async countDocuments(collection: string, query: any) {
    try {
      this.setCollection(collection);
      return await this.collection.countDocuments(query);
    } catch (error) {
      logger.error(`🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ CATCH ERROR IN countDocuments: 🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ ::: ${error}`);
      console.log('error', error)
      return 0;
    }
  }

}

export default new MQ();
