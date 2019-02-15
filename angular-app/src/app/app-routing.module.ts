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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { StorageTypeComponent } from './StorageType/StorageType.component';
import { FieldComponent } from './Field/Field.component';
import { TruckComponent } from './Truck/Truck.component';
import { WHContainerComponent } from './WHContainer/WHContainer.component';
import { SensorDataComponent } from './SensorData/SensorData.component';
import { TempHumidDataComponent } from './TempHumidData/TempHumidData.component';
import { WeightDataComponent } from './WeightData/WeightData.component';
import { BatchComponent } from './Batch/Batch.component';

import { StakeholderComponent } from './Stakeholder/Stakeholder.component';
import { FarmerComponent } from './Farmer/Farmer.component';
import { TraderComponent } from './Trader/Trader.component';
import { SubcontracterComponent } from './Subcontracter/Subcontracter.component';
import { SensorComponent } from './Sensor/Sensor.component';

import { SupplyTraderComponent } from './SupplyTrader/SupplyTrader.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'StorageType', component: StorageTypeComponent },
  { path: 'Field', component: FieldComponent },
  { path: 'Truck', component: TruckComponent },
  { path: 'WHContainer', component: WHContainerComponent },
  { path: 'SensorData', component: SensorDataComponent },
  { path: 'TempHumidData', component: TempHumidDataComponent },
  { path: 'WeightData', component: WeightDataComponent },
  { path: 'Batch', component: BatchComponent },
  { path: 'Stakeholder', component: StakeholderComponent },
  { path: 'Farmer', component: FarmerComponent },
  { path: 'Trader', component: TraderComponent },
  { path: 'Subcontracter', component: SubcontracterComponent },
  { path: 'Sensor', component: SensorComponent },
  { path: 'SupplyTrader', component: SupplyTraderComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
