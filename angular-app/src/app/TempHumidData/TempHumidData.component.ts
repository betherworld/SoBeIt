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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TempHumidDataService } from './TempHumidData.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-temphumiddata',
  templateUrl: './TempHumidData.component.html',
  styleUrls: ['./TempHumidData.component.css'],
  providers: [TempHumidDataService]
})
export class TempHumidDataComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  temperature = new FormControl('', Validators.required);
  humidity = new FormControl('', Validators.required);
  dataId = new FormControl('', Validators.required);
  sensor = new FormControl('', Validators.required);

  constructor(public serviceTempHumidData: TempHumidDataService, fb: FormBuilder) {
    this.myForm = fb.group({
      temperature: this.temperature,
      humidity: this.humidity,
      dataId: this.dataId,
      sensor: this.sensor
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceTempHumidData.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.mynetwork.TempHumidData',
      'temperature': this.temperature.value,
      'humidity': this.humidity.value,
      'dataId': this.dataId.value,
      'sensor': this.sensor.value
    };

    this.myForm.setValue({
      'temperature': null,
      'humidity': null,
      'dataId': null,
      'sensor': null
    });

    return this.serviceTempHumidData.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'temperature': null,
        'humidity': null,
        'dataId': null,
        'sensor': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.mynetwork.TempHumidData',
      'temperature': this.temperature.value,
      'humidity': this.humidity.value,
      'sensor': this.sensor.value
    };

    return this.serviceTempHumidData.updateAsset(form.get('dataId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceTempHumidData.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceTempHumidData.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'temperature': null,
        'humidity': null,
        'dataId': null,
        'sensor': null
      };

      if (result.temperature) {
        formObject.temperature = result.temperature;
      } else {
        formObject.temperature = null;
      }

      if (result.humidity) {
        formObject.humidity = result.humidity;
      } else {
        formObject.humidity = null;
      }

      if (result.dataId) {
        formObject.dataId = result.dataId;
      } else {
        formObject.dataId = null;
      }

      if (result.sensor) {
        formObject.sensor = result.sensor;
      } else {
        formObject.sensor = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'temperature': null,
      'humidity': null,
      'dataId': null,
      'sensor': null
      });
  }

}
