/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * Move soy beans from Truck to a container in the warehouse.
 * @param {org.example.mynetwork.SupplyTrader} tx
 * @transaction
 */
async function supplyTrader(tx) {

    // weight of the container before the transaction
    const containerWeight = tx.container.weight;

    if (containerWeight == 0) {
        // set the origin field of the container if not done yet
        tx.container.origin = tx.truck.origin;
    }
        // reject transaction if the container holds beans from a different field
        if (tx.container.origin != tx.truck.origin) {
        throw new Error("Container holds beans from a different field than the truck.")
    }

    // receive the weight measurement from the container scale in the warehouse
    // in our setup we use a pressure sensor as an IoT device
    // and put the data on the blockchain via ESP8266 and hyperledger composers REST server
    const weightDataRegistry = await getAssetRegistry("org.example.mynetwork.WeightData");
    const weightData = await weightDataRegistry.get(`${tx.container.storageId}_weight_data`);
    const delivery = weightData.weight.slice(-1).pop() - containerWeight;

    const batchWeightRegistry = await getAssetRegistry("org.example.mynetwork.Batch");
    const batchWeight = await batchWeightRegistry.get(`${tx.truck.origin.storageId}_batch`);
    // total amount of soy beans that were brought into the farmers warehouse
    const whWeight = batchWeight.warehouseWeight;
    // total amount of soy beans that were already sold to the trader from the specific field
    const traderWeight = batchWeight.traderWeight;

    // update soy beans in the truck and container
    tx.truck.weight -= delivery;
    tx.container.weight += delivery;

    // reject transaction if the trader would buy more beans from the specified field, than the field produced.
    // The fields produce is determined by scales in the combine harvesters and also estimated using satellite images.
    if ((traderWeight + delivery) >= whWeight) {
        throw new Error("The amount of produce in the trader's warehouse exceeds the farmer's produce.");
    }

    // update total amount of soy beans the trader received on the blockchain
    batchWeight.traderWeight += delivery;
    await batchWeightRegistry.update(batchWeight);

    // update the Truck data on the blockchain
    const truckRegistry = await getAssetRegistry("org.example.mynetwork.Truck");
    await truckRegistry.update(tx.truck);

    // update the warehouse container data on the blockchain
    const containerRegistry = await getAssetRegistry("org.example.mynetwork.WHContainer");
    await containerRegistry.update(tx.container);
}