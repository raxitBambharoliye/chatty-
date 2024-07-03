import { MODEL } from "../constant";
import { USER } from "../model";
import logger from "../utility/logger";

class MQ {
  collection: any;

  setCollection(collectionName: string) {
    switch (collectionName) {
        case MODEL.USER_MODEL:
        this.collection = USER;
        break;
    }
  }

  async insertOne(collection: string, data: any) {
    try {
      this.setCollection(collection);
            return  await this.collection.create(data);
            
    } catch (error) {
      logger.error(`🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ CATCH ERROR IN insertOne: 🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ ::: ${error}`);
      console.log("error", error);
    }
    }
    
  async findOne(collection: string, query: any) {
    try {
      this.setCollection(collection);
            return  await this.collection.findOne(query);
    } catch (error) {
      logger.error(`🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ CATCH ERROR IN findOne: 🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ ::: ${error}`);
      console.log("error", error);
    }
    }
    async findById(collection: string, id: any) {
        try {
          this.setCollection(collection);
          return  await this.collection.findById(id);
        } catch (error) {
          logger.error(`🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ CATCH ERROR IN findById: 🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ ::: ${error}`);
          console.log("error", error);
        }
    }
    async find(collection: string, query: any) {
        try {
          this.setCollection(collection);
                return  await this.collection.find(query);
        } catch (error) {
          logger.error(`🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ CATCH ERROR IN find: 🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ ::: ${error}`);
          console.log("error", error);
        }
    }
    async findByIdAndUpdate(collection: string, id: any,data:any) {
        try {
          this.setCollection(collection);
                return  await this.collection.findByIdAndUpdate(id,data);
        } catch (error) {
          logger.error(`🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ CATCH ERROR IN findByIdAndUpdate: 🤦‍♂️🤦‍♂️🤦‍♂️🤦‍♂️ ::: ${error}`);
          console.log("error", error);
        }
    }
}

export default new MQ();
