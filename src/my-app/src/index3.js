//const webcamElement = document.getElementById('webcam');
//@tensorflow-models/knn-classifier
const knnClassifier =require("@tensorflow-models/knn-classifier");
const mobilenet =require("@tensorflow-models/mobilenet");

const classifier = knnClassifier.create();
let net;

const video = document.getElementById('webcam');
const button = document.getElementById('button');
const select = document.getElementById('select');

const cv = document.getElementById('cv');

let currentStream;

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
 

///////////////////////////////////

console.log('Loading model.json..');

//fs.readFileSync(ファイルのパス, 文字コード, コールバック関数)
const fs = require('fs');

const data =fs.readFileSync('model1.json','utf8');
console.log ('model data: ',data.JSON);
console.log ('model data: ',data.toString);

      var tensorObj = JSON.parse(data);

      Object.keys(tensorObj).forEach((key) => {
      tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024]);
      })
      classifier.setClassifierDataset(tensorObj);
 

      console.log('Loading model.json..ok');

    

/*


const webcamElement = document.getElementById('webcam');

//const getData=()=>{
  fetch('https://alexking-byte.github.io/garbage-classify-tensorflowjs.github.io/model1.json',{
       headers : { 
         'Content-Type': 'application/json',
         'Accept': 'application/json'
        }
      }
     )
      .then(function(response){
         console.log(response)
         return response.json();
       })
        .then(function(data) {
           //console.log(myJson);
           var tensorObj = JSON.parse(data)
           Object.keys(tensorObj).forEach((key) => {
           tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024]);
           })
           classifier.setClassifierDataset(tensorObj);

         });
   //};
   
   React.useEffect(()=>{
     getData()
   },[])

fetch('model1.json')
  .then(response => response.text())
  .then(data => {
  	// Do something with your data
  	console.log("model1 data: ",data.length);

    var tensorObj = JSON.parse(data)
Object.keys(tensorObj).forEach((key) => {
tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024]);
})
classifier.setClassifierDataset(tensorObj);

  });

 //function fetchLocalResource(url) {        
    const req = new XMLHttpRequest();    
    req.onload = function() {
        const data = req.responseText;  
        // Do something with text...
        var tensorObj = JSON.parse(data)
        Object.keys(tensorObj).forEach((key) => {
        tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024]);
        })
        classifier.setClassifierDataset(tensorObj);
    };    
    req.open('GET', 'model1.json');
    req.send();
//}

  fs.readFile("model1.json", "utf-8", (err, dataset) => {
    if (err) throw err;
   
  
  var tensorObj = JSON.parse(dataset)
  Object.keys(tensorObj).forEach((key) => {
  tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024]);
  })
  classifier.setClassifierDataset(tensorObj);
  
  
  });
  */


/////////////////////////////////




  

  console.log('Successfully loaded model');

  // Create an object from Tensorflow.js data API which could capture image
  // from the web camera as Tensor.
 // var webcam = await tf.data.webcam(video);

  // Reads an image from the webcam and associates it with a specific class
  // index.
  const addExample = async classId => {
    // Capture an image from the web camera.
    //const img = await webcam.capture();

    const img = document.getElementById('imgf');

    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(img, true);

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);
   
    //let str = JSON.stringify( Object.entries(classifier.getClassifierDataset()).map(([label, data])=>[label, Array.from(data.dataSync()), data.shape]) );

    //console.log(str);

        // Dispose the tensor to release the memory.
    //img.dispose();
  };

  function saveModel() {
    let dataset = classifier.getClassifierDataset();
    let datasetObj = {}
    Object.keys(dataset).forEach((key) => {
      let data = dataset[key].dataSync();
      datasetObj[key] = Array.from(data);
    });
    let jsonStr = JSON.stringify(datasetObj)
    
    var link = document.createElement('a');
    link.download="model.json";
    link.href='data:text/text;charset=utf-8,' + encodeURIComponent(jsonStr);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  async function processimg(){

    const imgEl = document.getElementById('imgf');

       // Get the activation from mobilenet from the webcam.
     const activation = net.infer(  imgEl, 'conv_preds');
     // Get the most likely class and confidence from the classifier module.
     const result = await classifier.predictClass(activation);


     //const classes = ["00001冷蔵庫","00002シルバーカート",
     //"00003ビン","00004軍手","00005机","00006缶","00007乾電池","00008椅子","00009ペットボトル","00010エアコン"];
     //const classes = ["00007乾電池","00008椅子"];
     const classes =       ["000000000","00001乾電池","00003ビン","00006ペットボトル"];

     document.getElementById('ok').innerText = `
       prediction-img: ${classes[result.label]} \n
       probability-img: ${result.confidences[result.label]}
     `;

     // Dispose the tensor to release the memory.
     //imgEl.dispose();
}


  // When clicking a button, add an example for that class.
  document.getElementById('class-a').addEventListener('click', () => addExample(1));
 document.getElementById('class-b').addEventListener('click', () => addExample(2));
document.getElementById('class-c').addEventListener('click', () => addExample(3));

  document.getElementById('class-1').addEventListener('click', () => saveModel());
  //document.getElementById('class-2').addEventListener('click', () => getText());

  document.getElementById('class-3').addEventListener('click', () => processimg());
 //document.getElementById('button').addEventListener('click', () => changemodel());


 ///////////////////////////////////////////////////////////


function stopMediaTracks(stream) {
  stream.getTracks().forEach(track => {
    track.stop();
  });
}

function gotDevices(mediaDevices) {
  select.innerHTML = '';
  select.appendChild(document.createElement('option'));
  let count = 1;
  mediaDevices.forEach(mediaDevice => {
    if (mediaDevice.kind === 'videoinput') {
      const option = document.createElement('option');
      option.value = mediaDevice.deviceId;
      const label = mediaDevice.label || `Camera ${count++}`;
      const textNode = document.createTextNode(label);
      option.appendChild(textNode);
      select.appendChild(option);

      console.log("cv select.value : " ,count);

      select.value=count;

    }
  });
}

if (typeof currentStream !== 'undefined') {
  stopMediaTracks(currentStream);
}
const videoConstraints = {};
if (select.value === '') {
  videoConstraints.facingMode = 'environment';
} else {
  videoConstraints.deviceId = { exact: select.value };
cv.innerText=1;

}
const constraints = {
  video: videoConstraints,
  audio: false
};

navigator.mediaDevices
  .getUserMedia(constraints)
  .then(stream => {
    currentStream = stream;
    video.srcObject = stream;
    //webcam =  tf.data.webcam(video);
    cv.innerText=1;

    return navigator.mediaDevices.enumerateDevices();
  })
  .then(gotDevices)
  .catch(error => {
    console.error(error);
  });

   //webcam = await tf.data.webcam(video);

 
async function changemodel(){

  if (typeof currentStream !== 'undefined') {
    stopMediaTracks(currentStream);
  }
  const videoConstraints = {};
  if (select.value === '') {
    cv.innerText=0;
    videoConstraints.facingMode = 'environment';
  } else {
    videoConstraints.deviceId = { exact: select.value };
  }
  const constraints = {
    video: videoConstraints,
    audio: false
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      currentStream = stream;
      video.srcObject = stream;
      
      cv.innerText=1;

      //webcam =  tf.data.webcam(video);

    

         return navigator.mediaDevices.enumerateDevices();
    })
    .then(gotDevices)
    .catch(error => {
      console.error(error);
    });

    //webcam = await tf.data.webcam(webcamElement);

}


