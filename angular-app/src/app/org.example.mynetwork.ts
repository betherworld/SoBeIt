import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.example.mynetwork{
   export class Stakeholder extends Participant {
      stakeholderId: string;
      name: string;
      location: string;
   }
   export class Farmer extends Stakeholder {
      certified: boolean;
   }
   export class Trader extends Stakeholder {
   }
   export class Subcontracter extends Stakeholder {
   }
   export class Sensor extends Participant {
      sensorId: string;
      location: string;
      description: string;
      storage: StorageType;
   }
   export class StorageType extends Asset {
      description: string;
      storageId: string;
      location: string;
      weight: number;
      owner: Stakeholder;
   }
   export class Field extends StorageType {
   }
   export class Truck extends StorageType {
      capacity: number;
      origin: Field;
   }
   export class WHContainer extends StorageType {
      capacity: number;
      origin: Field;
   }
   export class SensorData extends Asset {
      dataId: string;
      sensor: Sensor;
   }
   export class TempHumidData extends SensorData {
      temperature: number[];
      humidity: number[];
   }
   export class WeightData extends SensorData {
      weight: number[];
   }
   export class Batch extends Asset {
      batchId: string;
      fieldWeight: number;
      warehouseWeight: number;
      traderWeight: number;
      origin: Field;
   }
   export class SupplyTrader extends Transaction {
      truck: Truck;
      container: WHContainer;
   }
// }
