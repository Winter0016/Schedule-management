import * as tf from '@tensorflow/tfjs';

// A simple classification model
const model = tf.sequential();

model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [34] })); // 34 inputs (17 keypoints * 2: x and y)
model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' })); // Binary classification

model.compile({
  optimizer: 'adam',
  loss: 'binaryCrossentropy',
  metrics: ['accuracy'],
});

// Function to classify pose
export const classifyPose = (pose) => {
  const keypoints = extractKeypoints(pose);
  const inputTensor = tf.tensor2d([keypoints]);

  const prediction = model.predict(inputTensor).dataSync()[0];
  return prediction > 0.5 ? 'Studying' : 'Not Studying';
};

// Helper function to extract keypoints from the PoseNet result
const extractKeypoints = (pose) => {
  return pose.keypoints.map(point => [point.position.x, point.position.y]).flat();
};