button.addEventListener('click', event => {
  if (typeof currentStream !== 'undefined') {
    stopMediaTracks(currentStream);
  }
  const videoConstraints = {};
  if (select.value === '') {
    cv.innerText=0;
    videoConstraints.facingMode = 'environment';
  } else {
    videoConstraints.deviceId = { exact: select.value };

  cv.innerText=1;

  }
  const constraints = {
    video: videoConstraints,
    audio: false
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      currentStream = stream;
      video.srcObject = stream;

      cv.innerText=1;

      return navigator.mediaDevices.enumerateDevices();
    })
    .then(gotDevices)
    .catch(error => {
      console.error(error);
    });
});


navigator.mediaDevices.enumerateDevices().then(gotDevices);


////////////////////////////////////////////////


document.getElementById('getModel').onchange = function (event) {

     console.log("getModel !!");

    var target = event.target || window.event.srcElement;
    var files = target.files;
    var fr = new FileReader();
    if (files.length>0) {
    fr.onload = function () {     
      var dataset = fr.result;
      var tensorObj = JSON.parse(dataset)
      Object.keys(tensorObj).forEach((key) => {
      tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024]);
      })

      console.log('Loading new mode..ok!!');

      classifier.setClassifierDataset(tensorObj);

    }
    fr.readAsText(files[0]);
    }
  };

  


  document.getElementById('imgModel').onchange = function (event) {

    console.log(" img clicked !!");

   var target = event.target || window.event.srcElement;
   var files = target.files;
   var fr = new FileReader();
   if (files.length>0) {
   fr.onload = function () {     

      document.getElementById("imgf").src = fr.result;

      document.getElementById('ok').innerText ="";

      processimg();
 
   }
   fr.readAsDataURL(files[0]);
   }

 };



  function getText(){
    // read text from URL location
    var request = new XMLHttpRequest();
    request.open('GET', 'http://www.puzzlers.org/pub/wordlists/pocket.txt', true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {

              var dataset = request.responseText;
              var tensorObj = JSON.parse(dataset)
              Object.keys(tensorObj).forEach((key) => {
              tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024]);
              })
              classifier.setClassifierDataset(tensorObj);

                return request.responseText;
            }
        }
    }
};

document.getElementById('console2').innerText ="start22..." + cv;

  while (  cv.innerText!=0) {
    if (classifier.getNumClasses() > 0) {
  
   
      if (cv.innerText==1){
   webcam = await tf.data.webcam(video);
   cv.innerText=2;
      }


      document.getElementById('console2').innerText ="start in..." + cv;
   

      const img = await webcam.capture();

      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(img, 'conv_preds');
      // Get the most likely class and confidence from the classifier module.
      const result = await classifier.predictClass(activation);

       //     const classes = ["00001冷蔵庫","00002シルバーカート",
      //"00003ビン","00004軍手","00005机","00006缶","00007乾電池","00008椅子","00009ペットボトル","00010エアコン"];

      const classes =       ["000000000","00001乾電池","00003ビン","00006ペットボトル"];

      document.getElementById('console2').innerText = `
        prediction-webcam: ${classes[result.label]} \n
        probability-webcam: ${result.confidences[result.label]}
      `;

      // Dispose the tensor to release the memory.
      img.dispose();
    }

    await tf.nextFrame();
  }



}



app();