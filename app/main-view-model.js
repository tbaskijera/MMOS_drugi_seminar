import { Observable } from '@nativescript/core'

import * as application from '@nativescript/core/application';

export function MainViewModel() {
  const context = application.android.context;
  const SensorManager = context.getSystemService(android.content.Context.SENSOR_SERVICE);
  const startSensor = SensorManager.getDefaultSensor(android.hardware.Sensor.TYPE_LIGHT);
  const nativeDelay = android.hardware.SensorManager.SENSOR_DELAY_NORMAL;

  const viewModel = new Observable()

  let value = 0;
  const updateLightValue = newValue =>  value = newValue;
  
  let sensorListener = new android.hardware.SensorEventListener({
    onAccuracyChanged: (sensor, accuracy) => {},
    onSensorChanged: event => {
      updateLightValue(event.values[0])
      viewModel.set('light', event.values[0])
    }
  });

  SensorManager.registerListener(
    sensorListener,
    startSensor,
    nativeDelay
  );

  return viewModel
}