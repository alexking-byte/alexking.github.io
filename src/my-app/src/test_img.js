var file = document.getElementById('webchat');
var result = document.getElementById('result');




// File APIに対応しているか確認
if(window.File && window.FileReader && window.FileList && window.Blob) {
    function loadLocalImage(e) {
        // ファイル情報を取得
        var fileData = e.target.files[0];
        result.innerHTML=fileData;
        console.log(fileData); // 取得した内容の確認用


 
        // 画像ファイル以外は処理を止める
        if(!fileData.type.match('image.*')) {
            alert('画像を選択してください');
            return;
        }
 
        // FileReaderオブジェクトを使ってファイル読み込み
        var reader = new FileReader();
        // ファイル読み込みに成功したときの処理
        reader.onload = function() {
            var img = document.createElement('img');
                img.id = 'imgid';
            var targetImg = img;
            targetImg.width = 100;
            targetImg.height = 100;
            img.src = reader.result;
            result.appendChild(img);
            //result.innerHTML =img.src;
        }
        // ファイル読み込みを実行
        reader.readAsDataURL(fileData);
        

    }
    file.addEventListener('change', loadLocalImage, false);
    
 
/*
 const img =  document.getElementById("imgid");

      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(img, 'conv_preds');
      // Get the most likely class and confidence from the classifier module.
      const result = await classifier.predictClass(activation);

       //     const classes = ["00001冷蔵庫","00002シルバーカート",
      //"00003ビン","00004軍手","00005机","00006缶","00007乾電池","00008椅子","00009ペットボトル","00010エアコン"];

      const classes =       ["000000000","00001乾電池","00003ビン","00006ペットボトル"];

      document.getElementById('console').innerText = `
        prediction-webcam: ${classes[result.label]} \n
        probability-webcam: ${result.confidences[result.label]}
      `;
*/

} else {
    file.style.display = 'none';
    result.innerHTML = 'File APIに対応したブラウザでご確認ください';
}