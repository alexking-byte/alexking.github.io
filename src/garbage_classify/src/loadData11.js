const fs = require("fs");
const tf = require("@tensorflow/tfjs-node");
const { cos } = require("@tensorflow/tfjs-node");
const knnClassifier = require("@tensorflow-models/knn-classifier");
const mobilenet = require("@tensorflow-models/mobilenet");
const OUTPUT_DIR = "output";

const classifier = knnClassifier.create();

let net;

// 图片转为张量
const imgToX = (imgPath) => {
  const buffer = fs.readFileSync(imgPath);

  // 清除中间变量，节省内存
  return tf.tidy(() => {
    // 张量
    const imgTs = tf.node.decodeImage(new Uint8Array(buffer));

    // 图片resize
    const imgTsResized = tf.image.resizeBilinear(imgTs, [224, 224]);

    // 归一化到[-1, 1]之间
    // 224 * 224 * RGB * 1张
    return imgTsResized
      .toFloat()
      .sub(255 / 2)
      .div(255 / 2)
      .reshape([1, 224, 224, 3]);
  });
};

// 分批次读取数据
const batchReadData = async (data) => {
  const ds = tf.data.generator(function* () {
    const count = data.length;
    const batchSize = 32;

    for (let i = 0; i < count; i += batchSize) {
      const end = Math.min(i + batchSize, count);

      yield tf.tidy(() => {
        // 存放图片
        const inputs = [];
        // 存放label
        const labels = [];

        for (let j = i; j < end; j++) {
          const { imgPath, index } = data[j];
          // 输入张量
          const x = imgToX(imgPath);
          inputs.push(x);
          labels.push(index);
        }

        // 将inputs/labels数组转为tensor
        const xs = tf.concat(inputs);
        const ys = tf.tensor(labels);

        return {
          xs,
          ys,
        };
      });
    }
  });

  return ds;
};

// 加载数据
const getData = async (trainDir, outputDir) => {
  const classes = fs.readdirSync(trainDir).filter((n) => !n.includes("."));

  // 保存类别到文件
  fs.writeFileSync(`${outputDir}/classes.json`, JSON.stringify(classes));

  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Successfully loaded model');

  const data = [];


  classes.forEach((dir, index) => {
    fs.readdirSync(`${trainDir}/${dir}`)
      .filter((img) => img.match(/jpg$/))
      .slice(0, 10000) // TODO
      .forEach((filename) => {

        console.log("Loading：", dir, filename);

        // 图片相对路径
        const imgPath = `${trainDir}/${dir}/${filename}`;

          console.log("Loading：", imgPath);
      
        // Create an object from Tensorflow.js data API which could capture image
        // from the web camera as Tensor.
        //const webcam = await tf.data.webcam(webcamElement);
      
        // Reads an image from the webcam and associates it with a specific class
        // index.
   
          // Capture an image from the web camera.

          const imageData = fs.readFileSync(imgPath);

       //   const imageData = image instanceof Buffer ? image : await fsp.readFile(image);
          const tensor = net.infer(tf.node.decodeImage(new Uint8Array(imageData), 3), true);
          classifier.addExample(tensor, index);

      
          // Get the intermediate activation of MobileNet 'conv_preds' and pass that
          // to the KNN classifier.
         // const activation = net.infer(img, true);
      
          // Pass the intermediate activation to the classifier.
        //  classifier.addExample(activation, index);
          
          //console.log(str);
      
              // Dispose the tensor to release the memory.
       //   img.dispose();

 // });
});
});



let dataset = classifier.getClassifierDataset();
let datasetObj = {}
Object.keys(dataset).forEach((key) => {
  let data = dataset[key].dataSync();
  datasetObj[key] = Array.from(data);
});

let str = JSON.stringify(datasetObj)

 // let str = JSON.stringify( Object.entries(classifier.getClassifierDataset()).map(([label, data])=>[label, Array.from(data.dataSync()), data.shape]) );

  fs.writeFileSync(`${process.cwd()}/${OUTPUT_DIR}/model1.json`,str);

  console.log ("output model1:",`file://${process.cwd()}/${OUTPUT_DIR}/model1.json`);

  //await model.save(`file://${process.cwd()}/${OUTPUT_DIR}/`);

  // 打乱数据
  //tf.util.shuffle(data);

  // 分批次读取数据
  //const ds = await batchReadData(data);

  return {
    ds,
    classes,
  };


};

module.exports = getData;
